/* global describe */
'use strict';

var proxyquire = require('proxyquire');
var testUtil = require('gitclick-test-util');
var ApiMock = require('./api-mock');
var githubProvider = proxyquire('../lib/gitclick-provider-github', { 'github': ApiMock });

describe('githubProvider', function() {
  describe('createRepository', function() {
    testUtil.testProvider(githubProvider);
  });
});
