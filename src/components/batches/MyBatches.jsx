import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import dayjs from 'dayjs';
import CustomTable from '../common/CustomTable';

const MyBatches = () => {
    const [batches, setBatches] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });


    const fetchBatches = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/batch/self');
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

    useEffect(() => {
        fetchBatches(pagination.current, pagination.pageSize);
    }, []);

    const readableDate = (dateObject) => {
        return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
    }

    const columns = [
        {
            title: 'Asset Number',
            dataIndex: 'AssetNumber',
            key: 'AssetNumber',
        },
        {
            title: 'Dispatched',
            dataIndex: 'Dispatched',
            key: 'Dispatched',
            render: (Dispatched) => Dispatched ? readableDate(Dispatched) : 'NA',
        },
        {
            title: 'Total Panels',
            dataIndex: 'panels',
            key: 'panels',
            render: (panels) => panels ? panels.length : 'NA',
        },
        {
            title: 'Received Panels',
            dataIndex: 'panels',
            key: 'panels',
            render: (panels) => panels && panels.length > 0 ? panels.filter(item => item.received).length : 'NA',
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
        }
    ];

    return (
        <div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Batches"
                isFilter={false}
                data={batches}
                columns={columns}
                pagination={pagination}
            />
        </div>
    );
};

export default MyBatches;
