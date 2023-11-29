import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Typography } from 'antd';
import * as XLSX from 'xlsx';

import axios from 'axios';
import api from '../../utils/api';
import { FileExcelOutlined } from '@ant-design/icons';

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

    const handleExportExcel = () => {
        if (oldRoutes && oldRoutes.length <= 0) {
            message.error('There is no data to export');
            return;
        }

        const data = transformData([...oldRoutes]);


        console.log('data===', data);
        console.log('oldRoutes===', oldRoutes);

        const excludedKeys = [];

        const tempRows = data.map((r) => {
            const rowObject = {};
            Object.keys(r).forEach((key) => {
                if (!excludedKeys.includes(key)) {
                    rowObject[key] = r[key];
                }
            });
            return rowObject;
        });

        const worksheet = XLSX.utils.json_to_sheet(tempRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Old Route Info');
        XLSX.writeFile(workbook, `${'OldRouteInfo'}.xlsx`, { compression: true });
    };

    return (
        <>
            <Button
                icon={<FileExcelOutlined />}
                style={{
                    float: 'right',
                    marginBottom: '10px'
                }}
                onClick={handleExportExcel}
                type="primary">
                Export
            </Button>
            <Table
                dataSource={oldRoutes}
                columns={columns}
            />
        </>);
};

function transformData(data) {

    const result = [];

    data.forEach(depot => {

        depot.DeliverdItems.forEach(delivery => {

            delivery.DeliveringItems.forEach(dItem => {

                const customer = delivery.Customers.find(c => c._id.toString() === dItem.customerId._id.toString());

                let receivedCrates = 0;
                dItem.crateIds.forEach(crateId => {
                    const crate = delivery.Crates.find(c => c._id.toString() === crateId._id.toString());
                    if (crate.received) {
                        receivedCrates++;
                    }
                });

                const item = {
                    Name: delivery.Name,
                    Dispatched: delivery.Dispatched,
                    CustomerName: customer.name,
                    TotalCrates: dItem.crateIds.length,
                    ReceivedCrates: receivedCrates
                };

                result.push(item);

            })

        });

    });

    return result;

}
export default OldRoutes;
