import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jianxu.todo',
  appName: '简序清单',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;