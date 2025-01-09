import { useState, useEffect } from 'react';
import Link from 'next/link';
import { setCookie } from 'nookies';

const CreateSeller = () => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showSellerPassword, setShowSellerPassword] = useState(false);

  useEffect(() => {
    setCookie(null, 'visitedCreateSeller', 'true', { path: '/' });
  }, []);

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/loginAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminName, adminEmail, adminPassword }),
    });

    const data = await response.json();
    if (data.success) {
      setIsAuthenticated(true);
    } else {
      setMessage('Login failed: ' + data.message);
    }
  };

  const handleForgotPassword = async () => {
    const response = await fetch('/api/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminEmail }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  const handleSellerCreation = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/createSeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: sellerName, email: sellerEmail, password: sellerPassword }), // Remove priceList
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Vendedor creado exitosamente');
      localStorage.setItem('sellerCreated', 'true');
      // localStorage.setItem('priceList', priceList); // Remove saving priceList in localStorage
    } else if (data.message === 'Email already registered') {
      setMessage('El mail ya está registrado');
    } else {
      setMessage('Error al crear el vendedor: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {!isAuthenticated ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Admin Login</h1>
              <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
            </div>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-4">
                <label htmlFor="adminName" className="block text-gray-700 font-bold mb-2">Nombre:</label>
                <input
                  type="text"
                  id="adminName"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="adminEmail" className="block text-gray-700 font-bold mb-2">Email:</label>
                <input
                  type="email"
                  id="adminEmail"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="adminPassword" className="block text-gray-700 font-bold mb-2">Contraseña:</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    id="adminPassword"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded pr-10"
                  />
                  <span
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showAdminPassword ? '🔓' : '🔒'}
                  </span>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Login
              </button>
            </form>
            <button onClick={handleForgotPassword} className="w-full text-green-700 py-2 mt-4 hover:underline">
              ¿Olvidó su contraseña?
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Crear Vendedor</h1>
              <Link href="/listSellers?token=expected_token_value" legacyBehavior>
                <a className="text-green-500 hover:underline">
                  Ver listado de vendedores
                </a>
              </Link>
            </div>
            <form onSubmit={handleSellerCreation}>
              <div className="mb-4">
                <label htmlFor="sellerName" className="block text-gray-700 font-bold mb-2">Nombre:</label>
                <input
                  type="text"
                  id="sellerName"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="sellerEmail" className="block text-gray-700 font-bold mb-2">Email:</label>
                <input
                  type="email"
                  id="sellerEmail"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="sellerPassword" className="block text-gray-700 font-bold mb-2">Contraseña:</label>
                <div className="relative">
                  <input
                    type={showSellerPassword ? "text" : "password"}
                    id="sellerPassword"
                    value={sellerPassword}
                    onChange={(e) => setSellerPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded pr-10"
                  />
                  <span
                    onClick={() => setShowSellerPassword(!showSellerPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showSellerPassword ? '🔓' : '🔒'}
                  </span>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Crear Vendedor
              </button>
            </form>
          </>
        )}
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default CreateSeller;
