"use client";

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FaBars, FaTimes, FaSearch, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeOut" } }
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15, ease: "easeIn" } }
};

const searchInputVariants = {
  hidden: { opacity: 0, width: 0, marginRight: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  visible: { opacity: 1, width: '160px', marginRight: '8px', transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, width: 0, marginRight: 0, transition: { duration: 0.3, ease: "easeInOut" } }
};

const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1 || !names[1]) return names[0].charAt(0).toUpperCase(); // Handle single names or empty strings after split
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const NavbarSplitTheme = () => {
  const { data: session } = useSession();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const searchIconButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchVisible && searchRef.current && !searchRef.current.contains(event.target as Node) && searchIconButtonRef.current && !searchIconButtonRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false);
      }
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node) && userMenuTriggerRef.current && !userMenuTriggerRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isSearchVisible, isMobileMenuOpen, closeMobileMenu]);

   useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/trending", label: "Trending" },
    { href: "/cars", label: "Cars" },
    { href: "/teams", label: "Teams" },
    { href: "/reviews", label: "Reviews" },
  ];

  const NAVBAR_HEIGHT = 'h-16';
  const MOBILE_MENU_TOP = 'top-16';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 bg-gray-900 shadow-lg border-b border-gray-700/50 transition-colors duration-300 ${NAVBAR_HEIGHT}`}
      >
        <div className="container mx-auto flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">

          <div className="flex-shrink-0">
            <Link
              href="/dashboard"
              className="text-gray-100 font-Squadaone text-2xl lg:text-3xl uppercase tracking-wider hover:opacity-80 transition-opacity duration-200"
              onClick={() => {
                 closeMobileMenu();
                 closeAllDropdowns();
              }}
            >
              primedrive<span className='text-[var(--second-color)]'>.</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">

            <div className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-gray-300 font-poppins font-medium text-[15px]">
              {navLinks.map(link => (
                 <Link key={link.href} href={link.href} className="hover:text-[var(--second-color)] transition-colors duration-200 whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
              <div className="relative flex items-center">
                <AnimatePresence>
                   {isSearchVisible && (
                     <motion.div
                       ref={searchRef}
                       variants={searchInputVariants}
                       initial="hidden"
                       animate="visible"
                       exit="exit"
                       className="flex items-center"
                      >
                       <form onSubmit={(e) => { e.preventDefault(); console.log('Search:', searchTerm); setIsSearchVisible(false); setSearchTerm(''); }}>
                         <input
                           type="text"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="Search..."
                           className="border-b-2 border-gray-600 focus:border-[var(--second-color)] outline-none px-2 py-1 font-poppins text-sm text-gray-200 placeholder-gray-500 transition-colors duration-200 w-full"
                           autoFocus
                          />
                       </form>
                     </motion.div>
                   )}
                </AnimatePresence>
                <motion.button
                  ref={searchIconButtonRef}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setIsSearchVisible(!isSearchVisible); setIsUserMenuOpen(false); }}
                  className="text-gray-400 hover:text-[var(--second-color)] transition-colors duration-200 p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--second-color)]"
                  aria-label="Toggle search"
                >
                  <FaSearch size={18} />
                </motion.button>
              </div>

              <div className="relative">
                 <motion.button
                   ref={userMenuTriggerRef}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsSearchVisible(false); }}
                   className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--second-color)]"
                   aria-label="User menu"
                  >
                   {session && session.user ? (
                      session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          className="rounded-full w-9 h-9 border-2 border-gray-600 hover:border-[var(--second-color)] transition-colors duration-200"
                          width={36}
                          height={36}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--second-color)] text-gray-900 font-semibold text-sm border-2 border-gray-600 group-hover:border-[var(--second-color)] transition-colors duration-200">
                          {getInitials(session.user.name)}
                        </div>
                      )
                    ) : (
                      <FaUserCircle className="text-3xl text-gray-400 hover:text-[var(--second-color)] transition-colors duration-200" />
                    )}
                 </motion.button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      ref={userMenuRef}
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-3 w-52 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden origin-top-right"
                    >
                      {session && session.user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-700">
                             <p className="text-sm font-medium text-gray-200 truncate">{session.user.name || 'User Profile'}</p>
                             {session.user.email && <p className="text-xs text-gray-400 truncate">{session.user.email}</p>}
                          </div>
                          <Link href="/account" className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 font-poppins hover:bg-gray-700 hover:text-[var(--second-color)] transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>Account</Link>
                          <button onClick={() => { signOut({ callbackUrl: '/' }); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 font-poppins hover:bg-gray-700 hover:text-[var(--second-color)] transition-colors duration-150">Logout</button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 font-poppins hover:bg-gray-700 hover:text-[var(--second-color)] transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>Login</Link>
                          <Link href="/register" className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 font-poppins hover:bg-gray-700 hover:text-[var(--second-color)] transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>Register</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:hidden flex-shrink-0">
              <motion.button
                ref={mobileMenuButtonRef}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); closeAllDropdowns(); setIsSearchVisible(false); }}
                className="text-gray-300 hover:text-[var(--second-color)] transition-colors text-2xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--second-color)]"
                aria-label="Toggle mobile menu"
               >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMobileMenuOpen ? 'times' : 'bars'}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'block' }}
                  >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>

          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed ${MOBILE_MENU_TOP} left-0 right-0 lg:hidden bg-gray-900 shadow-lg border-t border-gray-700/50 p-4 z-40 origin-top`}
          >
            <div className="flex flex-col items-center space-y-3">
              {navLinks.map(link => (
                 <Link
                    key={link.href}
                    href={link.href}
                    className="block w-full text-center py-2.5 text-gray-200 font-poppins rounded-md hover:text-[var(--second-color)] hover:bg-gray-800 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                  {link.label}
                </Link>
              ))}

               <hr className="w-full border-gray-700 my-2" />

               <div className="flex flex-col items-center w-full space-y-3">
                 {session && session.user ? (
                    <>
                       <Link href="/account" className="block w-full text-center py-2.5 text-gray-200 font-poppins rounded-md hover:text-[var(--second-color)] hover:bg-gray-800 transition-all duration-200" onClick={closeMobileMenu}>Account</Link>
                       <button onClick={() => { signOut({ callbackUrl: '/' }); closeMobileMenu(); }} className="block w-full text-center py-2.5 text-gray-200 font-poppins rounded-md hover:text-[var(--second-color)] hover:bg-gray-800 transition-all duration-200">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block w-full text-center py-2.5 text-gray-200 font-poppins rounded-md hover:text-[var(--second-color)] hover:bg-gray-800 transition-all duration-200" onClick={closeMobileMenu}>Login</Link>
                      <Link href="/register" className="block w-full text-center py-2.5 text-gray-200 font-poppins rounded-md hover:text-[var(--second-color)] hover:bg-gray-800 transition-all duration-200" onClick={closeMobileMenu}>Register</Link>
                    </>
                  )}
               </div>

              <div className="relative flex w-full pt-3">
                <form onSubmit={(e) => { e.preventDefault(); console.log('Mobile Search Panel:', searchTerm); setSearchTerm(''); closeMobileMenu(); }} className="w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-gray-800 rounded-lg pl-4 pr-10 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)]"
                   />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--second-color)]" aria-label="Submit search">
                    <FaSearch />
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body {
          padding-top: ${NAVBAR_HEIGHT === 'h-16' ? '4rem' : '5rem'};
        }
      `}</style>
    </>
  );
};

export default NavbarSplitTheme;