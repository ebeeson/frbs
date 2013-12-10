#!/usr/bin/env node

var url = require('url');
var Firebase = require('firebase');
var optimist = require('optimist')
	.usage('Firebase CLI Client\n\nUsage:\nfrbs [options] [auth_token@]ref[/path]')
	.boolean('h').alias('h', 'help').describe('h', 'Display usage information')
	.boolean('d').alias('d', 'demo').describe('d', 'Use firebaseio-demo.com domain')
	.boolean('m').alias('m', ['min', 'minify']).describe('m', 'Minify output')
;

var dumpSnapshotValue = function(snapshot) {
	console.log(argv.m ? JSON.stringify(snapshot.val()) : JSON.stringify(snapshot.val(), null, '\t'));
	process.exit();
};

var argv = optimist.argv;
if(argv.h || argv._.length !== 1) {
	console.error(optimist.help());
} else {
	var u = url.parse('firebase://' + argv._[0]);
	var ref = new Firebase('https://' + u.hostname + (argv.d ? '.firebaseio-demo.com/' : '.firebaseio.com/'));
	if(u.pathname && u.pathname.length > 1) {
		ref = ref.child(u.pathname.substring(1));
	}

	if(u.auth) {
		ref.auth(u.auth, function(error, result) {
			if(error) {
				console.error('Login failed:', error);
				process.exit(1);
			} else {
				ref.once('value', dumpSnapshotValue);
			}
		});
	} else {
		ref.once('value', dumpSnapshotValue);
	}
}

