import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getAllBlogPosts } from '../api/blogposts.api.ts';
import type { BlogPostTypeIn } from '../types/BlogPostsType.ts';

export function useBlogPosts(): UseQueryResult<BlogPostTypeIn[], Error> {
    return useQuery<BlogPostTypeIn[], Error>({
        queryKey: ['blogPosts'],
        queryFn: getAllBlogPosts,
    });
}
