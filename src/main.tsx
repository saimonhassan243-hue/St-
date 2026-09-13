import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackMessage="কিছু একটা সমস্যা হয়েছে, অ্যাপটি পুনরায় চালু করুন">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
