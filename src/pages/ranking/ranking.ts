import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Profile } from '../../models/profile';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})
export class RankingPage {

  public user: firebase.User;
  public profile: Profile;
  public list: {id: string, name: string, score: string}[] = [];

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebookProvider: FacebookProvider,
    public firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.profile = this.navParams.get('profile');

    const loading = this.loadingCtrl.create();
    loading.present();

    this.facebookProvider.getUserFriends()
      .then(response => {
        this.firebaseProvider.getFriendsScore(response.data)
          .then(() => {
            loading.dismiss();
            this.list = response.data;
            this.list.push({
              id: this.user.providerData[0].uid,
              name: this.profile.data.name,
              score: this.profile.data.score
            });
          })
          .catch(error => {
            loading.dismiss();
            if (error.code === 'permission-denied') {
              this.navCtrl.setRoot('LoginPage');
              return;
            }
            loading.dismiss();
            if (error.code === 'unavailable') {
              this.showToast('Ocorreu uma falha na conexão');
              return;
            }
            this.showToast(`Ops! Ocorreu um erro inesperado: ${error.code}`);
          });
      })
      .catch(error => {
        loading.dismiss();
        if (error.errorCode === '190' || error.errorCode === '2500') {
          this.navCtrl.setRoot('LoginPage');
          return;
        }
        this.showToast(`Ops! Ocorreu um erro inesperado: ${error.errorCode}`);
        this.navCtrl.pop();
      });
  }

  get ranking() {
    return this.list.sort((a, b) => a.score < b.score ? 1 : -1);
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    }).present();
  }
}
