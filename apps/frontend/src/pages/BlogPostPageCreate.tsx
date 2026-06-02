import React, { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { createBlogPosts, uploadImage } from '../api/blogposts.api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import type { BlogPostTypeOut } from '../types/BlogPostsType.ts';
import style from './BlogPostPageCreate.module.css';

function BlogPostPageCreate() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<BlogPostTypeOut>({
        title: '',
        content: '',
        image_urls: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isAuthenticated) {
        void navigate('/login');
        return null;
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsImageUploading(true);
            setError(null);
            const uploadedUrl = await uploadImage(file);
            setFormData((prev) => ({
                ...prev,
                image_urls: [...prev.image_urls, uploadedUrl],
            }));
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : t('blogPostCreate.errors.uploadFailed') || 'Image upload failed';
            setError(errorMessage);
        } finally {
            setIsImageUploading(false);
            e.target.value = '';
        }
    };

    const handleRemoveImageUrl = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index),
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!formData.title.trim()) {
            setError(t('blogPostCreate.errors.titleRequired'));
            return;
        }

        if (!formData.content.trim()) {
            setError(t('blogPostCreate.errors.contentRequired'));
            return;
        }

        try {
            setIsLoading(true);
            await createBlogPosts(formData);
            setSuccess(true);
            setTimeout(() => {
                void navigate('/blogpost');
            }, 1500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('blogPostCreate.errors.createFailed');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={style.pageWrapper}>
            <Container className="py-4 py-lg-5">
                <Card className={style.formCard}>
                    <Card.Body>
                        <Card.Title className={style.formTitle}>{t('blogPostCreate.title')}</Card.Title>

                        {error ? (
                            <Alert variant="danger" className="mb-4">
                                {error}
                            </Alert>
                        ) : null}

                        {success ? (
                            <Alert variant="success" className="mb-4">
                                {t('blogPostCreate.successMessage')}
                            </Alert>
                        ) : null}

                        <Form onSubmit={(e) => void handleSubmit(e)}>
                            <Form.Group className="mb-4" controlId="formTitle">
                                <Form.Label>{t('blogPostCreate.titleLabel')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder={t('blogPostCreate.titlePlaceholder')}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formContent">
                                <Form.Label>{t('blogPostCreate.contentLabel')}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="content"
                                    placeholder={t('blogPostCreate.contentPlaceholder')}
                                    rows={8}
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formImageUrls">
                                <Form.Label>{t('blogPostCreate.imageUrlsLabel', 'Image Upload')}</Form.Label>

                                <div className="mb-3">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => void handleImageUpload(e)}
                                        disabled={isLoading || isImageUploading}
                                    />
                                    {isImageUploading ? (
                                        <div className="mt-2 text-muted">Uploading image...</div>
                                    ) : null}
                                </div>

                                {formData.image_urls.length > 0 ? (
                                    <div className={style.imageUrlsList}>
                                        {formData.image_urls.map((url, index) => (
                                            <div
                                                key={index}
                                                className={`d-flex flex-column mb-3 ${style.imageUrlItem}`}
                                            >
                                                <div className="d-flex align-items-center mb-2">
                                                    <span
                                                        className={`me-auto text-truncate ${style.imageUrlText}`}
                                                        style={{ maxWidth: '80%' }}
                                                    >
                                                        {url}
                                                    </span>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveImageUrl(index)}
                                                        disabled={isLoading}
                                                    >
                                                        {t('blogPostCreate.removeButton')}
                                                    </Button>
                                                </div>
                                                <img
                                                    src={url}
                                                    alt={`preview ${index}`}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '200px',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </Form.Group>

                            <div className={style.formActions}>
                                <Button variant="dark" type="submit" disabled={isLoading || isImageUploading}>
                                    {isLoading ? t('blogPostCreate.saving') : t('blogPostCreate.publishButton')}
                                </Button>
                                <Button
                                    variant="outline-dark"
                                    onClick={() => void navigate('/blogpost')}
                                    disabled={isLoading || isImageUploading}
                                >
                                    {t('blogPostCreate.cancelButton')}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default BlogPostPageCreate;
