import React from 'react';
import { Layout } from 'antd';
import './index.scss';
import { TaskBarFooter } from '../tasks/taskBarFooter';

const { Footer } = Layout;

export const StatusBar: React.FC = () => {
	return <Footer style={{ padding: '2px 12px' }}>
		<TaskBarFooter />
	</Footer>;
};
