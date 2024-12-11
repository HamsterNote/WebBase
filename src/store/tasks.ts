import { configureStore, createSlice } from '@reduxjs/toolkit';
import { ReactElement } from 'react';

export interface TaskDetailProps {
	progress: number;
	label: string;
	id: string;
}

export interface TaskBase {
	id: string;
	label: string;
	progress: number; // 小于1
	detail?: ReactElement;
	reserveWhenComplete?: boolean; // 任务完成后是否保留
	showDetailWhenCreated?: boolean; // 创建时展示详情
}

export interface ParentTask extends TaskBase {
	children?: TaskBase[]; // 只能有一层子任务，不能嵌套
	tag: string;
	total: number;
}

export type Task = ParentTask | TaskBase;

export function isParentTask(task: Task): task is ParentTask {
	return 'children' in task;
}

const abortMap: Record<string, () => Promise<void>> = {};

const runMap: Record<string, () => void> = {};

export const abortTask = async (id: string) => {
	const isParentTask = tasksStore.getState().tasks.tasks.find(task => task.id === id);
	const ids: string[] = [];
	if (isParentTask) {
		ids.push(isParentTask.id, ...(isParentTask.children?.map(c => c.id) || []));
	} else {
		ids.push(id);
	}
	await Promise.all(ids.map(async _id => {
		const abort = abortMap[_id];
		if (abort) {
			await abort();
		}
	}));
}

export function setAbortFunction(id: string, abort: () => Promise<void>) {
	abortMap[id] = abort;
}

export function setRunFunction(id: string, run: () => void) {
	runMap[id] = run;
}

const tasksInitialState: () => { tasks: ParentTask[]; } = () => ({
	tasks: []
});

export function getTask(id: string) {
	return tasksStore.getState().tasks.tasks.find(task => task.id === id);
}

export function getTaskByTag(tag: string) {
	return tasksStore.getState().tasks.tasks.find(task => task.tag === tag);
}

// 管理原始数据，做操作在这里
const tasks = createSlice({
	name: 'tasks',
	initialState: tasksInitialState(),
	reducers: {
		createTask: (state, { payload }: { payload: { task: ParentTask; } }) => {
			state.tasks.push(payload.task);
			const runFunc = runMap[payload.task.id];
			runFunc?.();
		},
		createChildrenTask: (state, { payload }: { payload: { task: TaskBase; parentTag: string; } }) => {
			const task: TaskBase = payload.task;
			const parentTag = payload.parentTag;
			const parentTask = state.tasks.find(t => t.tag === parentTag);
			if (parentTask) {
				++parentTask.total;
				const runFunc = runMap[payload.task.id];
				if (runFunc) {
					if (!parentTask.children || parentTask.children.length === 0) {
						runFunc();
					}
				}
				if (parentTask.children) {
					parentTask.children.push(task);
				} else {
					parentTask.children = [task];
				}
			}
		},
		updateTaskProgress: (state, { payload }: { payload: { id: string; progress: number; } }) => {
			const parentTask = state.tasks.find(t => t.children?.find(c => c.id === payload.id));
			const task = parentTask ? parentTask.children?.find(c => c.id === payload.id) : state.tasks.find(task => task.id === payload.id || task.children?.find(c => c.id === payload.id));
			if (task) {
				task.progress = payload.progress;
				if (parentTask) {
					// 已经完成的进度，1 / 用total减去当前children数量
					const doneProgress = (parentTask.total - (parentTask.children?.length || 0)) / parentTask.total;
					parentTask.progress = (parentTask.children?.reduce((sum, cur) => {
						sum += cur.progress / (parentTask.total);
						return sum;
					}, 0) || 0) + doneProgress;
				}
				if (task.progress >= 1 && !task.reserveWhenComplete) {
					if (parentTask) {
						parentTask.children = parentTask.children?.filter(c => c.id !== payload.id) || [];
						// 继续执行下一个
						const nextTask = parentTask.children.find(c => c.progress < 1);
						if (nextTask) {
							runMap[nextTask.id]?.();
						}
					} else {
						state.tasks = state.tasks.filter(t => t.id !== payload.id);
					}
					delete abortMap[payload.id];
					delete runMap[payload.id];
				}
			}
		},
		deleteTask: (state, { payload }: { payload: string }) => {
			const parentTask = state.tasks.find(t => t.children?.find(c => c.id === payload));
			if (parentTask) {
				parentTask.children = parentTask.children?.filter(c => c.id !== payload) || [];
				// 继续执行下一个
				const nextTask = parentTask.children.find(c => c.progress < 1);
				if (nextTask) {
					runMap[nextTask.id]?.();
				}
			} else {
				state.tasks = state.tasks.filter(task => task.id !== payload);
			}
			delete abortMap[payload];
			delete runMap[payload];
		},
		showedWhenCreated: (state, { payload }: { payload: string }) => {
			const task = state.tasks.find(task => task.id === payload);
			if (task) {
				task.showDetailWhenCreated = false;
			}
		}
	},
});

export const { createTask, updateTaskProgress, deleteTask, showedWhenCreated, createChildrenTask } = tasks.actions;

export const tasksStore = configureStore({
	reducer: {
		tasks: tasks.reducer,
	},
});
