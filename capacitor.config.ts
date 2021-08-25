import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.gpn.driver',
  appName: 'driver',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 500,
      androidScaleType: 'CENTER_CROP'
    }
  },
  cordova: {}
};

export default config;
