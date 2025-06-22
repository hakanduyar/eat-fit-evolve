
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FloatingElement } from './FloatingElement';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Floating Elements */}
      <FloatingElement 
        icon={Zap} 
        className="absolute top-20 left-4 sm:left-8 text-yellow-500" 
        delay={0}
      />
      <FloatingElement 
        icon={TrendingUp} 
        className="absolute top-32 right-4 sm:right-8 text-green-500" 
        delay={1}
      />
      <FloatingElement 
        icon={FileText} 
        className="absolute bottom-20 left-8 sm:left-16 text-blue-500" 
        delay={2}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Yeni ve Geliştirilmiş Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Beslenme ve Fitness
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Takibiniz için
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            NutriTrack ile beslenme alışkanlıklarınızı takip edin, fitness hedeflerinize ulaşın ve 
            profesyonel danışmanlarınızla kolayca iletişim kurun.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              Ücretsiz Başla
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 text-lg font-medium hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-105"
            >
              Demo İzle
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Profesyonel Danışman</div>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">99%</div>
              <div className="text-sm text-gray-600">Memnuniyet Oranı</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
