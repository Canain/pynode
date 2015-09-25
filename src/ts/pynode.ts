/// <reference path="reference.d.ts" />

import * as ChildProcess from 'child_process';
import * as _ from 'lodash';

interface SendHandler {
	(error: string, result?: string): void;
}

interface SendHandlerDictionary {
	[request: string]: SendHandler;
}

export default class PyNode {
	
	process: ChildProcess.ChildProcess;
	done: SendHandlerDictionary;
	increment: number;
	
	constructor(public python: string, public script: string, public method: string) {
		this.done = {};
		this.increment = 0;
	}
	
	send(data, done: SendHandler) {
		this.done[this.increment.toString()] = done;
		let send = {
			request: this.increment,
			data: data
		};
		this.increment++;
		this.process.stdin.write(JSON.stringify(send) + '\n');
	}
	
	start() {
		console.log('[PyNode] Starting python script');
		
		this.process = ChildProcess.spawn(this.python, ['-u', 'src/python/pynode.py', this.script, this.method]);
		
		(<any>this.process.stdin).setEncoding('utf-8');
		
		this.process.stdout.on('data', (data) => {
			let out: string = data.toString();
			out = out.substring(0, out.length - 1);
			let ins = out.split('\n');
			for (let i = 0; i < ins.length; i++) {
				let resultString = ins[i];
				if (_.startsWith(resultString, '{')) {
					let result = JSON.parse(resultString);
					let request = result.request.toString();
					let done = this.done[request];
					done(null, result.data);
					delete this.done[request];
				} else {
					console.log('[Python] ' + out);
				}
			}
		});
		this.process.stderr.on('data', (data) => {
			let out: string = data.toString();
			out = out.substring(0, out.length - 1);
			let ins = out.split('\n');
			for (let i = 0; i < ins.length; i++) {
				let resultString = ins[i];
				if (_.startsWith(resultString, '{')) {
					let result = JSON.parse(resultString);
					let request = result.request.toString();
					let done = this.done[request];
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
	}
}