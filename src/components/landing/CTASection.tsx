
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  'Ücretsiz hesap oluşturma',
  'Sınırsız kilo takibi',
  'Haftalık plan oluşturma',
  'Detaylı analiz raporları',
  'Mobil uygulama desteği'
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Kilo Verme Yolculuğunuzu
            <br />
            <span className="text-yellow-400">Bugün Başlatın!</span>
          </h2>
          
          <p className="text-xl sm:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Binlerce kişi hedeflerine ulaştı. Sıra sizde! Ücretsiz hesabınızı oluşturun 
            ve farkı hissedin.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit} 
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-left">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl group rounded-full border-0 shadow-xl"
            >
              Şimdi Ücretsiz Başlayın
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-10 py-4 text-xl font-bold border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 rounded-full bg-transparent"
            >
              Zaten Hesabım Var
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Kredi kartı gerektirmez</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Anında kurulum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>7/24 destek</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
