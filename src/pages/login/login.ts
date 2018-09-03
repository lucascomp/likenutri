import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public showLoginForm: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebookProvider: FacebookProvider,
    public firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidEnter() {
    this.showLoginForm = this.navParams.get('showLoginForm');
    if(this.showLoginForm) return;

    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    this.firebaseProvider.onFirstAuthStateChanged(user => {
      this.facebookProvider.getLoginStatus()
        .then(response => {
          if (response.status !== 'connected') {
            loading.dismiss();
            this.showLoginForm = true;
            return;
          }
          if (user) {
            this.goToMenuPage(user);
            return;
          }
          this.firebaseProvider.login(response.authResponse.accessToken)
            .then(userCredential => {
              this.goToMenuPage(userCredential.user);
            })
            .catch(error => {
              loading.dismiss();
              if (error.code === 'auth/network-request-failed') {
                console.log('falta de conexão'); //TODO: exibir pro usuario
                return;
              }
              console.log('Ocorreu um problema ao se conectar via Facebook. Tente novamente mais tarde.'); //TODO: exibir pro usuario
            });
        });
    });
  }

  login() {
    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();
    
    this.facebookProvider.login()
      .then(facebookLoginResponse => {
        this.firebaseProvider.login(facebookLoginResponse.authResponse.accessToken)
          .then(userCredential => {
            this.goToMenuPage(userCredential.user);
          })
          .catch(error => {
            loading.dismiss();
            if(error.code == 'auth/network-request-failed') {
              console.log('falta de conexão'); //TODO: exibir pro usuario
              return;
            }
            console.log('erro de conexão com firebase'); //TODO: exibir pro usuario
          });
      })
      .catch(error => {
        loading.dismiss();
        if (error.errorCode != 4201) {
          console.log('falta de conexão'); //TODO: exibir pro usuario
          return;
        }
      });
  }

  goToMenuPage(user: firebase.User) {
    this.navCtrl.setRoot('MenuPage', { user: user });
  }
}
