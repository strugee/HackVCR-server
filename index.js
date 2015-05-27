/*global require process*/

'use strict';

var fs = require('fs');
var net = require('net');

// Polyfills. In Node. :/
require('string.prototype.startswith');

var endcmds = ['VERSION', 'CAPABILITY', 'END'];

var sink = process.stdout;
var ctlpath = '/tmp/' + process.getuid() + '-hackvcr.sock';
var ctl = net.createServer(function(con) {
	console.log('Client connected.');
	
	var client = {};
	client.version = null;
	client.capability.editor.file = false;
	// Connection mode, e.g. file, diff, screenshot, etc.
	var mode = 'HANDSHAKE';
	
	// Data recieved from the stream
	var cmdBuf = '';
	// Data that's been processed from cmdBuf
	var processedCmdBuf = '';
	
	con.on('end', function() {
		console.log('Client disconnected.');
	});
	
	con.write('HACKVCR\n');
	con.write('VERSION 0.1\n');
	con.write('CAPABILITY EDITOR_FILE\n');
	con.write('END\n');
	
	con.on('data', function(str) {
		str = str.toString();
		cmdBuf = cmdBuf + str;
		
		cmdBuf = cmdBuf.trim() + '\n';
		
		// Split by newlines, then strip empty indexes
		var cmdBufArr = cmdBuf.split('\n').filter(function(i) {return i != '';});
		
		for (var i in cmdBufArr) {
			if (mode === 'HANDSHAKE') {
				var handshakeCmd = cmdBufArr[i];
				if (handshakeCmd !== 'VERSION'
				    || handshakeCmd !== 'CAPABILITY'
				    || handshakeCmd !== 'END'
				   ) {
					   handshakeCmd = handshakeCmd.split(' ');
					   // Client's command was legal during handshake
					   if (handshakeCmd.startsWith('VERSION') {
						   client.version = handshakeCmd[1];
					   } else if (handshakeCmd.startsWith
				   } else {
					   // Client's command was forbidden before handshake
					   con.write('ERROR\n');
					   break;
				   }
			}
			
			if (cmdBufArr[i] === 'END') {
				if (mode === 'FILE') {
					// TODO: this should be JSON or somesuch
					sink.write(processedCmdBuf);
					processedCmdBuf = '';
				} else {
					console.log('Generated error while handling mode in END');
					con.write('ERROR\n');
				}
				mode = 'TRANSITIONING';
				console.log('Section ended.');
			} else if (cmdBufArr[i].startsWith('CAPABILITY')) {
				// TODO: set connection capabilities
				console.log('Registered capability.');
			} else if (cmdBufArr[i] === 'FILE') {
				mode = 'FILE';
				console.log('Waiting to receive file data.');
			} else {
				if (mode === 'FILE') {
					processedCmdBuf += cmdBufArr[i] + '\n';
				} else if (mode === null) {
					console.log('Generated error while handling mode in default');
					con.write('ERROR\n');
				}
			}
			if (mode === 'TRANSITIONING') mode = null;
			cmdBuf = '';
		}
	});
});

ctl.listen(ctlpath, function() {
	console.log('Listening on ' + ctlpath + '.');
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
