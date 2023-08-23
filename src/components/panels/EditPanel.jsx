import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditPanel = ({ panel, editModalVisible, setEditModalVisible, fetchPanels }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
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
                <Form.Item label="Serial Number" name="serialNumber" initialValue={panel.serialNumber}>
                    <Input />
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
