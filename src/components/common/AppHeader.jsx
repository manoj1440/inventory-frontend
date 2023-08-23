import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
    return (
        <Header className="header">
            {/* Your header content */}
            <h1>My App</h1>
        </Header>
    );
};

export default AppHeader;
