import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { emailValidator } from '../../validators/email.validator';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public showPage: boolean;
  public form: FormGroup;

  constructor(
    public facebookProvider: FacebookProvider,
    public firebaseProvider: FirebaseProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, {
      validator: emailValidator
    });
  }

  ionViewDidLoad() {
    this.showPage = this.navParams.get('showPage');
    if (this.showPage) return;

    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    this.firebaseProvider.onFirstAuthStateChanged(user => {
      if (user) {
        this.goToMenuPage(user);
        return;
      }
      loading.dismiss();
      this.showPage = true;
    });
  }

  loginWithEmail() {
    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    this.firebaseProvider.loginWithEmail(this.form.controls.email.value, this.form.controls.password.value)
      .then(userCredential => {
        this.goToMenuPage(userCredential.user);
      })
      .catch(error => {
        loading.dismiss();
        if (error.code === 'auth/network-request-failed') {
          console.log('falta de conexão'); //TODO: exibir pro usuario
          return;
        }
        else {
          console.log(error);
        }
        console.log('Ocorreu um problema ao se conectar. Tente novamente mais tarde.'); //TODO: exibir pro usuario
      });
  }

  loginWithFacebook() {
    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    this.facebookProvider.login()
      .then(facebookLoginResponse => {
        this.firebaseProvider.loginWithFacebook(facebookLoginResponse.authResponse.accessToken)
          .then(userCredential => {
            this.goToMenuPage(userCredential.user);
          })
          .catch(error => {
            loading.dismiss();
            if (error.code == 'auth/network-request-failed') {
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

  signup() {
    this.navCtrl.push('RegisterPage');
  }

  goToMenuPage(user: firebase.User) {
    this.navCtrl.setRoot('MenuPage', { user: user });
  }
}
