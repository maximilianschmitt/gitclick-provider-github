'use strict';

var ApiMock = function() {};

ApiMock.__predefined__ = {
	login: 'gitclick-test'
};

ApiMock.prototype = {
	authenticate: function() {},
	repos: {
		create: function(request, cb) {
			cb(null, {
				name: request.name,
				owner: {
					login: ApiMock.__predefined__.login
				},
				has_issues: request.has_issues,
				private: request.private,
				has_wiki: request.has_wiki,
				clone_url: 'https://github.com/' + ApiMock.__predefined__.login + '/' + request.name + '/',
				ssh_url: 'git@github.com:' + ApiMock.__predefined__.login + '/' + request.name + '/',
				git_url: 'git://github.com/' + ApiMock.__predefined__.login + '/' + request.name + '/'
			});
		}
	}
};

module.exports = ApiMock;