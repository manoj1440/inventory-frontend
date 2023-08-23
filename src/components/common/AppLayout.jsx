import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { Footer } from 'antd/es/layout/layout';
const { Header, Sider, Content } = Layout;
const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer }, } = theme.useToken();

    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) {
        return <Outlet />;
    }
    return (
        <Layout
            hasSider
            style={{ height: '98vh' }}>


            <AppSidebar setCollapsed={setCollapsed} collapsed={collapsed} />
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    InfyuLabs ©2023
                </Footer>
            </Layout>
        </Layout>
    );
};
export default AppLayout;