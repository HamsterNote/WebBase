// 文件存取
import { useDatabase } from 'indexeddb-toolkit';
import { RcFile } from 'antd/es/upload';
import BMF from 'browser-md5-file';

export async function uploadFiles(files: RcFile[]) {
	const result: string[] = [];
	for (const file of files) {
		const bmf = new BMF();
		bmf.md5(file, (err, md5) => {
			console.log(md5, file.name);
		}, (progress) => {
			console.log(progress);
		});
	}
	return result;
}
