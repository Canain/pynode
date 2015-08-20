/// <reference path="references.d.ts" />

import ChildProcess = require('child_process');

class PyNode {
	
	process: ChildProcess.ChildProcess;
	
	constructor() {
		
	}
	
	start() {
		this.process = ChildProcess.spawn('python', ['../../src/python/pynode.py']);
		
		(<any>this.process.stdin).setEncoding('utf-8');
		
		this.process.stdout.on('data', function (data) {
			var out: string = data.toString();
			console.log(out.substring(0, out.length - 1));
		});
		this.process.stderr.on('data', function (data) {
			var out: string = data.toString();
			console.log(out.substring(0, out.length - 1));
		});
		this.process.on('exit', function (code) {
			// done(code);
		});
		this.process.stdin.write("input");
	}
}

export = PyNode;