/// <reference path="references.d.ts" />

import ChildProcess = require('child_process');

class PyNode {
	
	process: ChildProcess.ChildProcess;
	done: (error: string, result?: string) => void;
	
	constructor() {
		this.done = null;
	}
	
	send(data: string, done: (error: string, result?: string) => void) {
		this.done = done;
		this.process.stdin.write(data + '\n');
	}
	
	start() {
		console.log('[PyNode] Starting python script');
		
		this.process = ChildProcess.spawn('python', ['-u', 'src/python/pynode.py']);
		
		(<any>this.process.stdin).setEncoding('utf-8');
		
		this.process.stdout.on('data', (data) => {
			var out: string = data.toString();
			out = out.substring(0, out.length - 1);
			if (this.done) {
				this.done(null, out);
				this.done = null;
			} else {
				console.log('[Python] ' + out);
			}
		});
		this.process.stderr.on('data', (data) => {
			var out: string = data.toString();
			out = out.substring(0, out.length - 1);
			if (this.done) {
				this.done(out);
				this.done = null;
			} else {
				console.error('[Python] ' + out);
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