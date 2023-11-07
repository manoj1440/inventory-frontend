import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import api from '../../utils/api';

const AddRouteForm = ({ onCancel, isAddModal, fetchRoutes }) => {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [crateList, setCrateList] = useState([]);

    useEffect(() => {
        api.request('get', '/api/user/customer')
            .then((res) => {
                const { data } = res;
                setUserList(data);
            });
        api.request('get', '/api/crate/route')
            .then((res) => {
                const { data } = res;
                setCrateList(data);
            });
    }, []);

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', `/api/route`, values);
            onCancel(false);
            fetchRoutes();
        } catch (error) {
            console.error('Error adding route:', error);
        }
    };

    return (
        <Modal
            title="Add Route"
            open={isAddModal}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="Name" rules={[{ required: true, message: 'Please enter a Name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Customers" name="Customers" rules={[{ required: true, message: 'Please select customer(s)' }]}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select or type customer(s)"
                    >
                        {userList.map(item => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Crates" name="Crates" rules={[{ required: true, message: 'Please select crates' }]}>
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select or type crates">
                        {crateList.map(item => <Select.Option key={item._id} value={item._id}>{item.serialNumber}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Route
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddRouteForm;
