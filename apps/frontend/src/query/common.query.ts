import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 86_400_000, // 24 hours
            refetchInterval: false, // disable automatic refetching
            retry: 1,
        },
    },
});
