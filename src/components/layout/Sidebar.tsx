"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Car, Users, MessageSquare, Settings, X, BookImageIcon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon: Icon, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 group",
        isActive
          ? "bg-orange-500 text-white" 
          : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={clsx(
          "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150",
          isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
      )} />
      <span className="flex-grow">{label}</span>
    </Link>
  );
};

interface SidebarProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

const mainNavLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/trending", label: "Trending", icon: TrendingUp },
  { href: "/dashboard/cars", label: "Cars", icon: Car },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/bookings", label: "Bookings", icon: BookImageIcon},
];

const preferenceLinks = [
  { href: "/account", label: "Settings", icon: Settings },
];

const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: "tween", duration: 0.3, ease: "easeOut" } },
    exit: { x: '-100%', transition: { type: "tween", duration: 0.2, ease: "easeIn" } }
};

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {

  const SidebarContent = () => (
     <div className="flex flex-col h-full bg-[#111111] overflow-y-auto border-r border-gray-700/50">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-4 border-b border-gray-700/50 md:justify-start">
            <div className="flex items-center">
                <Logo />
            </div>
            <button
                onClick={onClose}
                className="md:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 rounded"
                aria-label="Close sidebar"
                type="button"
            >
                <X className="h-6 w-6 -ml-2" />
            </button>
        </div>

        <nav className="mt-5 flex-1 px-2 space-y-1 pb-4">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
          {mainNavLinks.map((link) => (
            <NavLink key={link.href} {...link} onClick={onClose} />
          ))}
          <div className="pt-6">
             <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preference</p>
            {preferenceLinks.map((link) => (
                <NavLink key={link.href} {...link} onClick={onClose} />
            ))}
          </div>
        </nav>
        <Footer/>
      </div>
  );

  return (
    <>
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 z-30">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-sidebar-motion"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 w-64 z-40 md:hidden"
            aria-modal="true"
            role="dialog"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;