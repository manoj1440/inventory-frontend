import React, { useState, useEffect } from 'react';
import { Button, Modal, Popover, Dropdown, Menu, List } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import api from '../../utils/api';
import AddRouteForm from './AddRouteForm';
import EditRouteForm from './EditRouteForm';
import dayjs from 'dayjs';
import CustomTable from '../common/CustomTable';
import AddNewRouteForm from './AddNewRouteForm';

const Routes = () => {
    const [routes, setRoutes] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editRouteData, setEditRouteData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false);
    const [isAddNewModal, setIsAddNewModal] = useState(false);

    const fetchRoutes = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/route');
            setRoutes(response.data);
            setPagination({
                current: page,
                pageSize,
                total: response.data.length,
            });
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const handleEdit = (route) => {
        setEditRouteData(route);
        setEditModalVisible(true);
    };

    useEffect(() => {
        fetchRoutes(pagination.current, pagination.pageSize);
    }, []);

    const readableDate = (dateObject) => {
        return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
    }

    const handleDispatchRoute = (routeId) => {
        Modal.confirm({
            title: 'Confirm Dispatch',
            content: 'This will mark this route as Dispatch ?',
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/route/${routeId}`, { Dispatched: new Date().toISOString() });
                    fetchRoutes(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error updating route Dispatch:', error);
                }
            },
        });
    };


    const ActionDropdown = ({ record }) => {
        const items = [
            {
                key: '1',
                label: (
                    <a onClick={() => handleDispatchRoute(record._id)} >
                        Make Dispatch
                    </a>
                ),
            },
            {
                key: '2',
                label: (
                    <a onClick={() => handleEdit(record)} >
                        Edit
                    </a>
                ),
            },
            {
                key: '3',
                label: (
                    <a onClick={() => handleDeleteRoute(record._id)} >
                        Delete
                    </a>
                ),
                danger: true
            },
        ];

        return (
            <Dropdown
                overlay={
                    <Menu>
                        {items.map(item => (
                            <Menu.Item key={item.key} danger={item.danger}>
                                {item.label}
                            </Menu.Item>
                        ))}
                    </Menu>
                }
            >
                <Button type='link' icon={<EllipsisOutlined />} />
            </Dropdown>
        );
    };

    const handleAddNewDelivery = (record) => {
        console.log('record=====', record);
        setIsAddNewModal(true);
        setEditRouteData(record);
    }

    const columns = [
        {
            title: 'Route Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        // {
        //     title: 'Delivering Information',
        //     key: 'DeliveringInformation',
        //     render: (_, record) => (
        //         record.DeliveringItems && record.DeliveringItems.length > 0 ?
        //             record.DeliveringItems.map((deliveringItem, index) => (
        //                 <div key={index}>
        //                     <strong>Customer:</strong> {deliveringItem.customerId.name}<br />
        //                     <strong>Count of Crates:</strong> {deliveringItem.crateIds.length}<br />
        //                 </div>
        //             ))
        //             : 'NA'
        //     )
        // },

        {
            title: 'Total Crates',
            dataIndex: 'Crates',
            key: 'Crates',
            render: (_, record) => (
                record.Crates && record.Crates.length > 0 ?
                    <Popover
                        content={record.Crates.map((panel) => panel.serialNumber).join(', ')}
                        trigger="hover"
                    >
                        <div className='table-rendor-button'>{record.Crates.length}</div>
                    </Popover>
                    : 'NA'
            )
        },
        {
            title: 'Received Crates',
            dataIndex: 'Crates',
            key: 'Crates',
            render: (_, record) => (
                record.Crates && record.Crates.length > 0 ?
                    <Popover
                        content={record.Crates.map((panel) => {
                            if (panel.received) {
                                return panel.serialNumber
                            }
                        }).join(', ')}
                        trigger="hover"
                    >
                        <div className='table-rendor-button'>{record.Crates.filter(item => item.received).length}</div>
                    </Popover>
                    : 'NA'
            )
        },
        {
            title: 'Pending Crates',
            dataIndex: 'Crates',
            key: 'Crates',
            render: (_, record) => (
                record.Crates && record.Crates.length > 0 ?
                    <Popover
                        content={record.Crates.map((panel) => {
                            if (!panel.received) {
                                return panel.serialNumber
                            }
                        }).join(', ')}
                        trigger="hover"
                    >
                        <div className='table-rendor-button'>{record.Crates.filter(item => !item.received).length}</div>
                    </Popover>
                    : 'NA'
            )
        },
        {
            title: 'Dispatched',
            dataIndex: 'Dispatched',
            key: 'Dispatched',
            render: (Dispatched) => Dispatched ? readableDate(Dispatched) : 'NA',
        },
        {
            title: 'Customers',
            key: 'Customers',
            dataIndex: 'Customers',
            render: (Customers) => Customers && Customers.length > 0 ? Customers.map(customer => customer.name).join(', ') : 'NA'
        },
        {
            title: 'Dispatched By',
            key: 'dispatchedBy',
            dataIndex: 'dispatchedBy',
            render: (dispatchedBy) => dispatchedBy ? dispatchedBy.name : 'NA'
        },
        {
            title: 'Add New Delivery',
            render: (_, record) => <Button
                onClick={() => handleAddNewDelivery(record)} type="primary">
                Add New
            </Button>,
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

    const handleDeleteRoute = (routeId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this route?',
            onOk: async () => {
                try {
                    await api.request('delete', `/api/route/${routeId}`);
                    fetchRoutes(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting route:', error);
                }
            },
        });
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 10 }}
                onClick={() => setIsAddModal(true)}
                type="primary"
            >
                Create Route
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Routes"
                isFilter={false}
                data={routes}
                columns={columns}
                pagination={pagination}
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            {record.DeliveringItems && record.DeliveringItems.length > 0 ? (
                                record.DeliveringItems.map((deliveringItem, index) => (
                                    <div key={index} style={{ margin: '10px' }}>
                                        <span >Customer: {deliveringItem.customerId.name}</span><br />
                                        <span >Count of Crates: {deliveringItem.crateIds.length}</span><br />
                                        <div>
                                            <span >Crate Names:</span>
                                            {deliveringItem.crateIds.map((crate, idx) => (
                                                <span key={idx}>{crate.serialNumber}{idx !== deliveringItem.crateIds.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : 'NA'}
                        </div>
                    ),
                    rowExpandable: (record) => record.DeliveringItems && record.DeliveringItems.length > 0,
                }}
            />
            {editModalVisible && (
                <EditRouteForm
                    editRouteData={editRouteData}
                    editModalVisible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    fetchRoutes={fetchRoutes}
                />
            )}
            {isAddModal && (
                <AddRouteForm
                    isAddModal={isAddModal}
                    onCancel={() => setIsAddModal(false)}
                    fetchRoutes={fetchRoutes}
                />
            )}

            {isAddNewModal && (<AddNewRouteForm
                editRouteData={editRouteData}
                isAddModal={isAddNewModal}
                setEditRouteData={setEditRouteData}
                onCancel={() => setIsAddNewModal(false)}
                fetchRoutes={fetchRoutes}
            />)}
        </div>
    )
};

export default Routes;
