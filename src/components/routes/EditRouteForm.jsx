import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import api from '../../utils/api';
import { CloseCircleOutlined } from '@ant-design/icons';

const EditRouteForm = ({ onCancel, editModalVisible, editRouteData, fetchRoutes }) => {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [crateList, setCrateList] = useState([]);
    const [initialUserList, setInitialUserList] = useState([]);
    const [initialCrateList, setInitialCrateList] = useState([]);
    const [curUser, setCurUser] = useState();
    const [curCrate, setCurCrate] = useState();
    const [deliveringItems, setDeliveringItems] = useState([]);

    useEffect(() => {
        api.request('get', '/api/user/customer')
            .then((res) => {
                const { data } = res;
                setUserList(data);
                setInitialUserList(data);
            });
        api.request('get', '/api/crate/route')
            .then((res) => {
                const { data } = res;

                const allCrateIds = editRouteData.DeliveringItems.reduce((crateIds, item) => {
                    crateIds.push(...item.crateIds);
                    return crateIds;
                }, []);

                const mergedCrates = [...allCrateIds, ...data].reduce((acc, crate) => {
                    if (!acc.some(item => item._id === crate._id)) {
                        acc.push(crate);
                    }
                    return acc;
                }, []);

                setCrateList(data);
                setInitialCrateList(mergedCrates);
            });
    }, []);

    useEffect(() => {
        if (editRouteData && Array.isArray(editRouteData.DeliveringItems)) {
            const modifiedDeliveringItems = editRouteData.DeliveringItems.map(item => ({
                customerId: item.customerId._id,
                crateIds: item.crateIds.map(crate => crate._id),
            }));
            setDeliveringItems(modifiedDeliveringItems);
        }
    }, [editRouteData]);

    const onFinish = async (values) => {
        try {


            const currentCrateIds = deliveringItems.reduce((crateIds, item) => {
                crateIds.push(...item.crateIds);
                return crateIds;
            }, []);

            const modifiedDeliveringItems = editRouteData.DeliveringItems.map(item => ({
                customerId: item.customerId._id,
                crateIds: item.crateIds.map(crate => crate._id),
            }));

            const previousCrateIds = modifiedDeliveringItems.reduce((crateIds, item) => {
                crateIds.push(...item.crateIds);
                return crateIds;
            }, []);

            const newlyAddedCrates = currentCrateIds.filter(crateId => !previousCrateIds.includes(crateId));
            const removedCrates = previousCrateIds.filter(crateId => !currentCrateIds.includes(crateId));


            values['DeliveringItems'] = deliveringItems;
            values['newlyAddedCrates'] = newlyAddedCrates;
            values['removedCrates'] = removedCrates;
            const response = await api.request('put', `/api/route/${editRouteData._id}`, values);
            onCancel(false);
            fetchRoutes();
        } catch (error) {
            console.error('Error updating route:', error);
        }
    };

    const handleAddItems = () => {
        const cloneDeliveringItems = [...deliveringItems];
        cloneDeliveringItems.push({
            crateIds: curCrate,
            customerId: curUser
        });
        setDeliveringItems(cloneDeliveringItems);
        setCurUser(null);
        setCurCrate([]);
    }

    const handleRemoveItem = (itemToRemove) => {
        const updatedDeliveringItems = deliveringItems.filter(item => item.customerId !== itemToRemove.customerId);
        setDeliveringItems(updatedDeliveringItems);
    };

    useEffect(() => {
        const updatedUserList = initialUserList.filter(user => {
            return !deliveringItems.some(item => item.customerId === user._id);
        });

        const updatedCrateList = initialCrateList.filter(crate => {
            return !deliveringItems.some(item => item.crateIds.includes(crate._id));
        });

        setUserList(updatedUserList);
        setCrateList(updatedCrateList);
    }, [initialUserList, initialCrateList, deliveringItems]);

    return (
        <Modal
            title="Edit Route"
            open={editModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="Name" initialValue={editRouteData.Name} rules={[{ required: true, message: 'Please enter a Name' }]}>
                    <Input />
                </Form.Item>

                {deliveringItems && deliveringItems.length > 0 && deliveringItems.map(item => {
                    const customer = initialUserList.find(user => user._id === item.customerId);
                    const crateSerialNumbers = item.crateIds.map(crateId => {
                        const crate = initialCrateList.find(crate => crate._id === crateId);
                        return crate ? crate.serialNumber : '';
                    });

                    return (
                        <div style={{ display: 'flex', gap: '10px' }} key={item.customerId}>
                            <div>{customer ? customer.name : 'Unknown Customer'}</div>
                            <div>{crateSerialNumbers.join(",     ")}</div>
                            <Button type="link" onClick={() => handleRemoveItem(item)} icon={<CloseCircleOutlined />} />
                        </div>
                    );
                })}

                <Form.Item label="Delivering Details" >
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Select
                            onChange={(data) => setCurUser(data)}
                            value={curUser}
                            style={{ width: '30%' }}
                            placeholder="Select customer"
                        >
                            {userList.map(item => (
                                <Select.Option key={item._id} value={item._id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select mode="tags"
                            onChange={(data) => setCurCrate(data)}
                            value={curCrate}
                            style={{ width: '50%' }} placeholder="Select or type crates">
                            {crateList.map(item => <Select.Option key={item._id} value={item._id}>{item.serialNumber}</Select.Option>)}
                        </Select>
                        <Button type="primary" onClick={handleAddItems} >
                            Add
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Route
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditRouteForm;
