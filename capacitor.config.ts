import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.unicsagent',
  appName: 'UNICS PLC Agent',
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
