import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  public message: string;
  public user: firebase.User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) { }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
  }

  send() {
    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    this.firebaseProvider.sendFeedback(this.user.uid, this.message)
      .then(() => {
        this.showToast("Sua mensagem foi enviada com sucesso. Agradecemos a sua contribuição!");
        this.navCtrl.pop();
      })
      .catch(error => {
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
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    }).present();
  }
}
