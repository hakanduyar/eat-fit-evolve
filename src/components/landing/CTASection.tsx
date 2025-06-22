
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  'Ücretsiz 30 günlük deneme',
  'Sınırsız beslenme takibi',
  'Profesyonel destek',
  'Detaylı analiz raporları'
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sağlıklı Yaşamınıza Hemen Başlayın
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Binlerce kişi zaten NutriTrack ile hedeflerine ulaştı. Sıra sizde!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              Hemen Başla
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          <p className="text-sm opacity-75 mt-4">
            Kredi kartı gerektirmez • İstediğiniz zaman iptal edebilirsiniz
          </p>
        </div>
      </div>
    </section>
  );
}
