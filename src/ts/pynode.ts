/// <reference path="references.d.ts" />

import ChildProcess = require('child_process');
import _ = require('lodash');

interface SendHandler {
	(error: string, result?: string): void;
}

interface SendHandlerDictionary {
	[request: string]: SendHandler;
}

class PyNode {
	
	process: ChildProcess.ChildProcess;
	done: SendHandlerDictionary;
	increment: number;
	
	constructor() {
		this.done = {};
		this.increment = 0;
	}
	
	send(data, done: SendHandler) {
		this.done[this.increment.toString()] = done;
		var send = {
			request: this.increment,
			data: data
		};
		this.increment++;
		this.process.stdin.write(JSON.stringify(send) + '\n');
	}
	
	start() {
		console.log('[PyNode] Starting python script');
		
		this.process = ChildProcess.spawn('python', ['-u', 'src/python/pynode.py']);
		
		(<any>this.process.stdin).setEncoding('utf-8');
		
		this.process.stdout.on('data', (data) => {
			var out: string = data.toString();
			out = out.substring(0, out.length - 1);
			var ins = out.split('\n');
			for (var i = 0; i < ins.length; i++) {
				var resultString = ins[i];
				if (_.startsWith(resultString, '{')) {
					var result = JSON.parse(resultString);
					var request = result.request.toString();
					var done = this.done[request];
					done(null, result.data);
					delete this.done[request];
				} else {
					console.log('[Python] ' + out);
				}
			}
		});
		this.process.stderr.on('data', (data) => {
			var out: string = data.toString();
			out = out.substring(0, out.length - 1);
			var ins = out.split('\n');
			for (var i = 0; i < ins.length; i++) {
				var resultString = ins[i];
				if (_.startsWith(resultString, '{')) {
					var result = JSON.parse(resultString);
					var request = result.request.toString();
					var done = this.done[request];
					done(result.data);
					delete this.done[request];
				} else {
					console.error('[Python] ' + out);
				}
			}
		});
		this.process.on('close', function (code) {
			console.log('[PyNode] Python script stopped');
		});
		
		this.send('test', (error: string, result?: string) => {
			if (error) {
				console.error('[Python Result] ' + error);
			} else {
				console.log('[Python Result] ' + result);
			}
			this.send('test2', (error: string, result?: string) => {
				if (error) {
					console.error('[Python Result] ' + error);
				} else {
					console.log('[Python Result] ' + result);
				}
			});
		});
	}
}

export = PyNode;