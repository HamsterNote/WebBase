declare module 'browser-md5-file' {
	class BMF {
		constructor();

		md5(file: File, callback: (err: Error | null, md5: string) => void, progressCallback?: (progress: number) => void): void;
	}

	export default BMF;
}
