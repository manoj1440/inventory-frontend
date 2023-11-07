import React from 'react';
import { Modal, Form, Input, Button, DatePicker } from 'antd';
import api from '../../utils/api';

const AddCrateForm = ({ onCancel, isAddModal, fetchPanels }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', `/api/crate`, values);
            onCancel(false);
            fetchPanels();
        } catch (error) {
            console.error('Error adding Crate:', error);
        }
    };

    return (
        <Modal
            title="Add Crate"
            open={isAddModal}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="serialNumber" name="serialNumber" rules={[{ required: true, message: 'Please enter serial Number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="DOM" name="DOM">
                    <DatePicker />
                </Form.Item>
                <Form.Item label="PCM" name="PCM">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Crate
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCrateForm;
