import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Gem, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/sims', label: 'Sims' },
  { to: '/worlds', label: 'Worlds' },
  { to: '/families', label: 'Families' },
  { to: '/relations', label: 'Relations' },
  { to: '/statistics', label: 'Statistics' },
];

export default function Navbar({ darkMode, toggleDark }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Gem className="w-7 h-7 text-primary transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-lg text-primary leading-tight">OCJ</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase leading-tight">Save File</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Dark mode toggle + mobile menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-full border border-border hover:border-primary/50 transition-all duration-200 text-muted-foreground hover:text-primary"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-sm font-medium border-b border-border/50 transition-colors ${
                location.pathname === link.to
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}