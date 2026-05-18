import React, { useState } from 'react';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import style from './LoginRegisterPage.module.css';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
            setError('Invalid email or password. Please try again.');
            setTimeout(() => {
                setError('');
            }, 10000);
        }
    };

    return (
        <div className={style.pageWrapper}>
            <Card className={style.loginContainer}>
                <Card.Body>
                    <Form onSubmit={(e) => void onSubmitHandler(e)}>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button variant="dark" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <div className={style.buttonContainer}>
                            <Button variant="dark" type="submit">
                                Log in
                            </Button>
                            <Button variant="dark" href="/register">
                                Sign up
                            </Button>
                        </div>
                    </Form>
                    <Alert variant="danger" className={'mt-3'} style={{ display: error ? 'block' : 'none' }}>
                        {error}
                    </Alert>
                </Card.Body>
            </Card>
        </div>
    );
}

export default LoginPage;
