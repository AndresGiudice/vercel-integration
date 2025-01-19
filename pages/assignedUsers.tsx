import { useRouter } from 'next/router';

const AssignedUsers = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Bienvenido, {name}</h1>
      </div>
    </div>
  );
};

export default AssignedUsers;
