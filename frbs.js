#!/usr/bin/env node

var url = require('url');
var RSVP = require('rsvp');
var Firebase = require('firebase');
var optimist = require('optimist')
	.usage('Firebase CLI Client\n\n' +
		'Usage:\nfrbs [options] [auth_token@]ref[/path]\n\n' +
		"If path ends with '/', output will be the result of 'child_added' event(s); otherwise 'value' event(s).")
	.boolean('help').describe('help', 'Display usage information')
	.boolean('d').alias('d', 'demo').describe('d', 'Use firebaseio-demo.com domain')
	.boolean('m').alias('m', ['min', 'minify']).describe('m', 'Minify output')
	.boolean('f').describe('f', 'Wait for new data instead of terminating')
;

var argv = optimist.argv;

var isDirectory = function(path) {
	return path && path.length > 0 && path[path.length-1] === '/';
};

var format = (argv.m ?
	function(value) { return JSON.stringify(value); } :
	function(value) { return JSON.stringify(value, null, '\t'); }
);

if(argv.h || argv._.length !== 1) {
	console.error(optimist.help());
} else {
	var u = url.parse('firebase://' + argv._[0]);
	var ref = new Firebase('https://' + u.hostname + (argv.d ? '.firebaseio-demo.com/' : '.firebaseio.com/'));

	if(u.pathname && u.pathname.length > 1) {
		ref = ref.child(u.pathname.substring(1));
	}

	var ready = new RSVP.Promise(function(resolve, reject) {
		if(u.auth) {
			ref.auth(u.auth, function(error, result) {
				if(error) {
					reject(error);
				} else {
					resolve();
				}
			});
		} else {
			resolve();
		}
	});

	ready.then(function() {
		if(isDirectory(u.pathname)) {
			ref.on('child_added', function(snapshot) {
				var value = snapshot.val();
				if(value !== null) {
					var o = {};
					o[snapshot.name()] = value;
					console.log(format(o));
				}
			});
		} else {
			ref.once('value', function(snapshot) {
				var value = snapshot.val();
				if(value !== null) {
					console.log(format(value));
				}
			});
		}

		if(!argv.f) {
			ref.on('value', function() {
				process.exit();
			});
		}
	}, function(error) {
		console.error('Login failed:', error);
		process.exit(1);
	});
}

