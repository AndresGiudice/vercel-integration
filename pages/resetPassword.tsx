import { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/resetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Contraseña modificada exitosamente');
    } else {
      setMessage('Error en el proceso de modificación de contraseña');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;