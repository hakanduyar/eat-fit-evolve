
import { Activity, Users, BarChart3, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Beslenme Takibi',
    description: 'Günlük kalori, protein, karbonhidrat ve yağ alımınızı kolayca takip edin.'
  },
  {
    icon: BarChart3,
    title: 'Detaylı Analiz',
    description: 'Beslenme trendlerinizi görsel grafiklerle analiz edin ve ilerlemeinizi takip edin.'
  },
  {
    icon: Users,
    title: 'Profesyonel Destek',
    description: 'Diyetisyen ve antrenörlerle doğrudan iletişim kurun, kişisel planlar alın.'
  },
  {
    icon: Heart,
    title: 'Sağlık Takibi',
    description: 'Su tüketimi, egzersiz ve genel sağlığınızı kapsamlı şekilde takip edin.'
  },
  {
    icon: Clock,
    title: 'Randevu Sistemi',
    description: 'Uzmanlarınızla kolayca randevu alın ve takibinizi sürdürün.'
  },
  {
    icon: Shield,
    title: 'Güvenli & Özel',
    description: 'Verileriniz güvenli şekilde saklanır ve gizliliğiniz korunur.'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sağlıklı Yaşam İçin
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Her Şey</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            NutriTrack ile beslenme hedeflerinize ulaşmak için ihtiyacınız olan tüm araçlara sahip olun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
