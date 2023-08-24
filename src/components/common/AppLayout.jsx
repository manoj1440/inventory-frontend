import React, { useEffect, useState } from 'react';

import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { Footer } from 'antd/es/layout/layout';

import Cookies from 'js-cookie';
import AppHeader from './AppHeader';
const { Content } = Layout;
const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();

    const location = useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === '/login';

    useEffect(() => {
        const tokenJs = Cookies.get('token');
        if (tokenJs && isLoginPage) {
            navigate('/dashboard');
        }

        if (!tokenJs && !isLoginPage) {
            navigate('/login');
            localStorage.clear();
        }
    }, [isLoginPage, navigate, location]);

    if (isLoginPage) {
        return <Outlet />;
    }
    return (
        <Layout
            hasSider
            style={{ height: '98vh' }}>


            <AppSidebar setCollapsed={setCollapsed} collapsed={collapsed} />
            <Layout>
                <AppHeader
                    colorBgContainer={colorBgContainer}
                    setCollapsed={setCollapsed}
                    collapsed={collapsed}
                />

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