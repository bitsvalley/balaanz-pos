import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.MaduroPOS',
  appName: 'MADURO POS',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SunmiPrinter: {
      bindOnLoad: true,
    },
  },
};

export default config;
