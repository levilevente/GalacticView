import { Alert, Badge, Button, Card, Col, Container, Image, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.tsx';
import { useBlogPosts } from '../query/blogPosts.query.ts';
import type { BlogPostTypeIn } from '../types/BlogPostsType.ts';
import style from './BlogPostsPage.module.css';

function formatPostDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function getPostAuthor(post: BlogPostTypeIn, defaultAuthor: string) {
    return post.author ?? post.author_id ?? defaultAuthor;
}

function getPostPreview(content: string, length = 220) {
    if (content.length <= length) {
        return content;
    }

    return `${content.slice(0, length).trimEnd()}...`;
}

function BlogPostPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { data: posts = [], isLoading, error } = useBlogPosts();
    const { t } = useTranslation();

    const handleCreatePostClick = () => {
        void navigate(isAuthenticated ? '/blogpost/new' : '/login');
    };

    return (
        <div className={style.pageShell}>
            <Container className="py-4 py-lg-5">
                {isLoading ? (
                    <div className={style.loadingState}>
                        <Spinner animation="border" role="status" />
                    </div>
                ) : null}

                {error ? (
                    <Alert variant="danger" className="mt-4">
                        <strong>{t('blogPosts.error.title')}</strong>{' '}
                        {error instanceof Error ? error.message : t('blogPosts.error.unknown')}
                    </Alert>
                ) : null}

                {!isLoading && !error && posts.length === 0 ? (
                    <Alert variant="info" className="mt-4">
                        {t('blogPosts.empty')}
                    </Alert>
                ) : null}

                {posts.length ? (
                    <div className="mt-5">
                        <div className={style.sectionHeading}>
                            <h2 className="mb-0">{t('blogPosts.feedTitle')}</h2>
                            <Button variant="dark" onClick={handleCreatePostClick}>
                                {t('blogPosts.createPost')}
                            </Button>
                        </div>

                        <Row xs={1} className="g-4 mt-1">
                            {posts.map((post) => (
                                <Col key={post.id}>
                                    <Card className={style.feedCard}>
                                        <Card.Header className={style.feedHeader}>
                                            <div>
                                                <div className={style.authorLine}>
                                                    {getPostAuthor(post, t('blogPosts.defaultAuthor'))}
                                                </div>
                                                <div className={style.timeLine}>{formatPostDate(post.created_at)}</div>
                                            </div>
                                            <Badge bg="secondary" pill>
                                                {t('blogPosts.badge')}
                                            </Badge>
                                        </Card.Header>

                                        {post.image_urls[0] ? (
                                            <Image
                                                src={post.image_urls[0]}
                                                alt={post.title}
                                                className={style.feedImage}
                                                fluid
                                            />
                                        ) : null}

                                        <Card.Body>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text className={style.feedPreview}>
                                                {getPostPreview(post.content)}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ) : null}
            </Container>
        </div>
    );
}

export default BlogPostPage;
