"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../utils/axios';
import { AxiosError } from 'axios';

export default function Home() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Ambil URL endpoint dari variabel lingkungan
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                email,
                password,
            });

          // Simpan token dan role di sessionStorage
    sessionStorage.setItem('token', response.data.access_token);
    sessionStorage.setItem('role', response.data.role); // Simpan role

            // Cek role pengguna
            const userRole = response.data.role;
            if (userRole === 'admin') {
                router.push('/admin');
            } else if (userRole === 'manejemen') {
                router.push('/management');
            } else if (userRole === 'sales') { // Menangani role sales
                router.push('/sales'); // Rute untuk dashboard sales
            } else {
                router.push('/dashboard'); // Rute default jika role tidak teridentifikasi
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error(err.response?.data);
                setError(err.response?.data.message || 'Login failed. Please check your credentials.');
            } else {
                console.error(err);
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="bg-blue-50 w-full h-screen flex justify-center items-center p-2">
            <div className="bg-white w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto p-4 rounded-[1.5rem] shadow-lg">
                <form className="flex flex-col items-center" onSubmit={handleLogin}>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-4">
                        LOGIN
                    </h1>

                    <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base font-bold mb-1 w-full text-left">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className="border border-gray-300 bg-slate-100 w-full rounded-lg py-1 px-3 mb-2"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password" className="block text-gray-700 text-sm sm:text-base font-bold mb-1 w-full text-left">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        className="border border-gray-300 bg-slate-100 w-full rounded-lg py-1 px-3 mb-4"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="bg-green-800 text-white py-1 px-3 rounded-lg w-full hover:bg-green-700 transition duration-300 ease-in-out"
                    >
                        Login
                    </button>

                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
}
