"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Search, User, LogOut, Settings as SettingsIcon, ChevronDown, Bell, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface HeaderProps {
    onToggleMobileSidebar: () => void;
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15, ease: "easeIn" } }
};

const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const userName = session?.user?.name ?? "Guest";

  const closeUserMenu = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node) && userMenuTriggerRef.current && !userMenuTriggerRef.current.contains(event.target as Node)) {
        closeUserMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, closeUserMenu]);

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Search Submitted:", searchTerm);
      setSearchTerm('');
  }

  const handleHamburgerClick = () => {
    if (typeof onToggleMobileSidebar === 'function') {
      onToggleMobileSidebar();
    } else {
      console.error("Header: onToggleMobileSidebar prop is not a function!", typeof onToggleMobileSidebar);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#181818] border-b border-gray-700/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
           <div className="flex items-center flex-1 min-w-0">
              <button
                onClick={handleHamburgerClick}
                className="md:hidden mr-3 flex-shrink-0 text-gray-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                aria-label="Open sidebar"
                type="button"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 truncate">
                Good to see you, {userName}!
              </h1>
           </div>
           <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3 md:space-x-5 ml-4">
                 <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                    <label htmlFor="dashboard-search" className="sr-only">Search anything</label>
                    <input
                        id="dashboard-search" type="text" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..."
                        className="bg-gray-700/50 text-gray-300 placeholder-gray-500 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 w-32 sm:w-40 md:w-48 lg:w-64 transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                 </form>
                 <button
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-100 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] focus:ring-orange-500"
                    aria-label="View notifications"
                 >
                    <Bell className="h-5 w-5" />
                 </button>
                 <div className="relative">
                    <motion.button
                        ref={userMenuTriggerRef} whileTap={{ scale: 0.95 }}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] focus:ring-orange-500"
                        aria-label="User menu" aria-haspopup="true" aria-expanded={isUserMenuOpen}
                    >
                        <span className="sr-only">Open user menu</span>
                        {session?.user?.image ? (
                        <Image src={session.user.image} alt="Profile" className="rounded-full w-8 h-8 md:w-9 md:h-9 border-2 border-gray-600 hover:border-orange-500 transition-colors duration-200" width={36} height={36} />
                        ) : (
                        <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-orange-500 text-white font-semibold text-sm border-2 border-gray-600 group-hover:border-orange-500 transition-colors duration-200">
                            {getInitials(session?.user?.name)}
                        </div>
                        )}
                        {session && ( <> <span className="hidden lg:inline-block ml-2 text-sm font-medium text-gray-300">{userName}</span> <ChevronDown className="hidden lg:inline-block ml-1 h-4 w-4 text-gray-400"/> </> )}
                        {!session && ( <> <span className="hidden lg:inline-block ml-2 text-sm font-medium text-gray-400">Guest</span> <ChevronDown className="hidden lg:inline-block ml-1 h-4 w-4 text-gray-400"/> </> )}
                    </motion.button>
                    <AnimatePresence>
                        {isUserMenuOpen && (
                        <motion.div
                            ref={userMenuRef} variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 mt-2 w-48 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 z-40"
                            role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                        >
                            <div className="py-1" role="none">
                            {session ? (
                                <>
                                <div className="px-4 py-2 border-b border-gray-700 mb-1">
                                    <p className="text-sm font-medium text-gray-200 truncate">{session.user?.name || 'User'}</p>
                                    {session.user?.email && <p className="text-xs text-gray-400 truncate">{session.user.email}</p>}
                                </div>
                                <Link href="/account" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-150" role="menuitem" onClick={closeUserMenu} > <SettingsIcon className="mr-2 h-4 w-4" /> Settings </Link>
                                <button onClick={() => { signOut({ callbackUrl: '/' }); closeUserMenu(); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-150" role="menuitem" > <LogOut className="mr-2 h-4 w-4" /> Logout </button>
                                </>
                            ) : (
                                <Link href="/api/auth/signin" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-150" role="menuitem" onClick={closeUserMenu} > <User className="mr-2 h-4 w-4" /> Login </Link>
                            )}
                            </div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;