import React, { useState } from 'react';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { registerUser } from '../utils/authUtils';
import style from './LoginRegisterPage.module.css';

function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const registerHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError('Passwords do not match. Please try again.');
            setTimeout(() => {
                setError('');
            }, 10000);
            return;
        }

        try {
            await registerUser(email, password);
        } catch (error) {
            console.error(error);
            setError('Error setting up your account. Please try again.');
            setTimeout(() => {
                setError('');
            }, 10000);
        }
    };

    return (
        <div className={style.pageWrapper}>
            <Card className={style.loginContainer}>
                <Card.Body>
                    <Form onSubmit={(e) => void registerHandler(e)}>
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupPassword">
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
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupRepeatPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    placeholder="Repeat Password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                                <Button variant="dark" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                                    {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <div className={style.buttonContainer}>
                            <Button variant="dark" type="submit">
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

export default RegisterPage;
