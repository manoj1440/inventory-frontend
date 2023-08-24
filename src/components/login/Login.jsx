
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api";
import { Button, Card, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
    const [form] = Form.useForm();
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleLogin = (values) => {
        if (!values.email || !values.password) {
            setErr("Please fill in both email and password.");
            return;
        }
        api.request('post', '/api/login', values)
            .then((response) => {
                if (!response.status) {
                    setErr(response.message);
                } else {
                    setErr(null);
                }
                if (response.status) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    console.log(response, "loginresponse")
                    navigate("/dashboard");
                    form.resetFields();
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <Title level={2}>Login</Title>
                <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={handleLogin}>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
