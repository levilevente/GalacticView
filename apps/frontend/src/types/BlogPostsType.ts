export interface BlogPostTypeOut {
    title: string;
    content: string;
    image_urls: string[];
}

export interface BlogPostTypeIn {
    id: string;
    title: string;
    content: string;
    image_urls: string[];
    created_at: string;
    author_name: string;
}

export interface UploadImageResponse {
    status: string;
    image_url: string;
}