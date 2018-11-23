import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { LoginProvider } from '../../enums/login-provider';

import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
})
export class ProfileCreatePage {

  public form: FormGroup;
  public user: firebase.User;
  public profile: Profile;

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
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required])
    });
  }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.profile = this.navParams.get('profile');

    const loading = this.loadingCtrl.create();

    if (this.user.providerData[0].providerId == LoginProvider.Facebook) {
      loading.present();
      this.facebookProvider.getUserData()
        .then(data => {
          loading.dismiss();
          this.form.controls.name.setValue(data.name);
          this.form.controls.gender.setValue(data.gender);
          let dateIso8601 = data.birthday.substr(-4) + '-' + data.birthday.substr(0, 2) + '-' + data.birthday.substring(3, 5);
          this.form.controls.birthday.setValue(dateIso8601);
        })
        .catch(error => {
          loading.dismiss();
          if (error.errorCode === '190' || error.errorCode === '2500') {
            this.firebaseProvider.logout()
              .then(() => {
                this.navCtrl.pop();
              });
          }
          this.showToast('Ocorreu uma falha na conexão');
        });
    }
  }

  async createProfile() {
    const loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    loading.present();

    let data: firebase.firestore.DocumentData = {
      name: this.form.controls.name.value,
      gender: this.form.controls.gender.value,
      birthday: this.form.controls.birthday.value,
      weight: this.form.controls.weight.value,
      height: this.form.controls.height.value
    };

    this.firebaseProvider.updateProfile(this.user.uid, data)
      .then(() => {
        let profile: Profile = new Profile();
        profile.data = data;
        
        this.navCtrl.setRoot('MenuPage', { user: this.user, profile });
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
