"use client";

import { useState, useEffect } from 'react';
import { ChartBarIcon, UserIcon, DocumentTextIcon, ChevronRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';

type Sale = {
  id: number;
  name: string;
};

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuOpenHome, setSubmenuOpenHome] = useState(false);
  const [submenuOpenProfile, setSubmenuOpenProfile] = useState(false);
  const [submenuOpenMessages, setSubmenuOpenMessages] = useState(false);
  const [submenuOpenManagement, setSubmenuOpenManagement] = useState(false);
  const [submenuOpenHistory, setSubmenuOpenHistory] = useState(false); // State for the History submenu
  const [salesData, setSalesData] = useState<Sale[]>([]); // Define the sales data state

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil role dari sessionStorage saat komponen di-mount
    const userRole = sessionStorage.getItem('role');
    setRole(userRole);
  }, []);

  return (
    <>
      {/* Button to Open Sidebar */}
      <button
        className="absolute top-0 left-0 m-4 text-gray-600 hover:text-gray-800 transition"
        onClick={openSidebar}
      >
        <span className="block w-6 h-1 bg-gray-600 mb-1 rounded-full"></span>
        <span className="block w-6 h-1 bg-gray-600 mb-1 rounded-full"></span>
        <span className="block w-6 h-1 bg-gray-600 rounded-full"></span>
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg rounded-lg text-gray-700 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="font-bold text-2xl">
            {role === 'admin'
              ? 'Admin Dashboard'
              : role === 'management'
              ? 'Management Dashboard'
              : role === 'sales'
              ? 'Sales Dashboard'
              : 'User Dashboard'}
          </h1>

          <button onClick={closeSidebar} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Menu Sidebar */}
        <ul className="mt-4">
          {role !== 'sales' && (
            <li>
              <div
                className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-all"
                onClick={() => setSubmenuOpenHome(prev => !prev)}
              >
                <ChartBarIcon className="w-6 h-6 text-gray-600 mr-3" />
                <span className="font-medium">Sales</span>
                <ChevronRightIcon className={`ml-auto w-4 h-4 transition-transform ${submenuOpenHome ? 'rotate-90' : ''}`} />
              </div>
              {submenuOpenHome && (
                <ul className="pl-6 transition-all duration-300 ease-in-out">
                  <li>
                    <a href="/sales" className="block py-2 rounded-lg hover:bg-gray-200">Activity</a>
                  </li>
                </ul>
              )}
            </li>
          )}

          {role !== 'admin' && (
            <li>
              <div
                className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-all"
                onClick={() => setSubmenuOpenProfile(prev => !prev)}
              >
                <UserIcon className="w-6 h-6 text-gray-600 mr-3" />
                <span className="font-medium">Admin</span>
                <ChevronRightIcon className={`ml-auto w-4 h-4 transition-transform ${submenuOpenProfile ? 'rotate-90' : ''}`} />
              </div>
              {submenuOpenProfile && (
                <ul className="pl-6 transition-all duration-300 ease-in-out">
                  <li>
                    <a href="#" className="block py-2 rounded-lg hover:bg-gray-200">Account</a>
                  </li>
                </ul>
              )}
            </li>
          )}

          {role !== 'management' && (
            <li>
              <div
                className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-all"
                onClick={() => setSubmenuOpenManagement(prev => !prev)}
              >
                <UserGroupIcon className="w-6 h-6 text-gray-600 mr-3" />
                <span className="font-medium">Management</span>
                <ChevronRightIcon className={`ml-auto w-4 h-4 transition-transform ${submenuOpenManagement ? 'rotate-90' : ''}`} />
              </div>
              {submenuOpenManagement && (
                <ul className="pl-6 transition-all duration-300 ease-in-out">
                  <li><a href="#" className="block py-2 rounded-lg hover:bg-gray-200">Sub Menu 1</a></li>
                  <li><a href="#" className="block py-2 rounded-lg hover:bg-gray-200">Sub Menu 2</a></li>
                </ul>
              )}
            </li>
          )}

          <li>
            <div
              className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => setSubmenuOpenHistory(prev => !prev)}
            >
              <DocumentTextIcon className="w-6 h-6 text-gray-600 mr-3" />
              <span className="font-medium">History</span>
              <ChevronRightIcon className={`ml-auto w-4 h-4 transition-transform ${submenuOpenHistory ? 'rotate-90' : ''}`} />
            </div>
            {submenuOpenHistory && (
              <ul className="pl-6 transition-all duration-300 ease-in-out">
                <li>
                  <a href="#" className="block py-2 rounded-lg hover:bg-gray-200">Create</a>
                </li>
                <li>
                  <a href="#" className="block py-2 rounded-lg hover:bg-gray-200">Edit</a>
                </li>
                <li>
                  <a href="#" className="block py-2 rounded-lg hover:bg-gray-200">Delete</a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
