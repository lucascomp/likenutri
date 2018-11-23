import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { LoginProvider } from '../../enums/login-provider';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  public user: firebase.User;
  public profile: Profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebookProvider: FacebookProvider,
    public firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    this.firebaseProvider.getToken();
    this.user = this.navParams.get('user');
    this.profile = this.navParams.get('profile');
  }

  logout() {
    this.loadingCtrl.create({ dismissOnPageChange: true }).present();

    let promises: Promise<any>[] = [this.firebaseProvider.logout()];

    if (this.user.providerData[0].providerId == LoginProvider.Facebook) {
      promises.push(this.facebookProvider.logout());
    }
    
    Promise.all(promises).then(() => this.navCtrl.setRoot('LoginPage'));
  }

  quiz() {
    this.navCtrl.push('QuizPage', this.navParams.data);
  }

  lookForNutri() {
    this.navCtrl.push('LookForNutriPage', { profile: this.profile });
  }

  ranking() {
    this.navCtrl.push('RankingPage');
  }

  feedback() {
    this.navCtrl.push('FeedbackPage', { user: this.user });
  }

}
