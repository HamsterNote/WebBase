import React, { useEffect, useState } from 'react';
import { Avatar, GetProps, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import './index.scss';
import { SideBarItem, SideBarPosition, sideBarStore } from '../../store/data/sideBar';

const { Sider } = Layout;

type AntdSiderProps = GetProps<typeof Sider>;

interface Props extends AntdSiderProps {
	position: SideBarPosition;
}

export const SideMenu: React.FC<Props> = (props: Props) => {
	const [items, setItems] = useState<SideBarItem[]>([]);
	useEffect(() => {
		setItems(sideBarStore.getState().sideBar.items.filter(item => item.position === props.position));
		const unsubscribe = sideBarStore.subscribe(() => {
			setItems(sideBarStore.getState().sideBar.items.filter(item => item.position === props.position));
		});
		return unsubscribe;
	}, []);
	if (!items.length) {
		return null;
	}
	// 感觉是antd有bug，这里要填light，不然会有一些dark的样式
	return <Sider theme="light" trigger={null} collapsible collapsed={true} collapsedWidth={50} className="hamster-note-side-menu">
		<Menu
			mode="inline"
			selectedKeys={[]}
			defaultSelectedKeys={[]}
			items={items.map((item, index) => ({
				key: `${index}-${item.tag}-${item.title}`,
				label: item.title,
				icon: item.icon,
			}))}
		/>
	</Sider>;
};
