import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import api from '../../utils/api';

const AddPanelForm = ({ onCancel, isAddModal, fetchPanels }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', `/api/panel`, values);
            console.log('Panel Added:', response);
            onCancel();
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
                <Form.Item label="serialNumber" name="serialNumber" rules={[{ required: true, message: 'Please enter serial Number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Panel
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPanelForm;
