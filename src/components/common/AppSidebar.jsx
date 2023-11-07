import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
    UserOutlined,
    UsergroupDeleteOutlined,
    GroupOutlined,
    AreaChartOutlined,
    SlidersOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    let menuItems = [];

    if (import.meta.env.VITE_IS_CRATES_UI || false) {
        menuItems = [
            {
                key: '/dashboard',
                icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
                label: 'Dashboard',
            },
            {
                key: '/routes',
                icon: <GroupOutlined style={{ fontSize: '1rem' }} />,
                label: 'Routes',
            },
            {
                key: '/my-routes',
                icon: <GroupOutlined style={{ fontSize: '1rem' }} />,
                label: 'My Routes',
            },
            {
                key: '/crates',
                icon: <SlidersOutlined style={{ fontSize: '1rem' }} />,
                label: 'Crates',
            },
            {
                key: '/users',
                icon: <UserOutlined style={{ fontSize: '1rem' }} />,
                label: 'Users',
            },
            {
                key: '/customers',
                icon: <UsergroupDeleteOutlined style={{ fontSize: '1rem' }} />,
                label: 'Customers',
            },
        ];
    } else {
        menuItems = [
            {
                key: '/dashboard',
                icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
                label: 'Dashboard',
            },
            {
                key: '/batches',
                icon: <GroupOutlined style={{ fontSize: '1rem' }} />,
                label: 'Batches',
            },
            {
                key: '/my-batches',
                icon: <GroupOutlined style={{ fontSize: '1rem' }} />,
                label: 'My Batches',
            },
            {
                key: '/panels',
                icon: <SlidersOutlined style={{ fontSize: '1rem' }} />,
                label: 'Panels',
            },
            {
                key: '/users',
                icon: <UserOutlined style={{ fontSize: '1rem' }} />,
                label: 'Users',
            },
            {
                key: '/customers',
                icon: <UsergroupDeleteOutlined style={{ fontSize: '1rem' }} />,
                label: 'Customers',
            },
        ];
    }


    return (
        <Sider
            style={{ padding: '10px', background: 'white', borderRight: '1px solid #e2e2e2' }}
            width={300}
            breakpoint="lg"
            onCollapse={(collapsed, type) => {
                setCollapsed(collapsed);
            }}
            collapsed={collapsed}>
            <div onClick={() => navigate('/dashboard')} className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <Menu
                onClick={handleMenuClick}
                style={{ fontSize: '1rem' }}
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
