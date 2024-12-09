import { useEffect, useState } from 'react';

const ListUsers = () => {
  interface User {
    name: string;
    email: string;
    priceList: string;
  }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/listUsers');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error('Error fetching users:', data.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Listado de Usuarios</h1>
        <ul>
          {users.map((user) => (
            <li key={user.email} className="mb-2">
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Lista de Precios:</strong> {user.priceList}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListUsers;