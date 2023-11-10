import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import api from '../../utils/api';
import { CloseCircleOutlined } from '@ant-design/icons';

const AddNewRouteForm = ({ onCancel,editRouteData,setEditRouteData, isAddModal, fetchRoutes }) => {
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
                setCrateList(data);
                setInitialCrateList(data);
            });
    }, []);

    const onFinish = async (values) => {
        try {
            values['DeliveringItems'] = deliveringItems;
            values['oldData'] = editRouteData
            const response = await api.request('post', `/api/route/add-new-delivery`, values);
            onCancel(false);
            setEditRouteData({});
            fetchRoutes();
        } catch (error) {
            console.error('Error adding route:', error);
        }
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


    return (
        <Modal
            title="Add New Delivery"
            open={isAddModal}
            onCancel={() => {onCancel(false); setEditRouteData({});}}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item  initialValue={editRouteData.Name} label="Name" name="Name" rules={[{ required: true, message: 'Please enter a Name' }]}>
                    <Input disabled />
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
                            style={{ width: '100%' }}
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
                            style={{ width: '100%' }} placeholder="Select or type crates">
                            {crateList.map(item => <Select.Option key={item._id} value={item._id}>{item.serialNumber}</Select.Option>)}
                        </Select>
                        <Button type="primary" onClick={handleAddItems} >
                            Add
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                    Add New Delivery
                    </Button>
                    <Button onClick={() => {onCancel(false); setEditRouteData({});}} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddNewRouteForm;
