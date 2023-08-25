import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditUser = ({ user, onCancel, editModalVisible, fetchUsers }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(user);
    }, [user, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/user/${user._id}`, values);
            console.log('User edited:', response);
            onCancel();
            fetchUsers();
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    return (
        <Modal
            title="Edit User"
            open={editModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter an email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Contact" name="contact" rules={[{ required: true, message: 'Please enter a contact number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role' }]}>
                    <Select>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="user">User</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal >
    );
};

export default EditUser;
