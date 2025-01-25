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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Bienvenido, {name}</h1>
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
      </div>
    </div>
  );
};

export default AssignedUsers;