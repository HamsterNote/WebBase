import React from 'react';
import { Layout } from 'antd';
import './index.scss';

const { Footer } = Layout;

export const StatusBar: React.FC = () => {
	return <Footer style={{ padding: '4px 12px' }}>Footer</Footer>;
};
