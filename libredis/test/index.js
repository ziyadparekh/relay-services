"use strict";

var expect = require('chai').expect;
var Redis = require("../index");

var f = true;

describe("#test", function () {
  it("should test", function () {
    expect(f).to.equal(true)
  });

  it("should set a key to a value", function (done) {
    var key = "this is a key";
    var val = "some string to store in redis";

    Redis.set(key, val).then(function () {
      return Redis.get(key);
    }).then(function (reply) {
      expect(reply).to.equal(val);
      done();
    });
  });

  it("should format error messages correctly", function () {
    var test = "error message key1 val1";
    var test2 = "error message val1";
    var msg = Redis.formatError("error message", "key1", "val1");
    var msg2 = Redis.formatError("error message", "val2");
    
    expect(msg).to.equal(test);
    expect(msg2).to.not.equal(test2);
  });
});