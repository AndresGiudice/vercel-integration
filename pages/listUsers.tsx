import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ListUsers = () => {
  interface User {
    name: string;
    email: string;
    priceList: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const visitedCreateUser = localStorage.getItem('visitedCreateUser');
    if (!visitedCreateUser) {
      router.push('/createUser'); // Redirigir a createUser si no se ha visitado la página
      return;
    }

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
  }, [router]);

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