// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  
  constructor(
    private platform: Platform,
    private pushNotificationService: PushNotificationService
  ) {}

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    if (this.platform.is('capacitor')) {
      // فقط در محیط Capacitor نوتیفیکیشن‌ها را فعال کن
      console.log('Running in Capacitor, initializing push notifications...');
      await this.pushNotificationService.initPushNotifications();
    } else {
      console.log('Running in browser, push notifications disabled');
    }
  }
}