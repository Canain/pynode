import PyNode from './pynode';

let sample = new PyNode('python2', 'factorialsum', 'sumFactorial');
sample.start();

setTimeout(() => {
	sample.send({
		a: 5,
		b: 4
	}, (error: string, result?: string) => {
		if (error) {
			console.error('[Python Result] ' + error);
		} else {
			console.log('[Python Result] ' + result);
		}
	});
}, 1000);

setTimeout(() => {
	sample.send({
		a: 10,
		b: 10
	}, (error: string, result?: string) => {
		if (error) {
			console.error('[Python Result] ' + error);
		} else {
			console.log('[Python Result] ' + result);
		}
	});
}, 1000);