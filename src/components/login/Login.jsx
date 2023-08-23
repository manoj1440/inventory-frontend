
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import api from "../../utils/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email || !password) {
            setErr("Please fill in both email and password.");
            return;
        }
        api.request('post', '/api/login', {
            email: email,
            password: password
        })
            .then((response) => {
                if ( !response.status) {
                    setErr(response.message);
                } else {
                    setErr(null);
                }

                if ( response.status) {
                    console.log(response, "loginresponse")
                    navigate("/");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <div className="login-page">
                <div className="background"></div>
                <div className="login-box">
                    <div className="box-content">
                        <div className="left-content">
                            <div>
                                image here
                            </div>
                            <h2>Login</h2>
                            <Form>

                                {err && <p className="text-danger">{err}</p>}
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label style={{ textAlignLast: 'left' }}>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label style={{ textAlignLast: 'left' }}>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleLogin}>
                                    Login
                                </Button>
                            </Form>

                        </div>
                        <div className="right-content">
                            Powered By INFYU LABS
                        </div>
                    </div>
                </div>
            </div>
            {/* <Container className="d-flex align-items-center justify-content-center" style={{
             minHeight: '100vh',
             minWidth: '100vw',
           }}>
             <Row style={{
               minHeight: '35vh',
               minWidth: '35vw',
               backgroundColor: "red",
               placeContent: "center"
             }}>
               <Col xs={12} md={6}>
                 <Form>
                   <h2>Login</h2>
                   {err && <p className="text-danger">{err}</p>}
                   <Form.Group className="mb-3" controlId="email">
                     <Form.Label>Email</Form.Label>
                     <Form.Control
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Enter your email"
                     />
                   </Form.Group>
                   <Form.Group className="mb-3" controlId="password">
                     <Form.Label>Password</Form.Label>
                     <Form.Control
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Enter your password"
                     />
                   </Form.Group>
                   <Button variant="primary" onClick={handleLogin}>
                     Login
                   </Button>
                 </Form>
               </Col>
             </Row>
           </Container> */}
        </>
    );
};

export default Login;
