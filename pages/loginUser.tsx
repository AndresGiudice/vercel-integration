import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginUser = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUserLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('Price List:', data.priceList); // Log the priceList to the console
      setMessage('Login successful');
      router.push('/'); // Redirect to index page
    } else {
      setMessage('Login failed: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
        </div>
        <form onSubmit={handleUserLogin}>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userPassword" className="block text-gray-700 font-bold mb-2">Contraseña:</label>
            <input
              type="password"
              id="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Ingresar
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginUser;
