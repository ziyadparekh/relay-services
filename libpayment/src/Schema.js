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
// DatabaseController. This will let us replace the schema logic for
// different databases.
// TODO: hide all schema logic inside the database adapter.

// Valid classes must:
// Be one of _Card, _Account, _Role
function classNameIsValid(className) {
  return (
    className === '_Card' ||
    className === '_Account' ||
    className === '_Role'
  );
};

module.exports = {
  classNameIsValid: classNameIsValid
};