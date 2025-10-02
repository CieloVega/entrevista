import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('token', token);
      // Cambiar a App en lugar de redirigir
      window.location.reload(); // Esto recargará y mostrará App si está autenticado
    } else {
      const data = await res.json();
      setError(data.error || 'Error de autenticación');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl mb-4 text-center">Iniciar sesión</h1>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Correo"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600">{error}</p>}
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}