export interface BlogPostTypeOut {
    title: string;
    content: string;
    image_urls: string[];
    author_id?: string;
}

export interface BlogPostTypeIn {
    id: string;
    title: string;
    content: string;
    image_urls: string[];
    created_at: string;
    author?: string;
    author_id?: string;
}
