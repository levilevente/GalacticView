import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { Button, Card, CloseButton, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IoSend } from 'react-icons/io5';
import TextareaAutosize from 'react-textarea-autosize';

import useAgentChat from '../hooks/useAgentChat.ts';
import style from './AgentChatWidget.module.css';

const MAX_MESSAGE_LENGTH = 512;

function AgentChatWidget() {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const { messages, isLoading, sendMessage } = useAgentChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (inputMessage.trim() === '' || inputMessage.length > MAX_MESSAGE_LENGTH) return;
        setInputMessage('');

        try {
            await sendMessage(inputMessage.trim());
        } catch (err) {
            console.error('sendMessage failed', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage(e);
        }
    };

    return (
        <div className={style.agentContainer}>
            {isOpen ? (
                <Card className={style.card}>
                    <Card.Header className={style.cardHeader}>
                        <div className="d-flex align-items-center gap-2">
                            <img src="/logo/ai-logo.png" className={style.aiCardLogo} alt="Agent" />
                            <h5 className="m-0">Galactic Agent</h5>
                        </div>
                        <CloseButton variant="white" onClick={toggleChat} aria-label="Close chat" />
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                        <div className={style.cardBodyWelcomeText}>
                            {messages.length === 0 ? <p>{t('agent.welcome')}</p> : null}
                        </div>
                        <div className={style.messagesContainer}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={msg.sender === 'user' ? style.userMessage : style.agentMessage}
                                >
                                    <p className={style.messageText}>{msg.message}</p>
                                </div>
                            ))}
                            {isLoading ? <div className={style.loader} /> : null}
                        </div>
                        <div ref={messagesEndRef} />
                    </Card.Body>
                    <Card.Footer className={style.cardFooter}>
                        <Form onSubmit={(e) => void handleSendMessage(e)} onKeyDown={handleKeyDown}>
                            <InputGroup className={style.inputGroup}>
                                <Form.Control
                                    as={TextareaAutosize}
                                    minRows={1}
                                    maxRows={5}
                                    placeholder={t('agent.placeholder')}
                                    className={style.chatInput}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                />
                                <Button type="submit" variant="dark" disabled={isLoading}>
                                    <IoSend size={18} />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Card.Footer>
                </Card>
            ) : null}

            <div
                className={style.agentButton}
                onClick={toggleChat}
                tabIndex={0}
                aria-label="Toggle Agent Chat"
                role="button"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleChat();
                    }
                }}
            >
                <img src="/logo/ai-logo.png" alt="agent logo" className={style.agentLogo} />
            </div>
        </div>
    );
}

export default AgentChatWidget;
