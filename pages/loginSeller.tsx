import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


const LoginSeller = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Add rememberMe state
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('savedName');
    const savedEmail = localStorage.getItem('savedEmail'); // Retrieve saved email
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedName && savedEmail && savedPassword) {
      setName(savedName);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!name || !email || !password) { // Validate mandatory fields
      setError('Todos los campos son obligatorios.');
      return;
    }

    const response = await fetch('/api/loginSeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }), // Include email in the request body
    });
    const data = await response.json();
    if (data.success) {
      if (rememberMe) {
        localStorage.setItem('savedName', name);
        localStorage.setItem('savedEmail', email); // Save email
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedName');
        localStorage.removeItem('savedEmail'); // Remove email
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

  const handleForgotPassword = async () => {
    const response = await fetch('/api/forgotPasswordSeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setError(data.message);
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
          required // Make field required
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full text-black"
          required // Make field required
        />
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full pr-10 text-black"
            required // Make field required
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
            <span className="ml-2 text-black">Recordar Datos</span>
          </label>
        </div>
        <button onClick={handleLogin} className="bg-green-500 text-white py-2 rounded hover:bg-green-600 w-full"> {/* Change button color */}
          Ingresar
        </button>
        <button onClick={handleForgotPassword} className="w-full text-green-700 py-2 mt-4 hover:underline">
          ¿Olvidó su contraseña?
        </button>
      </div>
    </div>
  );
};

export default LoginSeller;