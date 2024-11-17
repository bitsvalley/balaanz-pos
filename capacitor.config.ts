import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.fombutupos',
  appName: 'Fombutu POS',
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
