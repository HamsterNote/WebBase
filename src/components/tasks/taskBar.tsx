import React, { useState } from 'react';
import { Flex, Progress, Typography } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { abortTask, deleteTask, isParentTask, Task, tasksStore } from '../../store/tasks';

const { Text } = Typography;

interface Props {
	width?: string;
	task: Task;
	// 只展示父级
	onlyShowParent: boolean;
}

export const TaskBar: React.FC<Props> = (props) => {
	const [aborting, setAborting] = useState<boolean | undefined>();
	const { task } = props;
	const isParent = isParentTask(task);
	const progress = task.progress;
	const onAbortTask: React.MouseEventHandler<HTMLElement> = async (e) => {
		e.stopPropagation();
		if (props.task.progress >= 1) {
			tasksStore.dispatch(deleteTask(props.task.id));
		} else {
			setAborting(true);
			let ids: string[] = [];
			if (isParent) {
				ids = (task.children || []).map(item => item.id).concat(task.id);
			} else {
				ids = [task.id];
			}
			await Promise.all(ids.map(abortTask));
			setAborting(false);
		}
	}
	const children = isParent ? (task.children || []) : [];
	return <>
		<Flex className="hamster-note-task-bar" vertical={false} style={{ width: props.width }}>
			<p className="hamster-note-task-bar-label">{props.task.label}: </p>
			<Progress percent={Math.round(progress * 100)} size="small" />
			<Text type="danger" onClick={aborting ? undefined : onAbortTask} style={{ marginTop: -2, marginLeft: 4, cursor: aborting ? undefined : 'pointer' }}>
				{aborting ? <LoadingOutlined /> : <CloseOutlined />}
			</Text>
		</Flex>
		{!props.onlyShowParent && children.map(child => <TaskBar onlyShowParent={false} width={props.width} task={child} key={child.id} />)}
	</>;
};
