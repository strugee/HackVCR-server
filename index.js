/*global require process*/

'use strict';

var fs = require('fs');
var net = require('net');

var endcmds = ['VERSION', 'CAPABILITY', 'END'];

var sink = process.stdout;
var ctlpath = '/tmp/' + process.getuid() + '-hackvcr.sock';
var ctl = net.createServer(function(con) {
	console.log('Client connected.');
	
	var cmdbuf = '';
	
	con.on('end', function() {
		console.log('Client disconnected.');
	});
		
	con.write('HACKVCR\n');
	con.write('VERSION 0.1\n');
	con.write('CAPABILITY EDITOR_FILE\n');
	con.write('END\n');
	
	con.on('data', function(str) {
		str = str.toString();
		cmdbuf = cmdbuf + str;
		
		cmdbuf = cmdbuf.trim() + '\n';

		// TODO: this code has subtle race conditions if two commands come through at once

		for (var i in endcmds) {
			
			var match = cmdbuf.match(new RegExp('^[^]*\n' + endcmds[i] + '.*$', 'm'));
			if (match != null) {
				if (match.length != 1) {
					console.log(match);
					throw new Error();
				}
				var result = {};
				result.raw = match[0];
				result.processed = match[0].replace(endcmds[i], '').trim();
				result.method = endcmds[i];
				console.log(result);
			}
		}
	});
});

ctl.listen(ctlpath, function() {
	console.log('Listening on' + ctlpath + '.');
});

// TODO: this exit handling stuff is kinda sketchy

function handleExit(code) {
	console.log('Cleaning up...');
	fs.unlinkSync(ctlpath);
	// Run only once
	handleExit = new Function();
}

process.on('SIGINT', function(code) {
	handleExit(code);
	process.exit(code);
});

process.on('exit', function(code) {
	handleExit(code);
});
