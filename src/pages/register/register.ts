import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { passwordValidator } from '../../validators/password.validator';
import { emailValidator } from '../../validators/email.validator';
 
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public form: FormGroup;

  constructor(
    public firebase: FirebaseProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, {
      validator: [
        passwordValidator,
        emailValidator
      ]
    });
  }

  signup() {
    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();
    this.firebase.createUserWithEmailAndPassword(this.form.controls.email.value, this.form.controls.password.value)
      .then(userCredential => {
        this.navCtrl.setRoot('ProfileCreatePage', { user: userCredential.user });
      })
      .catch(error => {
        loading.dismiss();
        if (error.code === 'auth/network-request-failed') {
          this.showToast('Ocorreu uma falha na conexão');
          return;
        }
        if(error.code === 'auth/email-already-in-use') {
          this.showToast('Este e-mail já está em uso');
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
