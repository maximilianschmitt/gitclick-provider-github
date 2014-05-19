/* global describe, it, before, beforeEach, after */
'use strict';

var rewire         = require('rewire');
var testUtil       = require('gitclick-test-util');

var GithubProvider = rewire('../lib/gitclick-provider-github');
GithubProvider.__set__('Api', require('./api-mock'));

testUtil.testProvider(GithubProvider);