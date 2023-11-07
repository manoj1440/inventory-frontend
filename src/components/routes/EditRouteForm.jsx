import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';

const EditRouteForm = ({ onCancel, editModalVisible, editRouteData, fetchRoutes }) => {
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
                const mergedCrates = [...editRouteData.Crates, ...data].reduce((acc, crate) => {
                    if (!acc.some(item => item._id === crate._id)) {
                        acc.push(crate);
                    }
                    return acc;
                }, []);
                setCrateList(mergedCrates);
            });
    }, []);

    const onFinish = async (values) => {
        try {
            const newDiffCrates = editRouteData.Crates
                .filter(crate => !values.Crates.includes(crate._id))
                .map(crate => crate._id);
            const payload = {
                ...values,
                diffCrates: newDiffCrates,
            };
            const response = await api.request('put', `/api/route/${editRouteData._id}`, payload);
            onCancel(false);
            fetchRoutes();
        } catch (error) {
            console.error('Error editing route:', error);
        }
    };


    return (
        <Modal
            title="Edit Route"
            open={editModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="Name" initialValue={editRouteData.Name} rules={[{ required: true, message: 'Please enter a Name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Customers" name="Customers" initialValue={editRouteData.Customers.map(customer => customer._id)} rules={[{ required: true, message: 'Please select customer(s)' }]}>
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
                <Form.Item label="Crates" name="Crates" initialValue={editRouteData.Crates.map(crate => crate._id)} rules={[{ required: true, message: 'Please select crates' }]}>
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select or type crates">
                        {crateList.map(item => <Select.Option key={item._id} value={item._id}>{item.serialNumber}</Select.Option>)}
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

export default EditRouteForm;
