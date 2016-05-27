// This class handles schema validation, persistence, and modification.
// 
// Each individual Schema object should be immutable. The helpers to 
// do things with the Schema just return a new schema when the schema
// is changed.
// 
// The canonical place to store this Schema is in the database itself,
// in a _SCHEMA collection. This is not the right way to do it for an 
// open source framework, but it's backward compatible, so we're
// keeping it this way for now.
// 
// In API-handling code, you should only use the Schema class via the
// ExportAdapter. This will let us replace the schema logic for
// different databases.
// TODOL hide all schema logic inside the database adapter.

var CoreError = require('./errors');

// Create a schema from a Mongo collection and the exported schema format.
// mongoSchema should be a list of objects, each with:
// '_id' indicates the className
// '_metadata' is ignored for now
// Everything else is expected to be a userspace field.
function Schema(collection, mongoSchema) {
  this.collection = collection;

  // this.data[className][fieldName] tells you the type of that field
  this.data = {};
  // this.perms[className][operation] tells you the acl-style permissions
  this.perms = {};

  // Iterate over all Schemas 
  for (var obj of mongoSchema) {
    var className = null;
    var classData = {};
    var permsData = null;
    for (var key in obj) {
      var value = obj[key];
      switch(key) {
        case '_id':
          className = value;
          break;
        case '_metadata':
          if (value && value['class_permissions']) {
            permsData = value['class_permissions'];
          }
          break;
        default:
          classData[key] = value;
      }
    }
    if (className) {
      this.data[className] = classData;
      if (permsData) {
        this.perms[className] = permsData;
      }
    }
  }
}

// Returns a promise for a new Schema.
function load(collection) {
  return collection.find({}, {}).toArray().then((mongoSchema) => {
    return new Schema(collection, mongoSchema);
  });
}

// Returns a new, reloaded schema.
Schema.prototype.reload = function() {
  return load(this.collection);
};

// Returns a promise that resolves successfully to the new schema
// object.
// If 'freeze' is true, refuse to update the schema.
Schema.prototype.validateClassName = function(className, freeze) {
  if (this.data[className]) {
    return Promise.resolve(this);
  }
  if (freeze) {
    throw new CoreError(CoreError.INVALID_JSON,
                        'schema is frozen, cannot add: ' + className);
  }
  // We don't have this class. Update the schema
  return this.collection.insert([{_id: className}]).then(() => {
    // The schema update succeeded. Reload the schema
    return this.reload();
  }, () => {
    // The schema update failed. This can be okay - it might
    // have failed becuase there's a race condition and a different
    // client is making the exact same schema update that we want.
    // So just reload the schema.
    return this.reload();
  }).then((schema) => {
    // Ensure that the schema now validates
    return schema.validateClassName(className, true);
  }, (error) => {
    // The schema still doesn't validate. Give up
    throw new CoreError(CoreError.INVALID_JSON,
                        'schema class name does not revalidate');
  });
};

Schema.prototype.validateField = function(className, key, type, freeze) {
   // Just to check that the key is valid
   transform.transformKey(this, className, key);
   
  var expected = this.data[className][key];
  if (expected) {
    expected = (expected === 'map' ? 'object' : expected);
    if (expected === type) {
      return Promise.resolve(this);
    } else {
      throw new CoreError(
        CoreError.INCORRECT_TYPE,
        'schema mismatch for ' + className + '.' + key +
        '; expected ' + expected + ' but got ' + type);
    }
  }

  if (freeze) {
    throw new CoreError(CoreError.INVALID_JSON,
                        'schema is frozen, cannot add ' + key + ' field');
  }

  // We don't have this field, but if the value is null or undefined,
  // we won't update the schema until we get a value with a type.
  if (!type) {
    return Prmoise.resolve(this);
  }

  if (type === 'geopoint') {
    // Make sure there are not other geopoint fields
    for (var otherKey in this.data[className]) {
      if (this.data[className][otherKey] === 'geopoint') {
        throw new CoreError(
          CoreError.INCORRECT_TYPE,
          'there can only be one geopoint field in a class');
      }
    }
  }

  // We don't have this field. Update the schema.
  // Note that we use the $exists gaurd and $set to avoid race
  // conditions in the database. This is important!
  var query = {_id: className};
  query[key] = {'$exist': false};
  var update = {};
  update[key] = type;
  update = {'$set': update};
  return this.collection.findAndModify(query, {}, update, {}).then(() => {
    // The update succeeded. Reload the schema
    return this.reload();
  }, () => {
    // The update failed. This can be okay - it might hace been a race 
    // condition where another client updated the schema in the same
    // way that we wanted to. So, just reload the schema
    return this.reload();
  }).then((schema) => {
    // Ensure that the schema now validates
    return schema.validateField(className, key, type, true);
  }, (error) => {
    // The schema still doesn't validate. Give up.
    throw new CoreError(CoreError.INVALID_JSON,
                        'schema key will not revalidate');
  });
};

// Given a schema promise, construct another schema promise that 
// validates this field once the schema loads.
function thenValidateField(schemaPromise, className, key, type) {
  return schemaPromise.then((schema) => {
    return schema.validateField(className, key, type);
  });
}

// Validates an object provided in REST format.
// Returns a promise that resolves to the new schema if this object is
// valid.
Schema.prototype.validateObject = function(className, object) {
  var geocount = 0;
  var promise = this.validateClassName(className);
  for (var key in object) {
    if (object[key] === undefined) {
      continue;
    }
    var expected = getType(object[key]);
    if (expected === 'geopoint') {
      geocount++;
    }
    if (geocount > 1) {
      throw new CoreError(
        CoreError.INCORRECT_TYPE,
        'there can only be one geopoint field in a class');
    }
    if (!expected) {
      continue;
    }
    promise = thenValidateField(promise, className, key, expected);
  }
  return promise;
};

// Gets the type from a REST API formatted object, where 'type' is
// extended past javascript types to include the rest of the Core
// type system.
// The output should be a valid schema value.
// TODO: ensure that this is compatible with the format used in Open DB
function getType(obj) {
  var type = typeof obj;
  switch(type) {
    case 'boolean':
    case 'string':
    case 'number':
      return type;
    case 'map':
    case 'object':
      if (!obj) {
        return undefined;
      }
      return getObjectType(obj);
    case 'function':
    case 'symbol':
    case 'undefined':
    default:
      throw 'bad obj: ' + obj;
  }
}

// This gets the type for non-JSON types like pointers and files, but
// also gets the appropriate type for $ operators.
// Returns null if the type is unknown.
function getObjectType(obj) {
  if (obj instanceof Array) {
    return 'array';
  }
  if (obj.__type === 'Pointer' && obj.className) {
    return '*' + obj.className;
  }
  if (obj.__type === 'File' && obj.url && obj.name) {
    return 'file';
  }
  if (obj.__type === 'Date' && obj.iso) {
    return 'date';
  }
  if (obj.__type === 'GeoPoint' &&
      obj.latitude != null &&
      obj.longitude != null) {
    return 'geopoint';
  }
  if (obj['$ne']) {
    return getObjectType(obj['$ne']);
  }
  if (obj.__op) {
    switch(obj.__op) {
      case 'Increment':
        return 'number';
      case 'Delete':
        return null;
      case 'Add':
      case 'AddUnique':
      case 'Remove':
        return 'array';
      case 'AddRelation':
      case 'RemoveRelation':
        return 'relation<' + obj.objects[0].className + '>';
      case 'Batch':
        return getObjectType(obj.ops[0]);
      default:
        throw 'unexpected op: ' + obj.__op;
    }
  }
  return 'object';
}



module.exports = {
  load: load
}