import React, { useState } from 'react';
import './reset.css';
import { ConfigProvider, Layout } from 'antd';
// import { ReadPage } from './pages/read';
import { Shelf } from './pages/shelf';
import { SideMenu } from './components/layout/sider';
import { ThemeProvider, ThemeMode } from 'antd-style';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  return (
    <ThemeProvider themeMode="auto" onThemeModeChange={setThemeMode}>
      <ConfigProvider theme={{
        components: {
          Menu: {
          }
        }
      }}>
        <Layout className="app">
          <Layout hasSider={true}>
            <SideMenu themeMode={themeMode} />
            {/*<ReadPage />*/}
            <Content>
              <Shelf />
            </Content>
            <SideMenu themeMode={themeMode} />
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
