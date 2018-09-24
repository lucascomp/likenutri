import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

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
    public firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    this.firebaseProvider.getToken();
  }

  logout() {
    this.loadingCtrl.create({ dismissOnPageChange: true }).present();
    this.firebaseProvider.logout()
      .then(() => this.navCtrl.setRoot('LoginPage', { showPage: true }));

  }

  quiz() {
    this.navCtrl.push('QuizPage', this.navParams.data);
  }

}
