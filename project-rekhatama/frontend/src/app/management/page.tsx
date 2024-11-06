// 'use client';
// import Content from '../components/content/page';
// import { useState } from 'react';



// const Manajemen = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [submenuOpenHome, setSubmenuOpenHome] = useState(false);
//   const [submenuOpenProfile, setSubmenuOpenProfile] = useState(false);
//   const [submenuOpenMessages, setSubmenuOpenMessages] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [showCalendar, setShowCalendar] = useState<boolean>(false);
//   const [activities, setActivities] = useState<Record<string, string>>({
//     '2024-09-13': 'Kang Garda ngasih tugas',
//     '2024-09-17': 'Deadline tugas',
//   });

//   const handleClick = (date: string) => {
//     if (activities[date]) {
//       setSelectedDate(date);
//     }
//   };

//   const handleToggleCalendar = () => {
//     setShowCalendar(prev => !prev);
//   };

//   const renderDays = () => {
//     const daysInMonth = 30;
//     const days = [];

//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = `2024-09-${String(i).padStart(2, '0')}`;
//       const isActivity = !!activities[date];
//       const dayClass = `flex items-center justify-center w-10 h-10 p-2 cursor-pointer 
//            ${isActivity ? 'hover:bg-red-700' : 'hover:bg-green-800'} 
//         rounded-full transition-colors duration-200
//         hover: ${isActivity ? 'hover:text-white' : 'hover:text-gray-100'} `;

//       days.push(
//         <div
//           key={date}
//           className={dayClass}
//           onClick={() => handleClick(date)}
//         >
//           {i}
//           {isActivity && (
//             <span className="w-10 h-1 bg-red-500 rounded-full"></span>
//           )}
//         </div>
//       );
//     }

//     return days;
//   };

//   const handleSubMenuClick = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Mencegah sidebar untuk menutup saat submenu diklik
//     // Lakukan aksi lain jika diperlukan
//   };

//   return (
//     <div className="flex flex-col lg:flex-row h-screen">
//      {/* Sidebar */}
//      <div className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 shadow-2xl rounded-lg text-gray-600 p-4 transform transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

//       {/* BAGIAN SIDE BAR OI BISI POHO  */}
//       {/* JELAS IE BAGIAN ANU TULISAN SIDEBAR NGKE BISA DI GANTI KU IMAGE OGE POKONA IE ANU SIDEBAR ULAH POHO Y */}
//         <div className="flex justify-between items-center">
//           <h1 className="font-bold text-[3rem] mb-10">Sidebar</h1>
//           {/* BUAT NGATUR SI TOMBOL CLOSE NA KADE POHO */}
//           {/* NU BENTUK NA X CO */}
//           <button onClick={() => setSidebarOpen(false)} className="  absolute top-10 right-2 text-white px-2 py-1 text-[2rem]">&times;</button>
//         </div>
//         {/* CUY INI LIST LIST YANG DI BAWAH SIDEBAR CUY INGET BANGET YAH INI POKONAMAH ANU LIST LIST */}
//         <ul>

//           {/* Home dengan submenu */}

//           <li>
//             <div 
//               className="flex items-center cursor-pointer " 
//               onClick={() => setSubmenuOpenHome(prev => !prev)}
//             >
//               <span className="block py-2 px-4 hover:bg-gray-500 rounded text-white font-bold">SALES</span>
//               <span className={` text-white text-xl top-10 font-bold  ${submenuOpenHome ? 'rotate-90' : ''}`}>&gt;</span>
//             </div>
//             {submenuOpenHome && (
//               <ul className="pl-20">
//                 <li><a href="/sales" className="block py-2 px-4 hover:bg-gray-400 rounded text-white font-semibold">ACTIVITY</a></li>
                
//               </ul>
//             )}
//           </li>



//           {/* Profile dengan submenu */}
//           <li>
//             <div 
//               className="flex  items-center cursor-pointer" 
//               onClick={() => setSubmenuOpenProfile(prev => !prev)}
//             >
//               <span className="block py-2 px-4 hover:bg-gray-500 rounded text-white font-bold">ADMIN</span>
//               <span className={` text-white text-xl top-10 font-bold ${submenuOpenProfile ? 'rotate-90' : ''}`}>&gt;</span>
//             </div>
//             {submenuOpenProfile && (
//               <ul className="pl-20">
//                     <li><a href="#" className="block py-2 px-4 hover:bg-gray-400 rounded text-white font-semibold">ACCOUNT</a></li>
//               </ul>
//             )}
//           </li>



//           {/* Messages dengan submenu */}
//           <li>
//             <div 
//               className="flex items-center cursor-pointer" 
//               onClick={() => setSubmenuOpenMessages(prev => !prev)}
//             >
//             <span className="block py-2 px-4 hover:bg-gray-500 rounded text-white font-bold">ACCOUNT</span>
//               <span className={`text-white text-xl top-10 left-10 font-bold ${submenuOpenMessages ? 'rotate-90' : ''}`}>&gt;</span>
//             </div>
//             {submenuOpenMessages && (
//               <ul className="pl-20">
//                     <li><a href="#" className="block py-2 px-4 hover:bg-gray-400 rounded text-white font-semibold">TITLE</a></li>
//                     <li><a href="#" className="block py-2 px-4 hover:bg-gray-400 rounded text-white font-semibold">TITLE</a></li>
//               </ul>
//             )}
//           </li>

//           <li><a href="#" className="block py-2 px-4 hover:bg-gray-500 rounded text-white">MORE</a></li>
//         </ul>
//       </div>



//       {/* Backdrop untuk menutup sidebar */}
//     {/* DI TIADAKAN KARENA REPOT JUGA PUSING JUGA KALO INI ADA NANTI JADINYA MALAH KE CLOSE KALO DI PAKE */}

//       {/* Konten Utama */}
//       {/* IE MAKSUDNA ANU HUM MENU PAS DI BUKA DI HP LAYAR KECIL POKONA BAGIAN INI UDAH MASUK KE RESPONSIF HP LAYAR KECIL */}
//       <div  className={`flex-1 p-4 transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? 'ml-64' : ''
//         }`}
// >

//         {/* Tombol untuk menampilkan sidebar pada perangkat kecil */}
//         {/* TAH IE BUTTON NYA GES YA GES YA GUA UDAH APUS BACKGROUND COLOR NYA YA GES YA BIAR APA ?? BIAR KEREN CUY */}
//         <button
//   className="absolute top-0 left-0 m-4 text-white p-2 rounded-xl"
//   onClick={() => setSidebarOpen(prev => !prev)}
// >
//           {/* INI NIH BAGIAN HUM MENUNA INGET INGET INGET */}
//           {/* MENU HUM ANU GARIS 3 CU */}
//           <span className="block w-6 h-1 bg-gray-800 mb-1 rounded-xl"></span>
//   <span className="block w-6 h-1 bg-gray-800 mb-1 rounded-xl"></span>
//   <span className="block w-6 h-1 bg-gray-800 rounded-xl"></span>
// </button>

//         {/* Tombol untuk menampilkan kalender pada perangkat kecil */}
//         <button
//           className="lg:hidden absolute top-16 right-0 m-4 bg-green-800 text-white px-4 py-2 rounded"
//           onClick={handleToggleCalendar}
//         >
//           {showCalendar ? 'Open' : 'Open'}
//         </button>

// {/* DASHBOARD NA DI IMPORT YA DARI FOLDER CONTENT SOALNA PANJANG BANGET HUHUU */}
//         <Content /> 

//         {/* Kalender */}
//         <div className={`absolute bg-slate-50 top-0 right-0 p-3 mx-10 my-5 max-w-full  lg:w-[25rem] lg:h-[13rem] rounded-lg shadow-xl ${showCalendar ? 'block' : 'hidden lg:block'}`}>
//           <h2 className="text-xl mb-2">Kalender</h2>
//           <div className="grid grid-cols-10 gap-3 text-center text-lg text-gray-800 ">
//             {renderDays()}
//           </div>
//         </div>

//         {/* Modal Kalender di perangkat kecil */}
//         {showCalendar && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
//             <div className="bg-white p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md w-full">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl">Kalender</h2>
//                 <button
//                   onClick={handleToggleCalendar}
//                   className="bg-red-500 text-white px-2 py-2 rounded"
//                 >
//                   Close
//                 </button>
//               </div>
//               <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold">
//                 {renderDays()}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal Aktivitas */}
//         {/* BISI POHO DAN LUPA INI BAGIAN ANU KETIKA POP UP PAS MENCET TANGGAL TANGGAL NU MANA?
//         YA TANGGAL ANU UDAH DI BIKIN KU KITA CUY  */}
//         {selectedDate && activities[selectedDate] && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
//             <div className="bg-white p-6 rounded-lg max-w-sm w-full ">
//               <h2 className="text-xl mb-4">Schedule {selectedDate}</h2>
//               <p>{activities[selectedDate]}</p>
//               <button
//                 onClick={() => setSelectedDate(null)}
//                 className="mt-4 bg-green-800   text-white px-4 py-2 rounded"
//               >
//            Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Konten lainnya */}
//         <div className="p-4">
//           {/* Tempat konten dashboard lainnya */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Manajemen;
"use client";
import Calendar from '../components/calender/page';
import Content from '../components/content/page';
import Sidebar from '../components/sidebar/page';
const Management = () => {
    return (
        <>
        <Sidebar/>
        <Calendar/>
        <Content/>
        </>
    )
}

export default Management;