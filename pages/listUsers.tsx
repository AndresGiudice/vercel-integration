import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; // Import trash icon

interface User {
  _id: string;
  name: string;
  email: string;
  priceList: string;
  seller: string | null; // Add seller field
}

interface Seller {
  _id: string;
  name: string;
}

const ListUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [priceLists, setPriceLists] = useState<string[]>([
    'lista2', 'lista2-10', 'lista2-10-2', 
    'lista2-final', 'lista2-10-final', 'lista2-10-2-final', 
    'lista3', 'lista3-10', 'lista3-10-2', 
    'lista3-final', 'lista3-10-final', 'lista3-10-2-final', 
    'lista4', 'lista4-10', 'lista4-10-2', 
    'lista4-final', 'lista4-10-final', 'lista4-10-2-final'
 ]);
  const [sellers, setSellers] = useState<Seller[]>([]);
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
        setPriceLists(['lista2', 'lista2-10', 'lista2-10-2', 
    'lista2-final', 'lista2-10-final', 'lista2-10-2-final', 
    'lista3', 'lista3-10', 'lista3-10-2', 
    'lista3-final', 'lista3-10-final', 'lista3-10-2-final', 
    'lista4', 'lista4-10', 'lista4-10-2', 
    'lista4-final', 'lista4-10-final', 'lista4-10-2-final']);
      } else {
        console.error('Error fetching price lists:', data.message);
      }
    };

    const fetchSellers = async () => {
      const response = await fetch('/api/listSellers');
      const data = await response.json();
      if (data.success) {
        setSellers(data.sellers);
      } else {
        console.error('Error fetching sellers:', data.message);
      }
    };

    fetchUsers();
    fetchPriceLists();
    fetchSellers();
  }, [router]);

  const handleEditClick = (user: User) => {
    if (editingUser !== user._id) { // Usar _id en lugar de email
      setEditingUser(user._id);
      setEditedUser(user);
    }
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
        setUsers(users.map(user => user._id === editedUser._id ? editedUser : user)); // Comparar por _id
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
      // Volver a llamar a la API para obtener la lista actualizada de usuarios
      const usersResponse = await fetch('/api/listUsers');
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.users);
      } else {
        console.error('Error fetching updated users:', usersData.message);
      }
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
        <ul className="max-h-96 overflow-y-auto"> {/* Limitar altura y habilitar scroll */}
          {users.map((user) => (
            <li key={user._id} className="mb-2"> {/* Usar _id como key */}
              {editingUser === user._id ? ( // Comparar por _id
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
                  <select
                    name="seller"
                    value={editedUser?.seller || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  >
                    <option value="">Seleccione un vendedor</option>
                    {sellers.map((seller) => (
                      <option key={seller._id} value={seller.name}>{seller.name}</option>
                    ))}
                  </select>
                  <button onClick={handleSaveClick} className="bg-green-500 text-white p-1 rounded">Guardar</button>
                </div>
              ) : (
                <div>
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Lista de Precios:</strong> {user.priceList}</p>
                  <p><strong>Vendedor:</strong> {user.seller || 'No asignado'}</p> {/* Display seller name */}
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