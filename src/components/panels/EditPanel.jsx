import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';

const EditPanel = ({ panel, editModalVisible, setEditModalVisible, fetchPanels }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.resetFields();
        if (panel.DOM) {
            panel.DOE = dayjs(panel.DOE || new Date().toISOString());
        }
        if (panel.DOM) {
            panel.DOM = dayjs(panel.DOM || new Date().toISOString());
        }
        form.setFieldsValue(panel);
    }, [panel, form]);

    const onFinish = async (values) => {
        try {

            if (values.received) {
                values.receivedAt = new Date().toISOString();
            } else {
                values.receivedAt = null;
            }
            const response = await api.request('put', `/api/panel/${panel._id}`, values);
            setEditModalVisible(false);
            fetchPanels();
        } catch (error) {
            console.error('Error editing panel:', error);
        }
    };

    return (
        <Modal
            title="Edit Panel"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Serial Number" name="serialNumber" >
                    <Input />
                </Form.Item>
                <Form.Item label="DOM" name="DOM" rules={[{ required: true, message: 'Please select a DOM' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="DOE" name="DOE" rules={[{ required: true, message: 'Please select a DOE' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Included in Batch" name="included">
                    <Select placeholder="Select an option">
                        <Select.Option value={true}>Yes</Select.Option>
                        <Select.Option value={false}>No</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Received" name="received">
                    <Select placeholder="Select an option">
                        <Select.Option value={true}>Yes</Select.Option>
                        <Select.Option value={false}>No</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={() => setEditModalVisible(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditPanel;
