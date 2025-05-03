import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/state';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

const dashboard = () => {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  // Redirect to login if user is not set
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  if (!user) return null; // Prevent flashing

  return (
    <main>
        <Head>
            <title>Dashboard</title>
        </Head>
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName} {user.lastName} 👋</h1>
        <p className="text-gray-600 mb-6">You are now logged in with facial recognition.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
    </main>
  );
};

export default dashboard;
