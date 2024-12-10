import { configureStore, createSlice } from '@reduxjs/toolkit';
import { CardData, CardType, NoteData } from './types';

export enum FileType {
	NOTE = 'note',
	DOCUMENT = 'doc',
	DIRECTORY = 'dir',
	NOTE_DIRECTORY = 'noteDir',
}

export interface HamsterFileBase {
	id: string;
	name: string;
	type: FileType;
	downloaded: boolean;
	isCloudFile: boolean;
	createTime: number;
	modifyTime: number;
	hasNewVersion: boolean;
	taskId?: string;
}

export function isNoteFile(file: HamsterFileBase): file is HamsterNoteFile {
	return file.type === FileType.NOTE;
}

export interface HamsterNoteFile extends HamsterFileBase {
	// 我们允许NoteFile同时在NoteList和DocumentList两边文件夹关联
	cover: string;
	type: FileType.NOTE;
	// 上传或下载进度
	progress: number;
}

export function isDocumentFile(file: HamsterFileBase): file is HamsterDocumentFile {
	return file.type === FileType.DOCUMENT;
}

export interface HamsterDocumentFile extends HamsterFileBase {
	type: FileType.DOCUMENT;
	documentId: string;
	// 上传或下载进度
	progress: number;
}

export function isDirectoryFile(file: HamsterFileBase): file is HamsterDirectoryFile {
	return file.type === FileType.DIRECTORY;
}

export interface HamsterDirectoryFile extends HamsterFileBase {
	type: FileType.DIRECTORY;
	childrenIds: string[];
}

export function isNoteDirectoryFile(file: HamsterFileBase): file is HamsterDirectoryFile {
	return file.type === FileType.NOTE_DIRECTORY;
}

export interface HamsterNoteDirectoryFile extends HamsterFileBase {
	type: FileType.NOTE_DIRECTORY;
	childrenIds: string[];
}

const filesInitialState: () => { files: HamsterFileBase[]; } = () => ({
	files: []
});

// 管理原始数据，做操作在这里
const files = createSlice({
	name: 'files',
	initialState: filesInitialState(),
	reducers: {
		startUploadDocument: (state, { payload }: { payload: { file: HamsterDocumentFile, directoryId: string; } }) => {
			state.files.push(payload.file);
			const dir = state.files.find(file => file.id === payload.directoryId && isDirectoryFile(file)) as HamsterDirectoryFile;
			if (dir) {
				dir.childrenIds.push(payload.file.id);
			}
		},
		updateUploadProgress: (state, { payload }: { payload: { id: string, progress: number; } }) => {
			const file = state.files.find(file => file.id === payload.id && isDocumentFile(file)) as HamsterDocumentFile;
			if (file) {
				file.progress = payload.progress;
				if (file.progress >= 1) {
					file.taskId = undefined;
				}
			}
		}
	},
});

export const { startUploadDocument, updateUploadProgress } = files.actions;

export const filesStore = configureStore({
	reducer: {
		files: files.reducer,
	},
});
