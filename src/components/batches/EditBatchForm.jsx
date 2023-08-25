import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';

const EditBatchForm = ({ onCancel, editModalVisible, editBatchData, fetchBatches }) => {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [panelList, setPanelList] = useState([]);

    useEffect(() => {
        api.request('get', '/api/user')
            .then((res) => {
                const { data } = res;
                setUserList(data);
            });
        api.request('get', '/api/panel/batch')
            .then((res) => {
                const { data } = res;
                const mergedPanels = [...editBatchData.panels, ...data].reduce((acc, panel) => {
                    if (!acc.some(item => item._id === panel._id)) {
                        acc.push(panel);
                    }
                    return acc;
                }, []);
                setPanelList(mergedPanels);
            });
    }, []);

    const onFinish = async (values) => {
        try {
            const newDiffPanels = editBatchData.panels
                .filter(panel => !values.panels.includes(panel._id))
                .map(panel => panel._id);
            const payload = {
                ...values,
                diffPanels: newDiffPanels,
            };
            const response = await api.request('put', `/api/batch/${editBatchData._id}`, payload);
            onCancel(false);
            fetchBatches();
        } catch (error) {
            console.error('Error editing batch:', error);
        }
    };

    return (
        <Modal
            title="Edit Batch"
            open={editModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="AssetNumber" name="AssetNumber" initialValue={editBatchData.AssetNumber} rules={[{ required: true, message: 'Please enter an AssetNumber' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Quantity" name="quantity" initialValue={editBatchData.quantity} rules={[{ required: true, message: 'Please enter a quantity' }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="PCM" name="PCM" initialValue={editBatchData.PCM} rules={[{ required: true, message: 'Please enter a PCM' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="DOM" name="DOM" initialValue={dayjs(editBatchData.DOM)} rules={[{ required: true, message: 'Please select a DOM' }]}>
                    <DatePicker />
                </Form.Item>
                {editBatchData.receivedAt &&
                    <>
                        <Form.Item label="Received At" name="receivedAt" initialValue={dayjs(editBatchData.receivedAt)}>
                            <DatePicker />
                        </Form.Item>
                        <Form.Item label="Received Batch" name="received" initialValue={editBatchData.received}>
                            <Select placeholder="Select an option">
                                <Select.Option value={true}>Yes</Select.Option>
                                <Select.Option value={false}>No</Select.Option>
                            </Select>
                        </Form.Item>
                    </>
                }
                <Form.Item label="WhLocation" name="WhLocation" initialValue={editBatchData.WhLocation} rules={[{ required: true, message: 'Please enter a WhLocation' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="DeliveryLocation" name="DeliveryLocation" initialValue={editBatchData.DeliveryLocation} rules={[{ required: true, message: 'Please enter a DeliveryLocation' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="User" name="user" initialValue={editBatchData.user.map(user => user._id)} rules={[{ required: true, message: 'Please select a user' }]}>
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select or type user">
                        {userList.map(item => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Panel" name="panels" initialValue={editBatchData.panels.map(panel => panel._id)} rules={[{ required: true, message: 'Please select panels' }]}>
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select or type panels">
                        {panelList.map(item => <Select.Option
                            key={item._id} value={item._id}>{item.serialNumber}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditBatchForm;
