import axios from 'axios';

import type { BlogPostTypeIn, BlogPostTypeOut, UploadImageResponse } from '../types/BlogPostsType';

const baseUrl = import.meta.env.VITE_BLOGPOSTS_API_BASE_URL as string;
if (!baseUrl) {
    throw new Error('VITE_BLOGPOSTS_API_BASE_URL environment variable is not configured');
}

export const blogPostsApi = axios.create({
    baseURL: baseUrl || '',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export async function getAllBlogPosts(): Promise<BlogPostTypeIn[]> {
    const res = await blogPostsApi.get<BlogPostTypeIn[]>('/blogs');
    return res.data;
}

export async function createBlogPosts(newBlogPost: BlogPostTypeOut): Promise<BlogPostTypeIn> {
    const res = await blogPostsApi.post<BlogPostTypeIn>('/blogs', newBlogPost);
    return res.data;
}

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await blogPostsApi.post<UploadImageResponse>('/blogs/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data.image_url;
}
