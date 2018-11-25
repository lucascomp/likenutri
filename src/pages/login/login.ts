import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { emailValidator } from '../../validators/email.validator';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public form: FormGroup;
  public showForm: boolean;

  constructor(
    public facebookProvider: FacebookProvider,
    public firebaseProvider: FirebaseProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }, {
      validator: emailValidator
    });
  }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.firebaseProvider.onFirstAuthStateChanged(user => {
      loading.dismiss();
      if (user) {
        this.nextPage(user);
        return;
      }
      this.showForm = true;
    });
  }

  ionViewDidEnter() {
    this.form.reset();
  }

  loginWithEmail() {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.firebaseProvider.loginWithEmail(this.form.controls.email.value, this.form.controls.password.value)
      .then(userCredential => {
        loading.dismiss();
        this.nextPage(userCredential.user);
      })
      .catch(error => {
        loading.dismiss();
        if (error.code === 'auth/network-request-failed') {
          this.showToast('Ocorreu uma falha na conexão');
          return;
        }
        if (error.code === 'auth/wrong-password') {
          this.showToast('E-mail ou senha incorretos');
        }
        this.showToast(`Ops! Ocorreu um erro inesperado: ${error.code}`);
      });
  }

  loginWithFacebook() {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.facebookProvider.login()
      .then(facebookLoginResponse => {
        this.firebaseProvider.loginWithFacebook(facebookLoginResponse.authResponse.accessToken)
          .then(userCredential => {
            loading.dismiss();
            this.nextPage(userCredential.user);
          })
          .catch(error => {
            loading.dismiss();
            if (error.code == 'auth/network-request-failed') {
              this.showToast('Ocorreu uma falha na conexão');
              return;
            }
            this.showToast(`Ops! Ocorreu um erro inesperado: ${error.code}`);
          });
      })
      .catch(error => {
        loading.dismiss();
        if (error.errorCode != 4201) {
          this.showToast('Ocorreu uma falha na conexão');
          return;
        }
        this.showToast(`Ops! Ocorreu um erro inesperado: ${error.errorCode}`);
      });
  }

  signup() {
    this.navCtrl.push('RegisterPage');
  }

  async nextPage(user: firebase.User) {
    this.navCtrl.setRoot('ProfileCreatePage', { user });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    }).present();
  }
}
