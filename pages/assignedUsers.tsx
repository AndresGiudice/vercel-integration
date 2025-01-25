import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Add this import

interface User {
  _id: string;
  name: string;
  email: string;
  priceList: string;
  // ...other properties if needed
}

const AssignedUsers = () => {
  const router = useRouter();
  const { name } = router.query;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const seller = localStorage.getItem('seller');
    if (!authToken || !seller) {
      router.push('/loginSeller');
      return;
    }

    if (name) {
      fetch(`/api/assignedUser?seller=${name}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUsers(data.users);
          }
        })
        .catch(error => console.error('Error fetching assigned users:', error));
    }
  }, [name]);

  const handleAccessUser = async (userId: string) => {
    const response = await fetch('/api/loginAsUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sellerName: name, userId }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('assignedUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', 'assignedUserToken'); // Add this line to set a token
      router.push('/');
    } else {
      console.error('Error logging in as user:', data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('assignedUser');
    localStorage.removeItem('seller');
    router.push('/loginSeller');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Bienvenido, {name}</h1>
          <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" /> {/* Add image */}
        </div>
        <h2 className="text-xl mb-4">Usuarios asignados:</h2>
        <ul>
          {users.map(user => (
            <li key={user._id} className="mb-2">
              <button
                onClick={() => handleAccessUser(user._id)}
                className="text-blue-500 hover:underline"
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AssignedUsers;