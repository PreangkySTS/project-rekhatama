import axios from 'axios';

const API_URL = 'http://localhost:8000/api/transactions';

export interface Transaction {
    id: number;
    perusahaan: string;
    quadrant: number;
    pic: string;
    jabatan: string;
    progress: string;
}

// src/app/api/transactions.ts

// src/app/api/transactions.ts

export const getTransactions = async () => {
    const response = await fetch('http://localhost:8000/api/transactions', {
        method: 'GET',
        credentials: 'include', // Sertakan kredensial sesi (cookies) saat membuat permintaan
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    return data; // Pastikan ini mengembalikan data yang sesuai
};



export const createTransaction = async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await axios.post(API_URL, transactionData);
    return response.data.transaction;
};

export const updateTransaction = async (id: number, transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await axios.put(`${API_URL}/${id}`, transactionData);
    return response.data.transaction;
};




export const deleteTransaction = async (id: number) => {
    const response = await fetch(`http://localhost:8000/api/transactions/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete transaction');
    }

    return response.json();
};