import { useState } from 'react';

export default function Login({ onSuccess, onGoToRegister }) {
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
      onSuccess(); // Usar la función de callback
    } else {
      const data = await res.json();
      setError(data.error || 'Error de autenticación');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-[20px] shadow-md w-80">
        <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Iniciar sesión</h1>
        <input
          className="w-full mb-2 p-2 border rounded-[10px]"
          placeholder="Correo"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded-[10px]"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600">{error}</p>}
        <button className="w-full bg-pink-500 text-white p-2 rounded-[10px]" type="submit">
          Iniciar sesión
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <button 
            type="button"
            onClick={onGoToRegister}
            className="text-pink-500 hover:underline bg-transparent border-none cursor-pointer"
          >
            Regístrate
          </button>
        </div>
      </form>
    </div>
  );
}