import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

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
        this.navCtrl.setRoot('MenuPage', { user: userCredential.user });
      })
      .catch(error => {
        loading.dismiss();
        if (error.code === 'auth/network-request-failed') {
          console.log('falta de conexão'); //TODO: exibir pro usuario
          return;
        }
        if(error.code === 'auth/email-already-in-use') {
          console.log('E-mail já cadastrado'); //TODO: exibir pro usuario
          return;
        }
      });
  }

}
