import React, { useState, useEffect } from 'react';
import { Table, Pagination, Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditUser from './EditUser';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUserData, setEditUserData] = useState({});


    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchUsers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            const response = await api.request('get', '/api/user');
            const { data } = response;

            const paginatedUsers = data.slice(startIndex, endIndex).map(user => ({
                ...user,
                location: user.location.join(', '), // Convert array to comma-separated string
            }));

            setUsers(paginatedUsers);
            setPagination({ ...pagination, total: data.length });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handlePaginationChange = (page, pageSize) => {
        setPagination({ ...pagination, current: page, pageSize });
    };


    const showEditModal = (record) => {
        setEditUserData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditUserData({});
    };

    const handleDeleteUser = (userId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this user?',
            onOk: async () => {
                try {
                    console.log(`Deleting user with ID: ${userId}`);
                    const response = await api.request('delete', `/api/user/${userId}`);
                    fetchUsers(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            },
        });
    };


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showEditModal(record)} type="primary">
                        Edit
                    </Button>
                    <Button onClick={() => handleDeleteUser(record._id)} type="danger">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                dataSource={users}
                columns={columns}
                pagination={false}
                rowKey={(record) => record._id}
            />
            <Pagination
                style={{ marginTop: '16px', textAlign: 'right' }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePaginationChange}
            />
            <EditUser
                fetchUsers={fetchUsers}
                editModalVisible={editModalVisible}
                user={...editUserData}
                onCancel={handleEditModalClose} />
        </div>
    );
};

export default Users;
