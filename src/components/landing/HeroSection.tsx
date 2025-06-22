
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FloatingElement } from './FloatingElement';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Floating Elements with Blueprint-style positioning */}
      <FloatingElement 
        icon={Zap} 
        className="absolute top-24 left-8 sm:top-32 sm:left-16 text-yellow-500" 
        delay={0}
      />
      <FloatingElement 
        icon={TrendingUp} 
        className="absolute top-40 right-8 sm:top-48 sm:right-20 text-green-500" 
        delay={1}
      />
      <FloatingElement 
        icon={FileText} 
        className="absolute bottom-32 left-12 sm:bottom-40 sm:left-24 text-blue-500" 
        delay={2}
      />
      <FloatingElement 
        icon={FileText} 
        className="absolute bottom-20 right-16 sm:bottom-28 sm:right-32 text-purple-500" 
        delay={1.5}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-sm font-medium mb-8 animate-fade-in border border-green-200/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            🎯 Sağlıklı Yaşamınızı Dönüştürün
          </div>

          {/* Main Heading - Blueprint style */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 animate-fade-in leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              NutriTrack
            </span>
            <br />
            <span className="text-gray-700 text-4xl sm:text-5xl lg:text-6xl">
              ile Hedeflerinize Ulaşın
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto animate-fade-in leading-relaxed font-light">
            Beslenme takibinden fitness hedeflerine, profesyonel danışmanlıktan 
            kişisel motivasyona kadar her şey bir arada. 
            <span className="font-medium text-green-600"> Sağlıklı yaşamınız artık daha kolay.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-4 text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl group rounded-full border-0"
            >
              Ücretsiz Başla
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-10 py-4 text-xl font-semibold hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-105 rounded-full border-2"
            >
              Demo İzle
            </Button>
          </div>

          {/* Stats - Blueprint style */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Başarı Oranı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">10x</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Daha Hızlı Sonuç</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">1</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Hedef, Net Sonuç</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">AI Destekli Takip</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
