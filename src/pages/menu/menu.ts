import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebookProvider: FacebookProvider,
    public firebaseProvider: FirebaseProvider
  ) {}

  logout() {
    this.facebookProvider.logout();
    this.firebaseProvider.logout();
    this.navCtrl.setRoot('LoginPage', { showLoginForm: true });
  }

}
