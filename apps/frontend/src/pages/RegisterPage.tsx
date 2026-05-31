import React, { useState } from 'react';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import style from './LoginRegisterPage.module.css';

function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const { register } = useAuth();

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
            await register(email, password, username, firstName, lastName);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
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
                        <Form.Group className="mb-3" controlId="formGroupFirstName">
                            <Form.Label>First Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupLastName">
                            <Form.Label>Last Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
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
                        <Form.Group className="mb-3" controlId="formGroupRepeatPassword">
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
