import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import AddCustomerForm from './AddCustomerForm';
import EditCustomer from './EditCustomer';
import UploadExcel from '../common/UploadExcel';
import CustomTable from '../common/CustomTable';

const Customer = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUserData, setEditUserData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false)


    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
    }, []);

    const fetchUsers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/user/customer');
            const { data } = response;
            setUsers(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
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
            content: 'Are you sure you want to delete this Customer?',
            onOk: async () => {
                try {
                    const response = await api.request('delete', `/api/user/${userId}`);
                    fetchUsers(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting Customer:', error);
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
            render: (location) => location ? location.join(', ') : 'NA',
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
        <>
            <Button
                style={{ marginBottom: 10 }}
                onClick={() => setIsAddModal(true)} type="primary">
                Add Customer
            </Button>
            <UploadExcel
                dataKey='users'
                endpoint="/api/user/bulk"
                onSuccess={fetchUsers}
            />
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Customers"
                isFilter={false}
                data={users} columns={columns} pagination={pagination}
            />
            <EditCustomer
                fetchUsers={fetchUsers}
                editModalVisible={editModalVisible}
                user={{ ...editUserData }}
                onCancel={handleEditModalClose} />
            <AddCustomerForm
                isAddModal={isAddModal}
                fetchUsers={fetchUsers}
                onCancel={setIsAddModal} />
        </>
    );
};

export default Customer;
