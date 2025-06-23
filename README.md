# 🍎 EatFitEvolve - AI-Powered Nutrition & Fitness Companion

<div align="center">
  <img src="./assets/logo.png" alt="EatFitEvolve Logo" width="200"/>
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://eat-fit-evolve.lovable.app/landing)
  [![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](link-to-apk)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
</div>

---

## 📱 Overview

EatFitEvolve is a comprehensive nutrition and fitness tracking application that combines modern web technologies with AI-powered insights to help users achieve their health goals. Built with React and TypeScript, the app features a responsive design that seamlessly transitions from web to mobile using Capacitor.

### 🌟 Key Features

- **AI-Powered Meal Planning**: Intelligent meal suggestions based on dietary preferences
- **Comprehensive Nutrition Tracking**: Detailed calorie and macro tracking
- **Fitness Integration**: Workout planning and progress monitoring  
- **Cross-Platform**: Available as web app and native mobile application
- **Real-time Sync**: Cloud-based data synchronization with Supabase
- **Modern UI/UX**: Responsive design with Tailwind CSS

## 🚀 Live Demo

- **Web Application**: [eat-fit-evolve.lovable.app](https://eat-fit-evolve.lovable.app/landing)
- **Mobile APK**: [Download here](link-to-apk-download)

## 📸 Screenshots

<div align="center">
  <img src="./screenshots/web-dashboard.png" alt="Web Dashboard" width="45%"/>
  <img src="./screenshots/mobile-app.png" alt="Mobile App" width="45%"/>
</div>

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Fast build tool and development server

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Real-time subscriptions** - Live data synchronization

### Mobile Development
- **Capacitor** - Native mobile app development with web technologies
- **iOS/Android** - Cross-platform mobile deployment

### Development & Deployment
- **Lovable** - AI-assisted development platform
- **Git** - Version control
- **GitHub Actions** - CI/CD pipeline (if implemented)


## 🏗️ Architecture

### High-Level Architecture

**Web Application** ↔ **Capacitor Bridge** ↔ **Mobile Apps** ↔ **Supabase Backend**

### Technology Stack

| Layer | Technologies | Purpose |
|-------|-------------|---------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite | User interface and experience |
| **Cross-Platform** | Capacitor | Web-to-native bridge |
| **Mobile** | iOS, Android | Native mobile applications |
| **Backend** | Supabase, PostgreSQL | Database, auth, real-time sync |

### Data Flow
1. User interacts with React web interface
2. Capacitor translates web APIs to native mobile APIs
3. Application communicates with Supabase backend
4. Real-time updates sync across all devices
5. Data persists in PostgreSQL database

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hakanduyar/eat-fit-evolve.git
   cd eat-fit-evolve

Install dependencies
bashnpm install

Set up environment variables
bashcp .env.example .env.local
# Edit .env.local with your Supabase credentials

Start development server
bashnpm run dev

Open browser
http://localhost:5173


Mobile Development

Build for mobile
bashnpm run build
npx cap add ios
npx cap add android

Sync with Capacitor
bashnpx cap sync

Open in native IDE
bashnpx cap open ios     # For iOS
npx cap open android # For Android


## 📁 Project Structure

```bash
eat-fit-evolve/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── services/           # API services
│   └── styles/             # Global styles
├── ios/                    # iOS Capacitor project
├── android/                # Android Capacitor project
├── capacitor.config.ts     # Capacitor configuration
├── package.json
└── README.md


## 🔧 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking

🌐 Deployment
Web Deployment
The application is automatically deployed to Lovable's hosting platform.

🔹 Mobile Deployment

# Build the web project
npm run build

# Sync with Capacitor
npx cap sync

# Open in native IDE (Android Studio / Xcode)
npx cap open android
npx cap open ios


🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

# Fork the project
git clone https://github.com/hakanduyar/eat-fit-evolve

# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m "Add some AmazingFeature"

# Push to GitHub
git push origin feature/AmazingFeature

# Open a Pull Request


📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Developer
Hakan Duyar

GitHub: @hakanduyar

LinkedIn: linkedin.com/in/hakanduyar

Portfolio:

🙏 Acknowledgments

⚙️ Built with Lovable – AI-powered development platform

🔥 Powered by Supabase – The open source Firebase alternative

💎 Styled with Tailwind CSS

📱 Mobile deployment via Capacitor


<div align="center">
  Made with ❤️ by Hakan Duyar
</div>
```
