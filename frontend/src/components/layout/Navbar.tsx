import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Dices, LayoutDashboard, BarChart2, ChevronDown, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false), mobileMenuOpen);

  const navItems = [
    { id: 'main',      label: 'Main Menu',  icon: LayoutDashboard, path: '/admin' },
    { id: 'quiz',      label: 'Quiz',       icon: BookOpen,        path: '/admin/create-quiz' },
    { id: 'tambola',   label: 'Tambola',    icon: Dices,           path: '/admin/tambola' },
    { id: 'dashboard', label: 'Dashboard',  icon: BarChart2,       path: '/admin/dashboard' },
  ];

  const isActive = (path: string) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-outline bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4 md:gap-8">

        {/* Brand wordmark — no image */}
        <Link to="/admin" className="flex-shrink-0 hover:opacity-90 transition-opacity">
          <span className="text-base font-bold tracking-tight text-primary">
            TELUS <span className="text-secondary">Digital</span>
          </span>
        </Link>

        {/* Nav tabs — centered in header, hidden below md */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className="flex items-center gap-1.5 px-4 h-14 text-sm font-semibold transition-all relative focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(75,40,109,0.35)]"
                style={{
                  color: active ? 'var(--color-telus-purple)' : 'var(--color-grey-shuttle)',
                  borderBottom: active ? '2px solid var(--color-telus-purple)' : '2px solid transparent',
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Mobile hamburger — only below md */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-dim transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Profile */}
          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:bg-[#F7F7F8]"
              style={{ color: '#2A2C2E' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#4B286D' }}
              >
                AD
              </div>
              <span className="hidden sm:block">Admin</span>
              <ChevronDown
                size={14}
                style={{
                  color: '#71757B',
                  transform: profileOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 200ms',
                }}
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-48 rounded-lg overflow-hidden z-50"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8D8D8',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }}
              >
                <div className="px-4 py-3 border-b border-[#D8D8D8]">
                  <p className="text-sm font-bold text-[#2A2C2E]">Admin User</p>
                  <p className="text-xs text-[#71757B]">admin@telus.com</p>
                </div>
                <button role="menuitem" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#54595F] hover:bg-[#F7F7F8] transition-colors">
                  <User size={14} /> Profile
                </button>
                <button role="menuitem" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#54595F] hover:bg-[#F7F7F8] transition-colors">
                  <Settings size={14} /> Settings
                </button>
                <div className="border-t border-[#D8D8D8]" />
                <button
                  role="menuitem"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#FFF6F8] transition-colors"
                  style={{ color: '#C12335' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile nav sheet — only below md */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden border-t border-outline-variant bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold text-left transition-colors"
                style={{
                  color: active ? 'var(--color-telus-purple)' : 'var(--color-grey-shuttle)',
                  backgroundColor: active ? 'var(--color-purple-100)' : 'transparent',
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
