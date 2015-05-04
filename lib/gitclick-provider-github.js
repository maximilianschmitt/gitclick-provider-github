'use strict';

var Api           = require('github');
var _             = require('underscore');
var Promise       = require('bluebird');
var util          = require('util');
var gutil         = require('gitclick-util');
var Provider      = gutil.Provider;
var ProviderError = gutil.errors.ProviderError;

var prompt = function(opts) {
  return new Promise(function(res) {
    require('inquirer').prompt(opts, res);
  });
};

var GitHubProvider = function() {
  this.api = new Api({ version: '3.0.0' });
  Provider.apply(this, arguments);
};

util.inherits(GitHubProvider, Provider);

GitHubProvider.prompt = function() {
  return prompt([
    {
      name: 'username',
      message: 'GitHub Username or E-Mail',
      type: 'input'
    },
    {
      name: 'password',
      message: 'GitHub Password or Access Token',
      type: 'password'
    }
  ]);
};

GitHubProvider.prototype = _.extend(GitHubProvider.prototype,
  {
    createRepository: function(options) {
      this.api.authenticate(this.config.auth);

      options = this.parseOptions(this.extendOptions(options));

      var createRepository = Promise.promisify(this.api.repos.create);
      return createRepository(options)
      .catch(function(err) {
        var message = JSON.parse(err.message);
        var providerError = new ProviderError(message.message);
        if (message.errors) providerError.errors = message.errors;

        throw providerError;
      })
      .then(this.parseRepository);
    },

    // repository looks like this: https://developer.github.com/v3/repos/#get
    parseRepository: function(repository) {
      return {
        name: repository.name,
        owner: repository.owner.login,
        issues: repository.has_issues,
        wiki: repository.has_wiki,
        private: repository.private,
        cloneUrl: repository.clone_url,
        sshUrl: repository.ssh_url
      };
    },

    parseOptions: function(options) {
      if (typeof options.issues !== 'undefined') {
        options.has_issues = options.issues;
        delete options.issues;
      }

      if (typeof options.wiki !== 'undefined') {
        options.has_wiki = options.wiki;
        delete options.wiki;
      }
      return options;
    }
  }
);

module.exports = GitHubProvider;