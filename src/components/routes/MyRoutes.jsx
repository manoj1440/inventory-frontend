import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';
import CustomTable from '../common/CustomTable';

const MyRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
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

    useEffect(() => {
        fetchRoutes(pagination.current, pagination.pageSize);
    }, []);

    const readableDate = (dateObject) => {
        return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
    }

    const columns = [
        {
            title: 'Route Name',
            dataIndex: 'Name',
            key: 'Name',
        },

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
            title: 'Customer',
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
    ];

    return (
        <>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Routes"
                isFilter={false}
                data={routes}
                columns={columns}
                pagination={pagination}
            />
        </>
    )
};

export default MyRoutes;
