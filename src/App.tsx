import React, { useEffect, useState } from 'react';
import './reset.css';
import { ConfigProvider, Layout } from 'antd';
// import { ReadPage } from './pages/read';
import { Shelf } from './pages/shelf';
import { SideMenu } from './components/layout/sider';
import { ThemeProvider } from 'antd-style';
import { StatusBar } from './components/layout/statusBar';
import { SideBarPosition } from './store/data/sideBar';
import { WindowContainer, windowControlStore } from './store/data/windowControl';
import { Container } from './pages/window/container';
import { MovingTabIcon } from './components/movingTabIcon';

const { Content } = Layout;

const App: React.FC = () => {
  const [container, setContainer] = useState<WindowContainer | undefined>();
  useEffect(() => {
    setContainer(windowControlStore.getState().windowControl.container);
    const unsubscribe = windowControlStore.subscribe(() => {
      setContainer(windowControlStore.getState().windowControl.container);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <ThemeProvider themeMode="auto">
      <ConfigProvider theme={{
        components: {
          Menu: {
          }
        }
      }}>
        <Layout className="app">
          <Layout hasSider={true}>
            <SideMenu position={SideBarPosition.LEFT} />
            {/*<ReadPage />*/}
            <Content>
              {container ? <Container container={container} /> : null}
            </Content>
            <SideMenu position={SideBarPosition.RIGHT} />
          </Layout>
          <StatusBar />
        </Layout>
      </ConfigProvider>
      <MovingTabIcon />
    </ThemeProvider>
  );
};

export default App;
