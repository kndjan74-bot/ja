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
    buildOptions: {
      keystorePath: 'Soodcity.keystore',
      keystorePassword: '890326911',
      keystoreAlias: 'soodcity',
      keystoreAliasPassword: '890326911'
    }
  },
  plugins: {
    // ✅ استفاده از پلاگین‌های Capacitor جدید
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    
    // 🔥 جایگزین @ionic-native/geolocation
    Geolocation: {
      enableHighAccuracy: true
    },
    
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "soodcity_notification.mp3",
    },
    
    // پلاگین‌های دانلود فایل
    Filesystem: {
      androidPermissions: [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    
    Browser: {},
    Share: {}
  }
};

export default config;