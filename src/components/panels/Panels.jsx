import React, { useState, useEffect } from 'react';
import { Table, Pagination, Space, Button, Modal } from 'antd';
import api from '../../utils/api';
import EditPanel from './EditPanel';
import AddPanelForm from './AddPanelForm';

const Panels = () => {
    const [panels, setPanels] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editPanelData, setEditPanelData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false)


    const fetchPanels = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/panel'); // Modify this according to your API
            setPanels(response.data);
            setPagination({
                current: page,
                pageSize,
                total: response.data.length,
            });
        } catch (error) {
            console.error('Error fetching panels:', error);
        }
    };

    const handleEdit = (panel) => {
        setEditPanelData(panel);
        setEditModalVisible(true);
    };

    useEffect(() => {
        fetchPanels(pagination.current, pagination.pageSize);
    }, []);

    const columns = [
        {
            title: 'Serial Number',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
        },

        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)} type="primary">
                        Edit
                    </Button>
                    <Button onClick={() => handleDeletePanel(record._id)} type="danger" >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDeletePanel = (panelId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this panel?',
            onOk: async () => {
                try {
                    const response = await api.request('delete', `/api/panel/${panelId}`);
                    fetchPanels(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting panel:', error);
                }
            },
        });
    };


    return (
        <div>

            <Button
                style={{ marginBottom: 10 }}
                onClick={() => setIsAddModal(true)} type="primary">
                Add Panel
            </Button>
            <Table
                dataSource={panels}
                columns={columns}
                pagination={pagination}
                onChange={(pagination, filters, sorter) => setPagination(pagination)}
            />
            <EditPanel
                panel={editPanelData}
                editModalVisible={editModalVisible}
                setEditModalVisible={setEditModalVisible}
                fetchPanels={fetchPanels}
            />

            <AddPanelForm
                isAddModal={isAddModal}
                fetchPanels={fetchPanels}
                onCancel={setIsAddModal} />
        </div>
    );
};

export default Panels;
