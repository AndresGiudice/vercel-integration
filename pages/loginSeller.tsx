import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginSeller = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch('/api/loginSeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('seller', JSON.stringify(data.seller));
      router.push(`/assignedUsers?name=${name}`);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Login Vendedor</h1>
          <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" /> {/* Add image */}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-4 w-full text-black"
        />
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full pr-10 text-black"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? '🔓' : '🔒'}
          </span>
        </div>
        <button onClick={handleLogin} className="bg-green-500 text-white py-2 rounded hover:bg-green-600 w-full"> {/* Change button color */}
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginSeller;