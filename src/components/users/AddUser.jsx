import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const AddUserForm = ({ onCancel, editModalVisible, fetchUsers }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const locationArray = values.location.split(',');
        const newUser = { ...values, location: locationArray };
        onSubmit(newUser);
        form.resetFields();
    };

    return (
        <Modal
            title="Add User"
            open={visible}
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
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="Contact" name="contact" rules={[{ required: true, message: 'Please enter a contact number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter a location' }]}>
                    <Input placeholder="Comma separated values" />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role' }]}>
                    <Select>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="user">User</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add User
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUserForm;
