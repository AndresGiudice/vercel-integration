import { useState } from 'react';

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
      setMessage('Login successful');
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

  const handleUserCreation = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword, priceList }),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Usuario creado exitosamente');
    } else {
      setMessage('Error al crear el usuario: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {!isAuthenticated ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
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
              <div className="mb-4">
                <label htmlFor="adminPassword" className="block text-gray-700 font-bold mb-2">Contraseña:</label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Login
              </button>
            </form>
            <button onClick={handleForgotPassword} className="w-full text-blue-500 py-2 mt-4 hover:underline">
              ¿Olvidó su contraseña?
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>
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
              <div className="mb-4">
                <label htmlFor="priceList" className="block text-gray-700 font-bold mb-2">Lista de Precios:</label>
                <input
                  type="text"
                  id="priceList"
                  value={priceList}
                  onChange={(e) => setPriceList(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
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