
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ayşe Kaya',
    role: 'Fitness Antrenörü',
    content: 'NutriTrack sayesinde müşterilerimin beslenme alışkanlıklarını çok daha iyi takip edebiliyorum. Platform gerçekten kullanışlı!',
    rating: 5,
    avatar: '👩‍⚕️'
  },
  {
    name: 'Mehmet Özkan',
    role: 'Yazılım Geliştirici',
    content: 'Yoğun iş temposu içinde beslenme takibimi yapmak çok zordu. NutriTrack ile her şey çok kolay oldu.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: 'Elif Demir',
    role: 'Diyetisyen',
    content: 'Hastalarımla iletişim kurmak ve onların ilerlemelerini takip etmek hiç bu kadar kolay olmamıştı.',
    rating: 5,
    avatar: '👩‍⚕️'
  },
  {
    name: 'Can Yılmaz',
    role: 'Spor Eğitmeni',
    content: 'Müşterilerimin motivasyonunu yüksek tutmak için harika bir araç. Kesinlikle tavsiye ederim!',
    rating: 5,
    avatar: '🏃‍♂️'
  },
  {
    name: 'Zehra Aktaş',
    role: 'Beslenme Uzmanı',
    content: 'Detaylı raporlar ve analiz özellikleri sayesinde danışanlarıma çok daha etkili yardım edebiliyorum.',
    rating: 5,
    avatar: '👩‍🔬'
  },
  {
    name: 'Burak Çelik',
    role: 'Kişisel Antrenör',
    content: 'Randevu sistemi ve mesajlaşma özelliği iş hayatımı kolaylaştırdı. Harika bir platform!',
    rating: 5,
    avatar: '💪'
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Kullanıcılarımız
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Ne Diyor</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Binlerce memnun kullanıcımızın deneyimlerini okuyun ve siz de aramıza katılın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-rotate-1 hover:scale-105"
              style={{
                transform: `rotate(${Math.random() * 4 - 2}deg)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
