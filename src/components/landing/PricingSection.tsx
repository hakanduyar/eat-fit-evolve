
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Başlangıç',
    price: 'Ücretsiz',
    period: 'süresiz',
    description: 'Temel beslenme takibi için',
    features: [
      'Günlük kalori takibi',
      'Temel beslenme analizi',
      'Su tüketimi takibi',
      'Mobil uygulama erişimi',
      'Email desteği'
    ],
    popular: false,
    buttonText: 'Ücretsiz Başla',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Premium',
    price: '99₺',
    period: 'aylık',
    description: 'Profesyonel takip ve danışmanlık',
    features: [
      'Tüm Başlangıç özellikleri',
      'Detaylı beslenme raporları',
      'Profesyonel danışman erişimi',
      'Kişisel hedef belirleme',
      'Gelişmiş analiz araçları',
      'Randevu sistemi',
      'Öncelikli destek'
    ],
    popular: true,
    buttonText: 'Premium\'a Geç',
    buttonVariant: 'default' as const
  },
  {
    name: 'Profesyonel',
    price: '199₺',
    period: 'aylık',
    description: 'Antrenör ve diyetisyenler için',
    features: [
      'Tüm Premium özellikleri',
      'Sınırsız müşteri yönetimi',
      'Toplu raporlama',
      'Özel markalama',
      'API erişimi',
      'Gelişmiş istatistikler',
      '7/24 öncelikli destek'
    ],
    popular: false,
    buttonText: 'Profesyonel Ol',
    buttonVariant: 'outline' as const
  }
];

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Size Uygun
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Planı Seçin</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İhtiyaçlarınıza göre tasarlanmış planlarla sağlıklı yaşam yolculuğunuza başlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl border-2 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-green-500 shadow-2xl ring-4 ring-green-100' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    En Popüler
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Ücretsiz' && (
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.buttonVariant}
                size="lg"
                onClick={() => navigate('/auth')}
                className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                    : 'hover:bg-green-50 hover:border-green-300'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Tüm planlar 30 gün ücretsiz deneme ile başlar • İstediğiniz zaman iptal edebilirsiniz
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span>✓ SSL Güvenlik</span>
            <span>✓ 7/24 Destek</span>
            <span>✓ Mobil Uygulama</span>
            <span>✓ Veri Güvenliği</span>
          </div>
        </div>
      </div>
    </section>
  );
}
