
export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold">NutriTrack</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Beslenme ve fitness takibiniz için kapsamlı platform. 
              Sağlıklı yaşam yolculuğunuzda yanınızdayız.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Özellikler</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Yorumlar</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Çerez Politikası</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} NutriTrack. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
