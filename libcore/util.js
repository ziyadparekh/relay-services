
function encode(value) {
  if (toString.call(value) === '[object Date]') {
    if (isNaN(value)) {
      throw new Error('Tried to encode an invalid date.');
    }
    return { __type: 'Date', iso: value.toJSON() };
  }
  
  if (Array.isArray(value)) {
    return value.map((v) => {
      return encode(v);
    });
  }

  if (value && typeof value === 'object') {
    var output = {};
    for (var k in value) {
      output[k] = encode(value[k]);
    }
    return output;
  }

  return value;
}

module.exports = {
  encode: encode
}