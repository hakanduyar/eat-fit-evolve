
import { Activity, Users, BarChart3, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Beslenme Takibi',
    description: 'Günlük kalori, protein, karbonhidrat ve yağ alımınızı kolayca takip edin. Akıllı önerilerle beslenme alışkanlıklar gelişir.'
  },
  {
    icon: BarChart3,
    title: 'Detaylı Analiz',
    description: 'Beslenme trendlerinizi görsel grafiklerle analiz edin ve ilerlemeinizi takip edin. Veri odaklı kararlar alın.'
  },
  {
    icon: Users,
    title: 'Profesyonel Destek',
    description: 'Diyetisyen ve antrenörlerle doğrudan iletişim kurun, kişisel planlar alın. Uzman desteği her zaman yanınızda.'
  },
  {
    icon: Heart,
    title: 'Sağlık Takibi',
    description: 'Su tüketimi, egzersiz ve genel sağlığınızı kapsamlı şekilde takip edin. Bütüncül sağlık yaklaşımı.'
  },
  {
    icon: Clock,
    title: 'Randevu Sistemi',
    description: 'Uzmanlarınızla kolayca randevu alın ve takibinizi sürdürün. Zamanlama artık çok kolay.'
  },
  {
    icon: Shield,
    title: 'Güvenli & Özel',
    description: 'Verileriniz güvenli şekilde saklanır ve gizliliğiniz korunur. En yüksek güvenlik standartları.'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Sağlıklı Yaşam İçin
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Her Şey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            NutriTrack ile beslenme hedeflerinize ulaşmak için ihtiyacınız olan tüm araçlara sahip olun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
