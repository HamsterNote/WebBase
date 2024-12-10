import React, { useEffect, useState } from 'react';
import './index.scss';
import { Button, Dropdown } from 'antd';
import { showedWhenCreated, Task, tasksStore } from '../../store/tasks';
import { TaskBar } from './taskBar';
import { TaskDetail } from './taskDetail';

export const TaskBarFooter: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [showDetail, setShowDetail] = useState<string | undefined>(undefined);
	useEffect(() => {
		setTasks(tasksStore.getState().tasks.tasks);
		const unsubscribe = tasksStore.subscribe(() => {
			setTasks(tasksStore.getState().tasks.tasks);
		});
		return unsubscribe;
	}, []);
	const lastTask = tasks?.[tasks.length - 1];
	if (!lastTask) {
		return null;
	}
	const onDetailClose = () => {
		setShowDetail(undefined);
	}
	const onTaskItemClick = ({ key }: { key: string }) => {
		setShowDetail(key);
	}
	const showAtCreated = tasks.find(task => task.showDetailWhenCreated);
	if (showAtCreated) {
		setShowDetail(showAtCreated.id);
		tasksStore.dispatch(showedWhenCreated(showAtCreated.id));
	}
	const notCompleteTasks = tasks.filter(task => task.progress < 1);
	return <>
		<Dropdown placement="top" menu={{ items: tasks.map((task) => {
				return { label: <TaskBar onlyShowParent={false} task={task} />, key: task.id };
			}), onClick: onTaskItemClick }} trigger={['click']}>
			<Button size="small" type="text">
				<TaskBar task={lastTask} onlyShowParent />
				{!!notCompleteTasks.length && <span style={{ fontSize: 12, marginTop: -4 }}>({notCompleteTasks.length})</span>}
			</Button>
		</Dropdown>
		<TaskDetail task={showDetail} onCancel={onDetailClose} />
	</>;
};
