import { useState } from 'react';

export default function Register({ onSuccess, onBackToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registro exitoso');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                setError(data.error || 'Error en el registro');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] shadow-md w-80">
                <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Registro</h1>
                
                <div className="">
                    <input
                        className="w-full mb-2 p-2 border rounded-[10px]"
                        placeholder="Correo"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="">
                    <input
                        className="w-full mb-4 p-2 border rounded-[10px]"
                        placeholder='Contraseña'
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button 
                    className="w-full bg-purple-700 text-white p-2 rounded-[10px]"
                    type="submit"
                >
                    Registrarse
                </button>
                
                {error && <p className="text-red-600 mt-2">{error}</p>}
                {success && <p className="text-green-600 mt-2">{success}</p>}

                <div className="mt-4 text-center">
                    <span className="text-gray-600">¿Ya tienes cuenta? </span>
                    <button 
                        type="button"
                        onClick={onBackToLogin}
                        className="text-purple-700 hover:underline bg-transparent border-none cursor-pointer"
                    >
                        Inicia sesión
                    </button>
                </div>
                
            </form>
        </div>
    );
}