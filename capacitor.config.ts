
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.9b67ff3a231840918474d9105799eea1',
  appName: 'NutriTrack',
  webDir: 'dist',
  server: {
    url: 'https://9b67ff3a-2318-4091-8474-d9105799eea1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16a34a',
      showSpinner: false
    },
    Widget: {
      android: {
        src: 'app.lovable.nutritrack.WidgetPlugin'
      }
    }
  }
};

export default config;
