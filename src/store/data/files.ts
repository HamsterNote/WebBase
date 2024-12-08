import { configureStore, createSlice } from '@reduxjs/toolkit';
import { CardData, CardType, NoteData } from './types';

export enum FileType {
	NOTE = 'note',
	DOCUMENT = 'doc',
	DIRECTORY = 'dir',
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
}

export function isNoteFile(file: HamsterFileBase): file is HamsterNoteFile {
	return file.type === FileType.NOTE;
}

export interface HamsterNoteFile extends HamsterFileBase {
	cover: string;
	type: FileType.NOTE;
	noteId: string;
	relatedDirectoryId?: string;
}

export function isDocumentFile(file: HamsterFileBase): file is HamsterDocumentFile {
	return file.type === FileType.DOCUMENT;
}

export interface HamsterDocumentFile extends HamsterFileBase {
	type: FileType.DOCUMENT;
	documentId: string;
}

export function isDirectoryFile(file: HamsterFileBase): file is HamsterDirectoryFile {
	return file.type === FileType.DIRECTORY;
}

export interface HamsterDirectoryFile extends HamsterFileBase {
	type: FileType.DIRECTORY;
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

	},
});

export const {  } = files.actions;

export const filesStore = configureStore({
	reducer: {
		files: files.reducer,
	},
});
