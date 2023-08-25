import React, { useState, useEffect } from 'react';
import { Space, Button, Modal } from 'antd';
import api from '../../utils/api';
import EditPanel from './EditPanel';
import AddPanelForm from './AddPanelForm';
import CustomTable from '../common/CustomTable';
import dayjs from 'dayjs';

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

    const readableDate = (dateObject) => {
        return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
    }

    const columns = [
        {
            title: 'Serial Number',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
        },
        {
            title: 'DOM',
            dataIndex: 'DOM',
            key: 'DOM',
            render: (DOM) => DOM ? readableDate(DOM) : 'NA',
        },
        {
            title: 'DOE',
            dataIndex: 'DOE',
            key: 'DOE',
            render: (DOE) => DOE ? readableDate(DOE) : 'NA',
        },
        {
            title: 'Batch Name',
            dataIndex: 'AssetNumber',
            key: 'AssetNumber'
        },
        {
            title: 'Included in Batch',
            dataIndex: 'included',
            key: 'included',
            render: (included) => `${included ? 'Yes' : 'No'}`,
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
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Panels"
                isFilter={false}
                data={panels}
                columns={columns} pagination={pagination}
            />
            {editPanelData && <EditPanel
                panel={editPanelData}
                editModalVisible={editModalVisible}
                setEditModalVisible={setEditModalVisible}
                fetchPanels={fetchPanels}
            />}

            {isAddModal && <AddPanelForm
                isAddModal={isAddModal}
                fetchPanels={fetchPanels}
                onCancel={setIsAddModal} />}
        </div>
    );
};

export default Panels;
