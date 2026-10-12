import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

// Registra o Service Worker para suporte PWA offline completo
registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);

