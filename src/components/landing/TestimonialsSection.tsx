
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ayşe Kaya',
    role: 'Fitness Antrenörü',
    content: 'NutriTrack sayesinde müşterilerimin beslenme alışkanlıklarını çok daha iyi takip edebiliyorum. Platform gerçekten kullanışlı ve etkili!',
    rating: 5,
    avatar: '👩‍⚕️'
  },
  {
    name: 'Mehmet Özkan',
    role: 'Yazılım Geliştirici',
    content: 'Yoğun iş temposu içinde beslenme takibimi yapmak çok zordu. NutriTrack ile her şey çok kolay oldu, artık hedeflerime daha yakınım.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: 'Elif Demir',
    role: 'Diyetisyen',
    content: 'Hastalarımla iletişim kurmak ve onların ilerlemelerini takip etmek hiç bu kadar kolay olmamıştı. Mükemmel bir platform!',
    rating: 5,
    avatar: '👩‍⚕️'
  },
  {
    name: 'Can Yılmaz',
    role: 'Spor Eğitmeni',
    content: 'Müşterilerimin motivasyonunu yüksek tutmak için harika bir araç. Detaylı raporlar ve takip sistemi mükemmel.',
    rating: 5,
    avatar: '🏃‍♂️'
  },
  {
    name: 'Zehra Aktaş',
    role: 'Beslenme Uzmanı',
    content: 'Detaylı raporlar ve analiz özellikleri sayesinde danışanlarıma çok daha etkili yardım edebiliyorum. Kesinlikle tavsiye ederim!',
    rating: 5,
    avatar: '👩‍🔬'
  },
  {
    name: 'Burak Çelik',
    role: 'Kişisel Antrenör',
    content: 'Randevu sistemi ve mesajlaşma özelliği iş hayatımı kolaylaştırdı. Müşteri memnuniyeti arttı, ben de çok memnunum.',
    rating: 5,
    avatar: '💪'
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Kullanıcılarımız
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Ne Diyor</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Binlerce memnun kullanıcımızın deneyimlerini okuyun ve siz de aramıza katılın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💬</span>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-gray-700 mb-8 leading-relaxed text-lg font-medium">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-2xl shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                  <div className="text-gray-600 font-medium">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
