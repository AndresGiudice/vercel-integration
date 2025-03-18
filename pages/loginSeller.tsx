import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginSeller = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Add rememberMe state
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('savedName');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedName && savedPassword) {
      setName(savedName);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

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
      if (rememberMe) {
        localStorage.setItem('savedName', name);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedName');
        localStorage.removeItem('savedPassword');
      }
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('seller', JSON.stringify(data.seller));
      localStorage.setItem('loginSource', 'seller'); // Store login source
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
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-black">Recordar Nombre y Contraseña</span>
          </label>
        </div>
        <button onClick={handleLogin} className="bg-green-500 text-white py-2 rounded hover:bg-green-600 w-full"> {/* Change button color */}
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default LoginSeller;