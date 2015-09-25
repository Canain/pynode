import PyNode from './pynode';

let sample = new PyNode('python2', 'sample', 'process');
sample.start();

setTimeout(() => {
	sample.send('test', (error: string, result?: string) => {
		if (error) {
			console.error('[Python Result] ' + error);
		} else {
			console.log('[Python Result] ' + result);
		}
	});
}, 1000);

setTimeout(() => {
	sample.send('test2', (error: string, result?: string) => {
		if (error) {
			console.error('[Python Result] ' + error);
		} else {
			console.log('[Python Result] ' + result);
		}
	});
}, 2000);