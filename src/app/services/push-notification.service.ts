import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private platform: Platform) {}

  /**
   * مقداردهی اولیه نوتیفیکیشن‌ها
   */
  async initPushNotifications() {
    // فقط در محیط Capacitor اجرا شود
    if (!this.platform.is('capacitor')) {
      console.log('Push notifications only work in Capacitor environment');
      return;
    }

    try {
      console.log('Initializing push notifications...');
      
      // درخواست مجوز
      let permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive === 'granted') {
        console.log('Push notification permission granted');
        
        // ثبت برای دریافت نوتیفیکیشن
        await PushNotifications.register();
        this.addListeners();
      } else {
        console.warn('User denied push notification permission');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  /**
   * اضافه کردن listenerهای نوتیفیکیشن
   */
  private addListeners() {
    // وقتی توکن ثبت شد
    PushNotifications.addListener('registration', 
      (token: Token) => {
        console.log('Push registration success, token:', token.value);
        this.sendTokenToServer(token.value);
      }
    );

    // وقتی ثبت نام با خطا مواجه شد
    PushNotifications.addListener('registrationError', 
      (error: any) => {
        console.error('Push registration error:', error);
      }
    );

    // وقتی نوتیفیکیشن دریافت شد (اپ در foreground)
    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotificationSchema) => {
        console.log('Push received in foreground:', notification);
        this.showLocalNotification(notification);
      }
    );

    // وقتی کاربر روی نوتیفیکیشن کلیک کرد (اپ در background)
    PushNotifications.addListener('pushNotificationActionPerformed', 
      (action: ActionPerformed) => {
        console.log('Push action performed:', action);
        this.handleNotificationAction(action);
      }
    );
  }

  /**
   * ارسال توکن به سرور
   */
  private async sendTokenToServer(token: string) {
    try {
      // دریافت توکن احراز هویت کاربر
      const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!userToken) {
        console.warn('User token not found, skipping token registration');
        return;
      }

      // ارسال توکن به سرور
      const response = await fetch('https://soodcity.liara.run/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': userToken
        },
        body: JSON.stringify({
          endpoint: `fcm:${token}`,
          keys: {
            p256dh: token,
            auth: token
          },
          platform: 'capacitor'
        })
      });

      if (response.ok) {
        console.log('✅ Token sent to server successfully');
      } else {
        console.error('❌ Failed to send token to server:', await response.text());
      }
    } catch (error) {
      console.error('❌ Error sending token to server:', error);
    }
  }

  /**
   * نمایش نوتیفیکیشن محلی
   */
  private async showLocalNotification(notification: PushNotificationSchema) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || 'Soodcity',
            body: notification.body || 'New notification',
            id: Math.floor(Math.random() * 10000),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'beep.wav',
            extra: notification.data
          }
        ]
      });
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }

  /**
   * هندل کردن کلیک روی نوتیفیکیشن
   */
  private handleNotificationAction(action: ActionPerformed) {
    const data = action.notification.data;
    console.log('Notification action data:', data);
    
    // اینجا می‌توانید کاربر را به صفحه مربوطه هدایت کنید
    if (data && data.type === 'message') {
      // هدایت به صفحه چت
      console.log('Navigate to chat');
    } else if (data && data.type === 'request') {
      // هدایت به صفحه درخواست‌ها
      console.log('Navigate to requests');
    }
  }

  /**
   * دریافت وضعیت مجوزها
   */
  async checkPermissions() {
    if (!this.platform.is('capacitor')) {
      return { receive: 'granted' }; // در مرورگر فرض می‌کنیم مجوز داده شده
    }

    try {
      return await PushNotifications.checkPermissions();
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { receive: 'denied' };
    }
  }

  /**
   * حذف ثبت نوتیفیکیشن
   */
  async unregister() {
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      await PushNotifications.unregister();
      console.log('Push notifications unregistered');
    } catch (error) {
      console.error('Error unregistering push notifications:', error);
    }
  }
}