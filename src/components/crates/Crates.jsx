import React, { useState, useEffect } from 'react';
import { Space, Button, Modal, Input } from 'antd';
import api from '../../utils/api';
import EditCrate from './EditCrate';
import AddCrateForm from './AddCrateForm';
import CustomTable from '../common/CustomTable';
import dayjs from 'dayjs';
import UploadExcel from '../common/UploadExcel';
import { CloseCircleOutlined } from '@ant-design/icons';

const Crates = () => {
    const [panels, setPanels] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editPanelData, setEditPanelData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (value && value.trim().length > 0) {
            fetchPanels('', '', value);
        } else {
            fetchPanels();
        }
    };

    useEffect(() => {
        if (searchQuery.trim().length <= 0) {
            fetchPanels();
        }
    }, [searchQuery])

    const fetchPanels = async (page = 1, pageSize = 10, search = '') => {
        try {
            const response = await api.request('get', `/api/crate?page=${page}&pageSize=${pageSize}&search=${search}`);
            setPanels(response.data);
            setTotalRecords(response.total);
        } catch (error) {
            console.error('Error fetching crates:', error);
        }
    };

    const handleEdit = (panel) => {
        setEditPanelData(panel);
        setEditModalVisible(true);
    };

    useEffect(() => {
        fetchPanels();
    }, []);

    const readableDate = (dateObject) => {
        return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
    }

    const handleReceivePanel = (panelId) => {
        Modal.confirm({
            title: 'Confirm Receive',
            content: 'This will mark this Panel as received ?',
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/crate/${panelId}`, { received: true, receivedAt: new Date().toISOString() });
                    fetchPanels();
                } catch (error) {
                    console.error('Error updating Panel:', error);
                }
            },
        });
    };

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
        // {
        //     title: 'DOE',
        //     dataIndex: 'DOE',
        //     key: 'DOE',
        //     render: (DOE) => DOE ? readableDate(DOE) : 'NA',
        // },
        {
            title: 'PCM',
            dataIndex: 'PCM',
            key: 'PCM'
        },
        {
            title: 'Route Name',
            dataIndex: 'Name',
            key: 'Name'
        },
        {
            title: 'Included in Crate',
            dataIndex: 'included',
            key: 'included',
            render: (included) => `${included ? 'Yes' : 'No'}`,
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => `${isActive ? 'Yes' : 'No'}`,
        },
        {
            title: 'receivedAt',
            dataIndex: 'receivedAt',
            key: 'receivedAt',
            render: (receivedAt) => receivedAt ? readableDate(receivedAt) : 'NA',
        },
        {
            title: 'received',
            dataIndex: 'received',
            key: 'received',
            render: (received) => received ? <span style={{ color: 'green' }}>Yes</span> : 'No',
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        style={{ backgroundColor: record.received ? 'green' : '' }}
                        onClick={() => handleReceivePanel(record._id)} type="primary">
                        Mark Receive
                    </Button>
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
                    const response = await api.request('delete', `/api/crate/${panelId}`);
                    fetchPanels();
                } catch (error) {
                    console.error('Error deleting panel:', error);
                }
            },
        });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                <Button
                    style={{ marginBottom: 10 }}
                    onClick={() => setIsAddModal(true)} type="primary">
                    Add Crate
                </Button>
                <UploadExcel
                    dataKey='crates'
                    endpoint="/api/crate/bulk"
                    onSuccess={fetchPanels}
                />
                <Input.Search
                    style={{ width: '15rem' }}
                    placeholder="Search by Crate name"
                    value={searchQuery}
                    onSearch={handleSearch}
                    enterButton
                    onChange={(e) => setSearchQuery(e.target.value)}
                    suffix={ // Add a clear button
                        searchQuery && (
                            <Button type="link" icon={<CloseCircleOutlined />} onClick={handleClearSearch} />
                        )
                    }
                />

            </div>

            {panels && panels.length > 0 && <CustomTable
                downloadButtonText="Export"
                downloadFileName="Crates"
                isFilter={false}
                data={panels}
                columns={columns}
                fetchData={fetchPanels}
                totalRecords={totalRecords}
            />}
            {editPanelData && <EditCrate
                panel={editPanelData}
                editModalVisible={editModalVisible}
                setEditModalVisible={setEditModalVisible}
                fetchPanels={fetchPanels}
            />}

            {isAddModal && <AddCrateForm
                isAddModal={isAddModal}
                fetchPanels={fetchPanels}
                onCancel={setIsAddModal} />}
        </div>
    );
};

export default Crates;
