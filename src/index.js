import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import Login from './pages/Login';
import Register from './pages/Register';
import reportWebVitals from './reportWebVitals';

function AppRouter() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'app'
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  // Si está autenticado, mostrar la app
  if (isAuthenticated) {
    return (
      <App 
        onLogout={() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setCurrentView('login');
        }} 
      />
    );
  }

  // Si no está autenticado, mostrar login o register
  if (currentView === 'register') {
    return (
      <Register 
        onSuccess={() => setCurrentView('login')}
        onBackToLogin={() => setCurrentView('login')}
      />
    );
  }

  // Por defecto mostrar login
  return (
    <Login 
      onSuccess={() => setIsAuthenticated(true)}
      onGoToRegister={() => setCurrentView('register')}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
