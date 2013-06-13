require('chai').should();
var sinon = require('sinon');

var path = require('path');
var dataDir = path.join(__dirname, 'data');

// mock parser
var mockConfigBadError = new Error('config could not be parsed');

var mockConfigOkData = {
  'widget': {
    'tizen:application': [
      { '$': { 'id': 'id' } }
    ],
    '$': { 'id': 'uri' }
   }
};

var mockParser = function (throwError) {
  var obj = {parseString: function () {}};

  var stub = sinon.stub(obj, 'parseString');

  if (throwError) {
    stub.callsArgWith(1, mockConfigBadError);
  }
  else {
    // invokes cb with cb(err, result); err is null if no error occurred;
    // the result is an object with structure
    // {
    //   'widget': {
    //    'tizen-application': [{ '$': { 'id': 'idstring' } }],
    //    '$': { 'id': 'uristring' }
    //   }
    // }
    stub.callsArgWith(1, null, mockConfigOkData);
  }

  return obj;
};

var TizenConfig = require('../../lib/tizen-config');

describe('TizenConfig', function () {
  it('getMeta() should invoke callback with error if file doesn\'t exist', function (done) {
    var tc = TizenConfig.create({
      parser: mockParser(true),
      configFile: path.join(dataDir, 'config.xml')
    });

    var cb = function () {
      var spy = sinon.spy();
      spy.apply(null, arguments);
      spy.calledWith(mockConfigBadError).should.be.true;
      done();
    };

    tc.getMeta(cb);
  });

  it('getMeta() should invoke callback with result object if config.xml parsed', function (done) {
    var tc = TizenConfig.create({
      parser: mockParser(),
      configFile: path.join(dataDir, 'config.xml')
    });

    var expectedResult = {uri: 'uri', id: 'id'};

    var cb = function () {
      var spy = sinon.spy();
      spy.apply(null, arguments);
      spy.calledWith(null, sinon.match(expectedResult)).should.be.true;
      done();
    };

    tc.getMeta(cb);
  });
});

describe('TizenConfig', function () {
  it('getMeta() should invoke callback with error if config.xml parse fails', function () {
  });
});
