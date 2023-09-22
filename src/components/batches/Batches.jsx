import React, { useState, useEffect } from 'react';
import { Space, Button, Modal, Popover, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import api from '../../utils/api';
import AddBatchForm from './AddBatchForm';
import EditBatchForm from './EditBatchForm';
import dayjs from 'dayjs';
import CustomTable from '../common/CustomTable';
import UploadExcel from '../common/UploadExcel';

const Batches = () => {
    const [batches, setBatches] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editBatchData, setEditBatchData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false)


    const fetchBatches = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/batch');
            setBatches(response.data);
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
        setEditBatchData(panel);
        setEditModalVisible(true);
    };

    useEffect(() => {
        fetchBatches(pagination.current, pagination.pageSize);
    }, []);

    const readableDate = (dateObject) => {
        return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
    }

    const ActionDropdown = ({ record }) => {
        const items = [
            {
                key: '1',
                label: (
                    <a onClick={() => handleDispatchBatch(record._id)} >
                        Make Dispatch
                    </a>
                ),
            },
            // {
            //     key: '2',
            //     label: (
            //         <a onClick={() => handleReceiveBatch(record._id)} >
            //             Mark Receive
            //         </a>
            //     )
            // },
            {
                key: '3',
                label: (
                    <a onClick={() => handleEdit(record)} >
                        Edit
                    </a>
                )
            },
            {
                key: '4',
                label: (
                    <a onClick={() => handleDeleteBatch(record._id)} >
                        Delete
                    </a>
                ),
                danger: true
            },
        ];

        return (
            <Dropdown
                menu={{
                    items,
                }}
            >
                <Button type='link' icon={<EllipsisOutlined />} />
            </Dropdown>
        );
    };

    const columns = [
        {
            title: 'Asset Number',
            dataIndex: 'AssetNumber',
            key: 'AssetNumber',
        },
        {
            title: 'PCM',
            dataIndex: 'PCM',
            key: 'PCM',
        },
        {
            title: 'DOM',
            dataIndex: 'DOM',
            key: 'DOM',
            render: (DOM) => DOM ? dayjs(new Date(DOM)).format('YYYY/MM') : 'NA',
        },
        {
            title: 'Dispatched',
            dataIndex: 'Dispatched',
            key: 'Dispatched',
            render: (Dispatched) => Dispatched ? readableDate(Dispatched) : 'NA',
        },
        // {
        //     title: 'receivedAt',
        //     dataIndex: 'receivedAt',
        //     key: 'receivedAt',
        //     render: (receivedAt) => receivedAt ? readableDate(receivedAt) : 'NA',
        // },
        // {
        //     title: 'received',
        //     dataIndex: 'received',
        //     key: 'received',
        //     render: (received) => received ? 'Yes' : 'No',
        // },
        {
            title: 'Total Panels',
            dataIndex: 'panels',
            key: 'panels',
            render: (_, record) => (
                record.panels && record.panels.length > 0 ?
                    <Popover
                        content={record.panels.map((panel) => panel.serialNumber).join(', ')}
                        trigger="hover"
                    >
                        <div className='table-rendor-button'>{record.panels.length}</div>
                    </Popover>
                    : 'NA'
            )
        },
        {
            title: 'Received Panels',
            dataIndex: 'panels',
            key: 'panels',
            render: (_, record) => (
                record.panels && record.panels.length > 0 ?
                    <Popover
                        content={record.panels.map((panel) => {
                            if (panel.received) {
                                return panel.serialNumber
                            }
                        }).join(', ')}
                        trigger="hover"
                    >
                        <div className='table-rendor-button'>{record.panels.filter(item => item.received).length}</div>
                    </Popover>
                    : 'NA'
            )
        },
        {
            title: 'Pending Panels',
            dataIndex: 'panels',
            key: 'panels',
            render: (_, record) => (
                record.panels && record.panels.length > 0 ?
                    <Popover
                        content={record.panels.map((panel) => {
                            if (!panel.received) {
                                return panel.serialNumber
                            }
                        }).join(', ')}
                        trigger="hover"
                    >
                        <div className='table-rendor-button'>{record.panels.filter(item => !item.received).length}</div>
                    </Popover>
                    : 'NA'
            )
        },
        {
            title: 'WhLocation',
            dataIndex: 'WhLocation',
            key: 'WhLocation',
        },
        {
            title: 'Delivery Location',
            dataIndex: 'DeliveryLocation',
            key: 'DeliveryLocation',
        },
        {
            title: 'Customer',
            key: 'user',
            dataIndex: 'user',
            render: (user) => user ? user.name : 'NA'
        },
        {
            title: 'Dispatched By',
            key: 'dispatchedBy',
            dataIndex: 'dispatchedBy',
            render: (dispatchedBy) => dispatchedBy ? dispatchedBy.name : 'NA'
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <ActionDropdown record={record} />
            ),
        },
    ];

    const handleDeleteBatch = (panelId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this batch?',
            onOk: async () => {
                try {
                    const response = await api.request('delete', `/api/batch/${panelId}`);
                    fetchBatches(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting batch:', error);
                }
            },
        });
    };


    const handleReceiveBatch = (panelId) => {
        Modal.confirm({
            title: 'Confirm Receive',
            content: 'This will mark this batch as received ?',
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/batch/${panelId}`, { received: true, receivedAt: new Date().toISOString() });
                    fetchBatches(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error updating batch:', error);
                }
            },
        });
    };

    const handleDispatchBatch = (panelId) => {
        Modal.confirm({
            title: 'Confirm Dispatch',
            content: 'This will mark this batch as Dispatch ?',
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/batch/${panelId}`, { Dispatched: new Date().toISOString() });
                    fetchBatches(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error updating batch Dispatch:', error);
                }
            },
        });
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 10 }}
                onClick={() => setIsAddModal(true)} type="primary">
                Add Batch
            </Button>
            <UploadExcel
                dataKey='batches'
                endpoint="/api/batch/bulk"
                onSuccess={fetchBatches}
            />
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Batches"
                isFilter={false}
                data={batches}
                columns={columns}
                pagination={pagination}
            />
            {editModalVisible && <EditBatchForm
                editBatchData={editBatchData}
                editModalVisible={editModalVisible}
                onCancel={setEditModalVisible}
                fetchBatches={fetchBatches}
            />
            }
            {isAddModal && <AddBatchForm
                isAddModal={isAddModal}
                fetchBatches={fetchBatches}
                onCancel={setIsAddModal} />}
        </div>
    );
};

export default Batches;
