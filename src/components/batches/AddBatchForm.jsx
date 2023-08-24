import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import api from '../../utils/api';
import Panels from '../panels/Panels';

const AddBatchForm = ({ onCancel, isAddModal, fetchPanels }) => {
    const [form] = Form.useForm();
    const [userPanelList, setUserPanelList] = useState({
        users: [],
        panels: []
    });

    useEffect(() => {
        let newArray = []
        api.request('get', '/api/user')
            .then((res) => {

                const { data } = res;
                newArray = data.map((v, i) => {
                    return v.name
                })
                console.log("=====", newArray);
                setUserPanelList({ ...userPanelList, users: newArray })

            })
        api.request('get', '/api/panel')
            .then((res) => {

                const { data } = res;
                let newArray1 = data.map((v, i) => {
                    return v.serialNumber
                })
                console.log("=====", newArray);
                setUserPanelList({ ...userPanelList, panels: newArray1, users: newArray })
            })
    }, [])

    console.log("userPanelList===", userPanelList);

    const onFinish = async (values) => {
        try {
            console.log("=====", values)
            const response = await api.request('post', `/api/batch`, values);
            onCancel(false);
            fetchPanels();
        } catch (error) {
            console.error('Error adding Panel:', error);
        }
    };

    return (
        <Modal
            title="Add Panel"
            open={isAddModal}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="AssetNumber" name="assetNumber" rules={[{ required: true, message: 'Please enter a AssetNumber' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="quantity" name="quantity" rules={[{ required: true, message: 'Please enter a quantity' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="PCM" name="PCM" rules={[{ required: true, message: 'Please enter a PCM' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="DOM" name="DOM" rules={[{ required: true, message: 'Please enter a DOM' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="WhLocation" name="WhLocation" rules={[{ required: true, message: 'Please enter a WhLocation' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="DeliveryLocation" name="DeliveryLocation" rules={[{ required: true, message: 'Please enter a DeliveryLocation' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="User" name="user" rules={[{ required: true, message: 'Please enter a user' }]}>
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select or type user">
                        {/* Pass user.location as initial value for multi-select chips */}
                        {userPanelList.users.map(loc => <Select.Option key={loc} value={loc}>{loc}</Select.Option>)}
                    </Select>
                </Form.Item>
               
                <Form.Item label="Panel" name="panel" rules={[{ required: true, message: 'Please enter a panel' }]}>
                    <Select>
                        {userPanelList.panels.map(loc => <Select.Option value={loc}>{loc}</Select.Option>)}

                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Batch
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddBatchForm;
