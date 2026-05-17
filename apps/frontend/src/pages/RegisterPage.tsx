import { useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import style from './LoginRegisterPage.module.css';

function RegisterPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    return (
        <div className={style.pageWrapper}>
            <Card className={style.loginContainer}>
                <Card.Body>
                    <Form>
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="email" placeholder="Enter a username" />
                        </Form.Group>
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" />
                                <Button variant="dark" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className={`mb-3 ${style.formGroup}`} controlId="formGroupRepeatPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <InputGroup>
                                <Form.Control type={showRepeatPassword ? 'text' : 'password'} placeholder="Repeat Password" />
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
                </Card.Body>
            </Card>
        </div>
    );
}

export default RegisterPage;
