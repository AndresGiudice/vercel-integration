import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Add this import
import { FaSearch } from 'react-icons/fa'; // Import search icon

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
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // State for filtered users

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
            setFilteredUsers(data.users); // Initialize filtered users
          }
        })
        .catch(error => console.error('Error fetching assigned users:', error));
    }
  }, [name]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
      )
    );
  };

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
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar Cliente..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <h2 className="text-xl mb-4 text-black">Usuarios asignados:</h2>
        <ul className="max-h-60 overflow-y-auto"> {/* Add scrollable container */}
          {filteredUsers.map(user => ( // Use filteredUsers instead of users
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