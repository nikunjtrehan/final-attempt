import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Dynamic import to catch any module-level errors
import('./App').then((module) => {
  const App = module.default;
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error("Failed to load App:", error);
  root.render(
    <div style={{ color: 'red', padding: '20px', fontFamily: 'monospace' }}>
      <h1>App failed to load</h1>
      <pre>{error?.message || String(error)}</pre>
    </div>
  );
});