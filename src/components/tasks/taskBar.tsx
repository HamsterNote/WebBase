import React, { useState } from 'react';
import { Button, Flex, Progress } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { abortTask, deleteTask, Task, tasksStore } from '../../store/tasks';

interface Props {
	width?: string;
	task: Task;
}

export const TaskBar: React.FC<Props> = (props) => {
	const [aborting, setAborting] = useState<boolean | undefined>();
	const onAbortTask: React.MouseEventHandler<HTMLElement> = async (e) => {
		e.stopPropagation();
		if (!props.task.abort || props.task.progress >= 1) {
			tasksStore.dispatch(deleteTask(props.task.id));
		} else {
			setAborting(true);
			tasksStore.dispatch(abortTask({
				id: props.task.id,
				callback: () => {
					tasksStore.dispatch(deleteTask(props.task.id));
					setAborting(false);
				}
			}));
		}
	}
	return <Flex className="hamster-note-task-bar" vertical={false} style={{ width: props.width }}>
		<p className="hamster-note-task-bar-label">{props.task.label}: </p>
		<Progress percent={+(props.task.progress * 100).toFixed(2)} size="small" />
		{(props.task.abort || props.task.progress >= 1) && <Button onClick={onAbortTask} disabled={aborting} color="danger" variant="text" size="small" icon={aborting ? <LoadingOutlined /> : <CloseOutlined />} style={{ marginTop: -2, marginLeft: 4 }} />}
	</Flex>;
};
