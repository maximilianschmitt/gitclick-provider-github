'use strict';

var Api = require('github');
var Promise = require('bluebird');

var prompt = function(opts) {
  return new Promise(function(res) {
    require('inquirer').prompt(opts, res);
  });
};

var api = new Api({ version: '3.0.0' });
var createRepository = Promise.promisify(api.repos.create);

var githubProvider = {
  createRepository: function(options, auth) {
    auth.type = 'basic';
    api.authenticate(auth);
    options = parseOptions(options);

    return createRepository(options).then(parseRepository).catch(handleError);

    function handleError(err) {
      var message = JSON.parse(err.message);
      var providerError = new Error(message.message);
      providerError.name = 'ProviderError';
      if (message.errors) providerError.errors = message.errors;

      throw providerError;
    }
  },
  prompt: function() {
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
  }
};


// repository looks like this: https://developer.github.com/v3/repos/#get
function parseRepository(repository) {
  return {
    name: repository.name,
    owner: repository.owner.login,
    issues: repository.has_issues,
    wiki: repository.has_wiki,
    private: repository.private,
    cloneUrl: repository.clone_url,
    sshUrl: repository.ssh_url
  };
}

function parseOptions(options) {
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

module.exports = githubProvider;
