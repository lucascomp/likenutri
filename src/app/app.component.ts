import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseProvider } from '../providers/firebase/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string = 'LoginPage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    firebaseProvider: FirebaseProvider
  ) {
    platform.ready().then(() => {
      statusBar.backgroundColorByName('black');
      statusBar.styleBlackTranslucent();
      firebaseProvider.initializeApp(); 
      splashScreen.hide();
    });
  }
}

