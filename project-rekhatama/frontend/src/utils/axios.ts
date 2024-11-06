import axios from 'axios';

// Ambil CSRF token dari cookie
const getCsrfToken = () => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));

    // Jika token ditemukan, ambil nilainya; jika tidak, kembalikan undefined
    return token ? token.split('=')[1] : undefined;
}

// Konfigurasi axios
axios.defaults.withCredentials = true; // Pastikan mengizinkan cookies
const csrfToken = getCsrfToken();
if (csrfToken) {
    axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken; // Tambahkan token ke header
} else {
    console.warn('CSRF token is not found.'); // Peringatan jika token tidak ditemukan
}

export default axios;
