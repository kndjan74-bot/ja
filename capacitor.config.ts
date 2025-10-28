import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.Soodcity.myapp',
  appName: 'Soodcity',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://soodcity.ir',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    // ✅ اضافه کردن تنظیمات build برای اندروید
    buildOptions: {
      keystorePath: 'Soodcity.keystore',
      keystorePassword: '890326911',
      keystoreAlias: 'my-key-alias',
      keystoreAliasPassword: '890326911'
    }
  },
  plugins: {
    // ✅ اضافه کردن پلاگین Push Notifications
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    // ✅ اضافه کردن پلاگین Local Notifications برای فالبک
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    }
  }
};

export default config;