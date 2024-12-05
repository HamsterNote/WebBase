import React from 'react';
import { GetProps, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import './index.scss';
import { ThemeMode } from 'antd-style';

const { Sider } = Layout;

type AntdSiderProps = GetProps<typeof Sider>;

interface Props extends AntdSiderProps {
	themeMode: ThemeMode;
}

export const SideMenu: React.FC<Props> = (props: Props) => {
	// 感觉是antd有bug，这里要填light，不然会有一些dark的样式
	return <Sider theme="light" trigger={null} collapsible collapsed={true} className="hamster-note-side-menu">
		<Menu
			mode="inline"
			defaultSelectedKeys={['1']}
			items={[
				{
					key: '1',
					icon: <UserOutlined />,
					label: 'nav 1',
				},
				{
					key: '2',
					icon: <VideoCameraOutlined />,
					label: 'nav 2',
				},
				{
					key: '3',
					icon: <UploadOutlined />,
					label: 'nav 3',
				},
			]}
		/>
	</Sider>;
};
