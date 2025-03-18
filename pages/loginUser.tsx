import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginUser = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUserEmail = localStorage.getItem('userEmail');
    const savedUserName = localStorage.getItem('userName');
    const savedUserPassword = localStorage.getItem('userPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedRememberMe) {
      setUserEmail(savedUserEmail || '');
      setUserName(savedUserName || '');
      setUserPassword(savedUserPassword || '');
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleUserLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Clear localStorage to prevent conflicts with previous login
    localStorage.clear();

    if (rememberMe) {
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userPassword', userPassword);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPassword');
      localStorage.removeItem('rememberMe');
    }

    const response = await fetch('/api/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail, name: userName, password: userPassword }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('Price List:', data.priceList);
      setMessage('Login successful');
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loginSource', 'user'); // Store login source
      router.push('/');
    } else {
      setMessage('Login failed: ' + data.message);
    }
  };

  const handleForgotPassword = async () => {
    const response = await fetch('/api/forgotPasswordUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Iniciar Sesión</h1>
          <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
        </div>
        <form onSubmit={handleUserLogin}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-gray-700 font-bold mb-2">Nombre:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="userPassword" className="block text-gray-700 font-bold mb-2">Contraseña:</label>
            <div className="relative">
              <input
                type={showUserPassword ? "text" : "password"}
                id="userPassword"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded pr-10 text-black"
              />
              <span
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showUserPassword ? '🔓' : '🔒'}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">Recordar mis datos</span>
            </label>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Ingresar
          </button>
        </form>
        <button onClick={handleForgotPassword} className="w-full text-green-700 py-2 mt-4 hover:underline">
          ¿Olvidó su contraseña?
        </button>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginUser;
