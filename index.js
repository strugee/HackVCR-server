/*global require process*/

'use strict';

var fs = require('fs');
var net = require('net');

var sink = process.stdout;
var ctlpath = '/tmp/' + process.getuid() + '-hackvcr.sock';

var ctl = net.createServer(function(con) {
	console.log('Client connected.');
	
	con.on('end', function() {
		console.log('Client disconnected.');
	});
	
	con.on('data', function(str) {
		sink.write(str);
	});
	
	con.write('HACKVCR\n');
	con.write('VERSION 0.1\n');
	con.write('CAPABILITY EDITOR_FILE\n');
	con.write('END\n');
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
