import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Task, tasksStore } from '../../store/tasks';
import { TaskBar } from './taskBar';

interface Props {
	task: string | undefined;
	onCancel: () => void;
}

export const TaskDetail: React.FC<Props> = (props) => {
	return <Modal title="任务列表" open={!!props.task} onCancel={props.onCancel} centered footer={null}>
		<TaskDetailContent {...props} />
	</Modal>;
};

export const TaskDetailContent: React.FC<Props> = (props) => {
	const [task, setTask] = useState<Task | undefined>();
	useEffect(() => {
		setTask(tasksStore.getState().tasks.tasks.find(task => task.id === props.task));
		const unsubscribe = tasksStore.subscribe(() => {
			setTask(tasksStore.getState().tasks.tasks.find(task => task.id === props.task));
		});
		return () => {
			unsubscribe();
		}
	}, []);
	if (!task) {
		return null;
	}
	return task.detail || <TaskBar task={task} width="100%" />;
};
