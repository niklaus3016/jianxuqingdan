import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jianxuqingdan.app',
  appName: '简序清单',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;