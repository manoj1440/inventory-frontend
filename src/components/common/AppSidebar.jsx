import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    // Define menu items
    const menuItems = [
        {
            key: '/dashboard',
            icon: <UserOutlined style={{ fontSize: '1rem' }} />,
            label: 'Dashboard',
        },
        {
            key: '/batches',
            icon: <VideoCameraOutlined style={{ fontSize: '1rem' }} />,
            label: 'Batches',
        },
        {
            key: '/panels',
            icon: <UploadOutlined style={{ fontSize: '1rem' }} />,
            label: 'Panels',
        },
        {
            key: '/users',
            icon: <UserOutlined style={{ fontSize: '1rem' }} />,
            label: 'Users',
        },
    ];

    return (
        <Sider
            style={{ padding: '10px' }}
            width={265}
            breakpoint="lg"
            onCollapse={(collapsed, type) => {
                setCollapsed(collapsed);
            }}
            collapsed={collapsed}>
            <div style={{ margin: '80px' }} className="demo-logo-vertical">
                {/* <Image preview={false} src={logo} /> */}
            </div>
            <Menu
                onClick={handleMenuClick}
                style={{ fontSize: '1rem' }}
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[location.pathname]} // Set default based on current route
            >
                {menuItems.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default AppSidebar;
