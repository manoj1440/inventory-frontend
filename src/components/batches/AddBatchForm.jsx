import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker } from 'antd';
import api from '../../utils/api';

const AddBatchForm = ({ onCancel, isAddModal, fetchBatches }) => {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [panelList, setPanelList] = useState([]);

    useEffect(() => {
        api.request('get', '/api/user/customer')
            .then((res) => {
                const { data } = res;
                setUserList(data);
            });
        api.request('get', '/api/panel/batch')
            .then((res) => {
                const { data } = res;
                setPanelList(data);
            });
    }, []);

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', `/api/batch`, values);
            onCancel(false);
            fetchBatches();
        } catch (error) {
            console.error('Error adding batch:', error);
        }
    };

    return (
        <Modal
            title="Add Batch"
            open={isAddModal}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="AssetNumber" name="AssetNumber" rules={[{ required: true, message: 'Please enter an AssetNumber' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="PCM" name="PCM" rules={[{ required: true, message: 'Please enter a PCM' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="DOM" name="DOM" rules={[{ required: true, message: 'Please select a DOM' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="WhLocation" name="WhLocation" rules={[{ required: true, message: 'Please enter a WhLocation' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Customer" name="user" rules={[{ required: true, message: 'Please select a user' }]}>
                    <Select
                        onChange={(value) => {
                            setSelectedUser({});
                            setSelectedUser(null);
                            form.resetFields(["DeliveryLocation"]);
                            const selected = userList.find((user) => user._id === value);
                            setSelectedUser(selected);
                        }}
                        style={{ width: '100%' }} placeholder="Select or type user">
                        {userList.map(item => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="DeliveryLocation" name="DeliveryLocation" rules={[{ required: true, message: 'Please select a DeliveryLocation' }]}>
                    <Select disabled={!selectedUser} style={{ width: '100%' }} placeholder="Select or type user">
                        {selectedUser && selectedUser.location && selectedUser.location.map((item, idx) => <Select.Option key={idx} value={item}>{item}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Panel" name="panels" rules={[{ required: true, message: 'Please select panels' }]}>
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select or type panels">
                        {panelList.map(item => <Select.Option key={item._id} value={item._id}>{item.serialNumber}</Select.Option>)}
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
