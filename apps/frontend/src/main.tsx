import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import { queryClient } from './query/common.query.ts';
import Root from './Root.tsx';

const root = document.getElementById('root');

if (!root) {
    throw new Error('Could not find root element');
}

createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <Root />
    </QueryClientProvider>,
);
