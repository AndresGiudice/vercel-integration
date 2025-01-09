import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const ListSellers = () => {
  interface Seller {
    name: string;
    email: string;
    region: string;
  }

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [editingSeller, setEditingSeller] = useState<string | null>(null);
  const [editedSeller, setEditedSeller] = useState<Seller | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSellers = async () => {
      const response = await fetch('/api/listSellers');
      const data = await response.json();
      if (data.success) {
        setSellers(data.sellers);
      } else {
        console.error('Error fetching sellers:', data.message);
      }
    };

    fetchSellers();
  }, [router]);

  const handleEditClick = (seller: Seller) => {
    setEditingSeller(seller.email);
    setEditedSeller(seller);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedSeller) {
      setEditedSeller({ ...editedSeller, [e.target.name]: e.target.value });
    }
  };

  const handleSaveClick = async () => {
    if (editedSeller) {
      const response = await fetch('/api/updateSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSeller),
      });
      const data = await response.json();
      if (data.success) {
        setSellers(sellers.map(seller => seller.email === editedSeller.email ? editedSeller : seller));
        setEditingSeller(null);
        setEditedSeller(null);
      } else {
        console.error('Error updating seller:', data.message);
      }
    }
  };

  const handleDeleteClick = async (email: string) => {
    const response = await fetch('/api/deleteSeller', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.success) {
      setSellers(sellers.filter(seller => seller.email !== email));
    } else {
      console.error('Error deleting seller:', data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Listado de Vendedores</h1>
          <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
        </div>
        <ul>
          {sellers.map((seller) => (
            <li key={seller.email} className="mb-2">
              {editingSeller === seller.email ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editedSeller?.name || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  />
                  <input
                    type="text"
                    name="email"
                    value={editedSeller?.email || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  />
                  <input
                    type="text"
                    name="region"
                    value={editedSeller?.region || ''}
                    onChange={handleInputChange}
                    className="border p-1 mb-1 w-full"
                  />
                  <button onClick={handleSaveClick} className="bg-green-500 text-white p-1 rounded">Guardar</button>
                </div>
              ) : (
                <div>
                  <p><strong>Nombre:</strong> {seller.name}</p>
                  <p><strong>Email:</strong> {seller.email}</p>
                  <p><strong>Región:</strong> {seller.region}</p>
                  <button onClick={() => handleEditClick(seller)} className="text-green-500 mr-2">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteClick(seller.email)} className="text-red-500">
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

export default ListSellers;
