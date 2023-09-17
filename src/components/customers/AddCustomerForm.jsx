import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tag } from 'antd';
import api from '../../utils/api';
import { PlusOutlined } from '@ant-design/icons';

const AddCustomerForm = ({ onCancel, isAddModal, fetchUsers }) => {
    const [form] = Form.useForm();
    const [locations, setLocations] = useState([]);
    const [currentLocation, setCurrentLocation] = useState('');

    const onFinish = async (values) => {
        try {
            values.role = 'customer';
            values.location = locations;
            const response = await api.request('post', `/api/user`, values);
            onCancel(false);
            fetchUsers();
        } catch (error) {
            console.error('Error adding User:', error);
        }
    };

    const handleLocationAdd = () => {
        if (currentLocation.trim() !== '') {
            if (!locations.includes(currentLocation.trim())) {
                setLocations([...locations, currentLocation.trim()]);
                setCurrentLocation('');
            }
        }
    };

    const handleLocationInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLocationAdd();
        }
    };

    const handleLocationRemove = (removedLocation) => {
        const updatedLocations = locations.filter(loc => loc !== removedLocation);
        setLocations(updatedLocations);
    };

    return (
        <Modal
            title="Add Customer"
            open={isAddModal}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>
                <Form.Item label="Contact" name="contact" rules={[{ required: true, message: 'Please enter a contact number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Location">
                    <Input
                        placeholder="Enter a location"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        onKeyDown={handleLocationInputKeyDown}
                        addonAfter={<PlusOutlined onClick={handleLocationAdd} />}
                    />
                </Form.Item>
                {locations.length > 0 && <Form.Item>
                    {locations.map((location, index) => (
                        <Tag
                            key={index}
                            closable
                            onClose={() => handleLocationRemove(location)}
                            style={{ marginBottom: '8px' }}
                        >
                            {location}
                        </Tag>
                    ))}
                </Form.Item>}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Customer
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCustomerForm;
