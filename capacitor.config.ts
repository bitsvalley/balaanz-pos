import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.Balaanpos13',
  appName: 'Balaanz POS13',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SunmiPrinter: {
      bindOnLoad: true
    }
  }
};

export default config;
