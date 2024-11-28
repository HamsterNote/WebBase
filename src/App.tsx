import React, { useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import './reset.css';
import { Layout, Menu } from 'antd';
import { ReadPage } from './pages/read';

const { Sider } = Layout;

const App: React.FC = () => {
  const [collapsed] = useState(false);

  return (
    <Layout hasSider={true} className="app">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
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
      </Sider>
      <ReadPage />
    </Layout>
  );
};

export default App;
