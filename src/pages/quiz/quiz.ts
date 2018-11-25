import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {

  public user: firebase.User;
  public profile: Profile;
  public questions: firebase.firestore.QueryDocumentSnapshot[] = [];
  public selected: number;
  public showFeedback: boolean;
  public entering: boolean;
  public leaving: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.profile = this.navParams.get('profile');

    const loading = this.loadingCtrl.create();
    loading.present();

    this.firebaseProvider.getQuestions(this.user.uid)
      .then(questions => {
        loading.dismiss();
        this.questions = questions;
        this.checkQuestions();
      })
      .catch(error => {
        loading.dismiss();
        if (error.code === 'permission-denied') {
          this.navCtrl.setRoot('LoginPage');
          return;
        }
        if (error.code === 'unavailable') {
          this.showToast('Ocorreu uma falha na conexão');
          return;
        }
        this.showToast(`Ops! Ocorreu um erro inesperado: ${error.code}`);
      });
  }

  confirm() {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.firebaseProvider.setAnswer(this.user.uid, this.questions[0].id, this.questions[0].data().options[this.selected].value)
      .then(() => {
        loading.dismiss();
        this.showFeedback = true;
      })
      .catch(error => {
        loading.dismiss();
        if (error.code === 'permission-denied') {
          this.navCtrl.setRoot('LoginPage');
          return;
        }
        if (error.code === 'unavailable') {
          this.showToast('Ocorreu uma falha na conexão');
          return;
        }
        this.showToast(`Ops! Ocorreu um erro inesperado: ${error.code}`);
      });
  }

  menu() {
    this.leaving = true;
    setTimeout(() => {
      this.showFeedback = false;
      this.leaving = false;
      this.navCtrl.pop()
      .then(() => {
        const loading = this.loadingCtrl.create();
        loading.present();
    
        this.firebaseProvider.getUserData(this.user.uid)
          .then(data => {
            loading.dismiss();
            this.profile.data = data;
          })
          .catch(error => {
            loading.dismiss();
    
            if (error.code === 'permission-denied') {
              this.navCtrl.setRoot('LoginPage');
              return;
            }
            if (error.code === 'unavailable') {
              this.showToast('Ocorreu uma falha na conexão');
              return;
            }
            this.showToast(`Ops! Ocorreu um erro inesperado: ${error}`);
          });
      });
    }, 500);
  }

  next() {
    this.selected = null;
    this.leaving = true;
    setTimeout(() => {
      this.showFeedback = false;
      this.leaving = false;
      this.questions.shift();
      this.checkQuestions();
    }, 500);
  }

  checkQuestions() {
    if (this.questions.length == 0) {
      this.showToast("Parabéns, você respondeu todas as perguntas!");
      this.menu();
    }
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    }).present();
  }
}