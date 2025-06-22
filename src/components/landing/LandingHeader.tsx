
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">NutriTrack</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Özellikler
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Yorumlar
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Fiyatlar
            </a>
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium"
            >
              Giriş Yap
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Başla
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 animate-fade-in bg-white/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-6">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium text-lg">
                Özellikler
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium text-lg">
                Yorumlar
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium text-lg">
                Fiyatlar
              </a>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="w-full hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium py-3"
              >
                Giriş Yap
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium py-3"
              >
                Başla
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
