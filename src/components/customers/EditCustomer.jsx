import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Modal, Tag } from 'antd';
import api from '../../utils/api';
import { PlusOutlined } from '@ant-design/icons';


const EditCustomer = ({ user, onCancel, editModalVisible, fetchUsers }) => {
    const [form] = Form.useForm();
    const [locations, setLocations] = useState([]);
    const [currentLocation, setCurrentLocation] = useState('');

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(user);
    }, [user, form]);

    useEffect(() => {
        setLocations(user.location ? [...user.location] : [])
    }, [user]);

    const onFinish = async (values) => {
        try {
            values.location = locations;
            const response = await api.request('put', `/api/user/${user._id}`, values);
            console.log('User edited:', response);
            onCancel();
            fetchUsers();
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    const handleLocationAdd = () => {
        if (currentLocation.trim() !== '') {
            setLocations([...locations, currentLocation]);
            setCurrentLocation('');
        }
    };

    const handleLocationRemove = (removedLocation) => {
        const updatedLocations = locations.filter(loc => loc !== removedLocation);
        setLocations(updatedLocations);
    };

    return (
        <Modal
            title="Edit Customer"
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
                <Form.Item label="Location">
                    <Input
                        placeholder="Enter a location"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        onPressEnter={handleLocationAdd} // Call handleLocationAdd on Enter key press
                        addonAfter={<PlusOutlined onClick={handleLocationAdd} />} // Icon button for adding location
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

export default EditCustomer;
