// 文件存取
import { RcFile } from 'antd/es/upload';
import BMF from 'browser-md5-file';
import { filesStore, FileType, startUploadDocument, updateUploadProgress } from '../store/data/files';
import { getId } from '../utils/getId';
import { setAbortFunction, setRunFunction, createChildrenTask, createTask, getTaskByTag, tasksStore, updateTaskProgress, deleteTask } from '../store/tasks';

const UPLOAD_TASK_TAG = 'UploadTaskTag';

export async function uploadFiles(file: RcFile) {
	const parentTask = getTaskByTag(UPLOAD_TASK_TAG);
	if (!parentTask) {
		tasksStore.dispatch(createTask({
			task: {
				id: getId(),
				label: '上传文件中',
				tag: UPLOAD_TASK_TAG,
				children: [],
				progress: 0,
				total: 0,
				showDetailWhenCreated: true,
			},
		}));
	}
	const taskId = getId();
	const fileId = getId();
	filesStore.dispatch(startUploadDocument({
		file: {
			id: fileId,
			name: `temp_${fileId}${file.name.match(/\.[a-zA-Z0-9]$/g)}`,
			type: FileType.DOCUMENT,
			downloaded: true,
			isCloudFile: false,
			createTime: Date.now(),
			modifyTime: Date.now(),
			hasNewVersion: false,
			progress: 0,
			documentId: '',
		},
		directoryId: '',
	}));
	setRunFunction(taskId, () => {
		const bmf = new BMF();
		bmf.md5(file, (err, md5) => {
			if (err) {
				console.log(err);
			}
			if (md5) {
				// resolve(md5);
			}
			console.log(md5, file.name);
		}, (progress) => {
			tasksStore.dispatch(updateTaskProgress({ id: taskId, progress }));
			filesStore.dispatch(updateUploadProgress({ id: fileId, progress }));
		});
		setAbortFunction(taskId, async () => {
			// 开始了就放弃
			bmf.abort();
			tasksStore.dispatch(deleteTask(taskId));
		})
	});
	setAbortFunction(taskId, async () => {
		// 还没开始就直接删掉
		tasksStore.dispatch(deleteTask(taskId));
	})
	tasksStore.dispatch(createChildrenTask({
		task: {
			id: taskId,
			label: '正在上传文档',
			progress: 0,
			showDetailWhenCreated: true,
		},
		parentTag: UPLOAD_TASK_TAG,
	}));
}
