import { configureStore, createSlice } from '@reduxjs/toolkit';
import { ReactElement } from 'react';

export interface TaskDetailProps {
	progress: number;
	label: string;
	id: string;
}

export interface Task {
	id: string;
	label: string;
	progress: number; // 小于1
	detail?: ReactElement;
	abort?: () => Promise<void>;
	hidden?: boolean;
	reserveWhenComplete?: boolean; // 任务完成后是否保留
	showDetailWhenCreated?: boolean; // 创建时展示详情
}

const tasksInitialState: () => { tasks: Task[]; } = () => ({
	tasks: []
});

// 管理原始数据，做操作在这里
const tasks = createSlice({
	name: 'tasks',
	initialState: tasksInitialState(),
	reducers: {
		createTask: (state, { payload }: { payload: Task }) => {
			state.tasks.push(payload);
		},
		updateTaskProgress: (state, { payload }: { payload: { id: string; progress: number; } }) => {
			const task = state.tasks.find(task => task.id === payload.id);
			if (task) {
				task.progress = payload.progress;
				if (task.progress >= 1 && !task.reserveWhenComplete) {
					task.hidden = true;
				}
			}
		},
		deleteTask: (state, { payload }: { payload: string }) => {
			state.tasks = state.tasks.filter(task => task.id !== payload);
		},
		abortTask: (state, { payload }: { payload: { id: string; callback: () => void; } }) => {
			const task = state.tasks.find(task => task.id === payload.id);
			if (task) {
				task.abort?.().then(payload.callback);
			}
		},
		showedWhenCreated: (state, { payload }: { payload: string }) => {
			const task = state.tasks.find(task => task.id === payload);
			if (task) {
				task.showDetailWhenCreated = false;
			}
		}
	},
});

export const { createTask, updateTaskProgress, deleteTask, abortTask, showedWhenCreated } = tasks.actions;

export const tasksStore = configureStore({
	reducer: {
		tasks: tasks.reducer,
	},
});
