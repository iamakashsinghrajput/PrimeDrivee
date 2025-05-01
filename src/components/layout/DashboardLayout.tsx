"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prevState => !prevState);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    closeMobileSidebar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="relative min-h-screen flex bg-[#181818]">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out md:ml-64">
        <Header onToggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;