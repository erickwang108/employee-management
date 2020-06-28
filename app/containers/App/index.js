import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useObserver } from 'mobx-react';
import {
  ConfigProvider,
  Layout,
  Menu,
  Spin,
} from 'antd';
import { useHistory, useLocation, Route } from 'react-router-dom';
import locale from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

import { appStores } from 'stores';
import PageEmployee from 'containers/PageEmployee';
import PageCompany from 'containers/PageCompany';
import PageDept from 'containers/PageDept';
import PageBaseData from 'containers/PageBaseData';
import PageConfig from 'containers/PageConfig';
import logo from 'resources/icon.png';
import pkg from 'package.json';
import {
  Container,
  LogoImage,
  TopLeftCornerContainer,
  LoadingContainer,
  VersionContainer,
} from './styles';

moment.locale('zh-cn');

const { Header, Content } = Layout;

function appState() {
  const {
    configStore,
  } = appStores();

  return useObserver(() => ({
    getConfigData: configStore.getConfigData,
  }));
}

export default function App() {
  const {
    getConfigData,
  } = appState();

  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const configData = getConfigData();

    if (!configData) {
      history.push('/config');
    }

    setLoading(false);
  }, [getConfigData]);

  if (loading) {
    return (
      <LoadingContainer>
        <Spin tip="数据加载中,请稍后..." />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ConfigProvider locale={locale}>
        <Layout className="layout">
          <Header>
            <TopLeftCornerContainer>
              <LogoImage src={logo} width="32px" height="32px" />
              <VersionContainer>
                V
                {pkg.version}
              </VersionContainer>
            </TopLeftCornerContainer>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
              defaultSelectedKeys={[location.pathname]}
              onSelect={({ key }) => { history.push(key); }}
            >
              <Menu.Item key="/">员工</Menu.Item>
              <Menu.Item key="/company">企业</Menu.Item>
              <Menu.Item key="/baseData">基础数据</Menu.Item>
              <Menu.Item key="/config">配置</Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Route path="/" exact component={PageEmployee} />
            <Route path="/company" component={PageCompany} />
            <Route path="/dept/:cid" component={PageDept} />
            <Route path="/baseData" component={PageBaseData} />
            <Route path="/config" component={PageConfig} />
          </Content>
        </Layout>
      </ConfigProvider>
    </Container>
  );
}
