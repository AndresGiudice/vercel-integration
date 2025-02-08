import { useState, useEffect } from 'react';
import Link from 'next/link';
import { setCookie } from 'nookies';

interface Seller {
  _id: string;
  name: string;
}

const CreateUser = () => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [priceList, setPriceList] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState('');

  useEffect(() => {
    setCookie(null, 'visitedCreateUser', 'true', { path: '/' });

    const fetchSellers = async () => {
      const response = await fetch('/api/listSellers');
      const data = await response.json();
      if (data.success) {
        setSellers(data.sellers);
      }
    };

    fetchSellers();
  }, []);

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
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
        // setMessage('Login successful'); // Remove this line
      } else {
        setMessage('Login failed: ' + data.message);
      }
    } catch (error) {
      setMessage('Error del servidor: ' + (error as Error).message);
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

  const handleUserCreation = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword, priceList, seller: selectedSeller || null }), // Ensure seller is included
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Usuario creado exitosamente');
      localStorage.setItem('userCreated', 'true'); // Establecer bandera en localStorage
      localStorage.setItem('priceList', priceList); // Guardar Lista de Precios en localStorage
    } else if (data.message === 'Email already registered') {
      setMessage('El mail ya está registrado');
    } else {
      setMessage('Error al crear el usuario: ' + data.message);
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
              <h1 className="text-2xl font-bold">Crear Usuario</h1>
              <Link href="/listUsers?token=expected_token_value" legacyBehavior>
                <a className="text-green-500 hover:underline">
                  Ver listado de usuarios
                </a>
              </Link>
            </div>
            <form onSubmit={handleUserCreation}>
              <div className="mb-4">
                <label htmlFor="userName" className="block text-gray-700 font-bold mb-2">Nombre:</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userEmail" className="block text-gray-700 font-bold mb-2">Email:</label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded pr-10"
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
                <label htmlFor="priceList" className="block text-gray-700 font-bold mb-2">Lista de Precios:</label>
                <select
                  id="priceList"
                  value={priceList}
                  onChange={(e) => setPriceList(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">seleccione una lista</option>
                  <option value="lista2">lista2</option>
                  <option value="lista2-10">lista2-10</option>
                  <option value="lista2-10-5">lista2-10-5</option>
                  <option value="lista2-final">lista2-final</option>
                  <option value="lista2-10-final">lista2-10-final</option>
                  <option value="lista2-10-5-final">lista2-10-5-final</option>
                  <option value="lista3">lista3</option>
                  <option value="lista3-10">lista3-10</option>
                  <option value="lista3-10-5">lista3-10-5</option>
                  <option value="lista3-final">lista3-final</option>
                  <option value="lista3-10-final">lista3-10-final</option>
                  <option value="lista3-10-5-final">lista3-10-5-final</option>
                  <option value="lista4">lista4</option>
                  <option value="lista4-10">lista4-10</option>
                  <option value="lista4-10-5">lista4-10-5</option>
                  <option value="lista4-final">lista4-final</option>
                  <option value="lista4-10-final">lista4-10-final</option>
                  <option value="lista4-10-5-final">lista4-10-5-final</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="seller" className="block text-gray-700 font-bold mb-2">Vendedor:</label>
                <select
                  id="seller"
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Seleccione un vendedor</option>
                  <option value="none">Ninguno</option> {/* Add option for "ninguno" */}
                  {sellers.map((seller) => (
                    <option key={seller._id} value={seller._id}>{seller.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Crear Usuario
              </button>
            </form>
          </>
        )}
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default CreateUser;