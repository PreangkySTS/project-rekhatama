// src/app/components/TransactionTable.tsx
"use client";
import React, { useEffect, useState } from 'react';

// Definisi interface untuk data transaksi
interface TransactionData {
    id: number;
    perusahaan: string;
    quadrant: number;
    pic: string;
    jabatan: string;
    progress: string;
}

const TransactionTable: React.FC = () => {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [history, setHistory] = useState<TransactionData[]>([]); // State untuk riwayat transaksi
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [newTransaction, setNewTransaction] = useState<TransactionData>({
        id: 0,
        perusahaan: '',
        quadrant: 0,
        pic: '',
        jabatan: '',
        progress: ''
    });
    const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false); // State untuk modal riwayat

    const token = sessionStorage.getItem('token'); // Ambil token dari sessionStorage

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil data transaksi');
            }

            const data = await response.json();
            setTransactions(data.transactions);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        }
    };

    const fetchTransactionHistory = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/transactions/history', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil data history transaksi');
            }

            const data = await response.json();
            setHistory(data.history); // Set the fetched history to the state
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchTransactionHistory(); // Fetch the history when the component mounts
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTransaction({
            ...newTransaction,
            [name]: name === 'quadrant' ? Number(value) : value
        });
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/transactions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTransaction)
            });

            if (!response.ok) {
                throw new Error('Gagal menambahkan transaksi');
            }

            const data = await response.json();
            setTransactions([...transactions, data.transaction]);
            setNewTransaction({ id: 0, perusahaan: '', quadrant: 0, pic: '', jabatan: '', progress: '' });
            setShowModal(false); // Tutup modal setelah menambah transaksi
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        }
    };

    const handleDeleteTransaction = async () => {
        if (transactionToDelete === null) return;

        try {
            const response = await fetch(`http://localhost:8000/api/transactions/${transactionToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus transaksi');
            }

            setTransactions(transactions.filter(transaction => transaction.id !== transactionToDelete));
            setTransactionToDelete(null);
            setShowDeleteModal(false); // Tutup modal setelah menghapus transaksi
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        }
    };

    const handleEditTransaction = (transaction: TransactionData) => {
        setEditingTransaction(transaction);
        setNewTransaction(transaction);
        setShowModal(true); // Buka modal untuk mengedit
    };

    const handleUpdateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/transactions/${newTransaction.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTransaction)
            });

            if (!response.ok) {
                throw new Error('Gagal memperbarui transaksi');
            }

            const updatedTransaction = await response.json();
            setTransactions(transactions.map(transaction => (transaction.id === updatedTransaction.id ? updatedTransaction : transaction)));
            setEditingTransaction(null);
            setNewTransaction({ id: 0, perusahaan: '', quadrant: 0, pic: '', jabatan: '', progress: '' });
            setShowModal(false); // Tutup modal setelah memperbarui transaksi
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
        }
    };

    // Fungsi untuk mengekspor transaksi ke PDF
    const exportTransactionsToPDF = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/export-transactions-pdf', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Gagal mengekspor transaksi ke PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.pdf'; // Nama file PDF yang akan diunduh
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga saat mengekspor PDF');
        }
    };

    // Modifikasi filter untuk mencari di semua kolom
    const filteredTransactions = transactions.filter(transaction =>
        Object.values(transaction).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fungsi untuk menampilkan riwayat transaksi
    const handleShowHistory = () => {
        setShowHistoryModal(true);
    };

    return (
        <div className="container mx-auto p-4 pt-[7rem]">
            {error && <p className="text-red-500">{error}</p>}

            {/* Flexbox untuk menempatkan tombol dan input pencarian */}
            <div className="flex justify-between mb-4">
                <div>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => setShowModal(true)}
                    >
                        Add Transactions
                    </button>
                    <button
                        className=" bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={exportTransactionsToPDF}
                    >
                        Export PDF
                    </button>
                    {/* <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={handleShowHistory}
                    >
                        History
                    </button> */}
                </div>
                <input
                    type="text"
                    placeholder="Searching..."
                    className="border border-gray-300 p-2 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="min-w-full bg-white  rounded ">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2 text-center">NO</th>
                        <th className="border px-4 py-2 text-center">Corporation</th>
                        <th className="border px-4 py-2 text-center">Quadrant</th>
                        <th className="border px-4 py-2 text-center">PIC</th>
                        <th className="border px-4 py-2 text-center">Title</th>
                        <th className="border px-4 py-2 text-center">Progress</th>
                        <th className="border px-4 py-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                {filteredTransactions.map((transaction, index) => (
    <tr key={transaction.id} className="hover:bg-gray-100">
        {/* Display the index + 1 for the numbering (starting from 1) */}
        <td className="border px-4 py-2 text-center">{index + 1}</td>
        <td className="border px-4 py-2">{transaction.perusahaan}</td>
        <td className="border px-4 py-2 text-center">{transaction.quadrant}</td>
        <td className="border px-4 py-2">{transaction.pic}</td>
        <td className="border px-4 py-2">{transaction.jabatan}</td>
        <td className="border px-4 py-2 ">{transaction.progress}</td>
        <td className="border px-4 py-2 text-center">
            <button
                className="bg-yellow-500  text-white px-4 py-1 rounded mr-2"
                onClick={() => handleEditTransaction(transaction)}
            >
                Edit
            </button>
            <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => {
                    setTransactionToDelete(transaction.id);
                    setShowDeleteModal(true);
                }}
            >
                Delete
            </button>
        </td>
    </tr>
))}

                </tbody>
            </table>

            {/* Modal untuk menambahkan atau mengedit transaksi */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-4 w-1/3">
                        <h2 className="text-lg font-bold mb-2">{editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
                        <form onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}>
                            <input type="hidden" name="id" value={newTransaction.id} />
                            <div className="mb-2">
                                <label className="block mb-1">Corporation</label>
                                <input
                                    type="text"
                                    name="perusahaan"
                                    value={newTransaction.perusahaan}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Quadrant</label>
                                <input
                                    type="number"
                                    name="quadrant"
                                    value={newTransaction.quadrant}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">PIC</label>
                                <input
                                    type="text"
                                    name="pic"
                                    value={newTransaction.pic}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Title</label>
                                <input
                                    type="text"
                                    name="jabatan"
                                    value={newTransaction.jabatan}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Progress</label>
                                <input
                                    type="text"
                                    name="progress"
                                    value={newTransaction.progress}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {editingTransaction ? 'Update' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi penghapusan */}
            {/* {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-4 w-1/3">
                        <h2 className="text-lg font-bold mb-2">Confirm to delete</h2>
                        <p>Are you sure you want to delete it?</p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                            >
                             Cancel
                            </button>
                            <button
                                onClick={handleDeleteTransaction}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                             Delete
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-4 w-1/3">
                        <h2 className="text-lg font-bold mb-2">Confirm to delete</h2>
                        <p>Are you sure you want to delete it?</p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTransaction}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal untuk melihat riwayat transaksi */}
            {/* Modal untuk melihat riwayat transaksi */}

{/*             
            {showHistoryModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded p-4 overflow-y-auto max-h-96 w-[50rem] mx-auto"> 
            <h2 className="text-lg font-bold mb-2 text-center">History transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">NO</th> 
                            <th className="border px-2 py-1">Corporation</th>
                            <th className="border px-2 py-1">Quadrant</th>
                            <th className="border px-2 py-1">PIC</th>
                            <th className="border px-2 py-1">Title</th>
                            <th className="border px-2 py-1">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(hist => (
                            <tr key={hist.id} className="hover:bg-gray-100">
                                <td className="border px-2 py-1">{hist.id}</td>
                                <td className="border px-2 py-1">{hist.perusahaan}</td>
                                <td className="border px-2 py-1">{hist.quadrant}</td>
                                <td className="border px-2 py-1">{hist.pic}</td>
                                <td className="border px-2 py-1">{hist.jabatan}</td>
                                <td className="border px-2 py-1">{hist.progress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => setShowHistoryModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

 */}


        </div>
    );
};

export default TransactionTable;

