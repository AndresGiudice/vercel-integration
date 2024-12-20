import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; // Import trash icon

const ListUsers = () => {
  interface User {
    name: string;
    email: string;
    priceList: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [priceLists, setPriceLists] = useState<string[]>(['lista4', 'lista4-10', 'lista4-final']);
  const router = useRouter();

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

    const fetchPriceLists = async () => {
      const response = await fetch('/api/getPriceLists');
      const data = await response.json();
      if (data.success) {
        setPriceLists(['lista4', 'lista4-10', 'lista4-final']);
      } else {
        console.error('Error fetching price lists:', data.message);
      }
    };

    fetchUsers();
    fetchPriceLists();
  }, [router]);

  const handleEditClick = (user: User) => {
    setEditingUser(user.email);
    setEditedUser(user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    }
  };

  const handleSaveClick = async () => {
    if (editedUser) {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => user.email === editedUser.email ? editedUser : user));
        setEditingUser(null);
        setEditedUser(null);
      } else {
        console.error('Error updating user:', data.message);
      }
    }
  };

  const handleDeleteClick = async (email: string) => {
    const response = await fetch('/api/deleteUser', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.success) {
      setUsers(users.filter(user => user.email !== email));
    } else {
      console.error('Error deleting user:', data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Listado de Usuarios</h1>
          <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
        </div>
        <ul>
          {users.map((user) => (
            <li key={user.email} className="mb-2">
              {editingUser === user.email ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editedUser?.name || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  />
                  <input
                    type="text"
                    name="email"
                    value={editedUser?.email || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  />
                  <select
                    name="priceList"
                    value={editedUser?.priceList || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  >
                    {priceLists.map((priceList) => (
                      <option key={priceList} value={priceList}>
                        {priceList}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSaveClick} className="bg-green-500 text-white p-1 rounded">Guardar</button>
                </div>
              ) : (
                <div>
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Lista de Precios:</strong> {user.priceList}</p>
                  <button onClick={() => handleEditClick(user)} className="text-green-500 mr-2">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteClick(user.email)} className="text-red-500">
                    <FaTrash />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;

  if (!token || token !== 'expected_token_value') {
    return {
      redirect: {
        destination: '/createUser',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default ListUsers;