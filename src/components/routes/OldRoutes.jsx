import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Typography } from 'antd';
import axios from 'axios';
import api from '../../utils/api';

const { Text } = Typography;

const OldRoutes = () => {
    const [oldRoutes, setOldRoutes] = useState([]);

    useEffect(() => {
        const fetchOldRoutes = async () => {
            try {
                const response = await api.request('get', '/api/route/old');
                setOldRoutes(response.data);
            } catch (error) {
                console.error('Error fetching old routes:', error);
            }
        };

        fetchOldRoutes();
    }, []);


    const renderCrates = (crates) => {
        if (crates && crates.length > 0) {
            return crates.map((crate) => (
                <Tag key={crate._id} color={crate.received ? 'green' : 'volcano'}>
                    {`Crate ${crate.serialNumber} (${crate.received ? 'Received' : 'Not Received'})`}
                </Tag>
            ));
        }
        return <Tag color="volcano">No Crates</Tag>;
    };

    const columns = [
        {
            title: 'Route Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Deliverd Details',
            dataIndex: 'DeliverdItems',
            key: 'DeliverdItems',
            render: (deliverdItems) => {
                return deliverdItems.map((item, index) => (
                    <Space key={index} direction="vertical">
                        <div style={{ margin: '10px', border: '1px solid gray', padding: '5px' }}>
                            <Text strong>{`Dispatched: ${new Date().toDateString(item.Dispatched)}`}</Text>
                            <div>
                                <div>
                                    {item.DeliveringItems.map((deliveringItem, idx) => {
                                        return (
                                            <div key={idx} style={{ margin: '10px', border: '1px solid blue', padding: '5px' }}>
                                                <div>Customer Name: {deliveringItem.customerId.name} ({deliveringItem.customerId.contact})</div>
                                                <div>Total Crates : {deliveringItem.crateIds.length}</div>
                                                <div>Crates : {renderCrates(deliveringItem.crateIds)}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Space>
                ));
            },
        },
    ];

    return <Table
        dataSource={oldRoutes}
        columns={columns}
    />;
};

export default OldRoutes;
