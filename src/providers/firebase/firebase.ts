import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

import { Question } from '../../models/question';
import { Answer } from '../../models/answer';

declare var require: any;
firebase.initializeApp(require('../../../firebase-config.json'));

@Injectable()
export class FirebaseProvider {

  public firestore = firebase.firestore();
  public auth = firebase.auth();

  constructor(
    private messaging: Firebase,
    private platform: Platform
  ) { }

  initializeApp() {
    this.firestore.settings({ timestampsInSnapshots: true });
  }

  onFirstAuthStateChanged(callback: (user: firebase.User) => void) {
    const subject = new Subject<firebase.User>();
    subject.first().subscribe(callback);
    this.auth.onAuthStateChanged(user => subject.next(user));
  }

  createUserWithEmailAndPassword(email: string, password): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  loginWithEmail(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loginWithFacebook(accessToken: string): Promise<firebase.auth.UserCredential> {
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    return this.auth.signInAndRetrieveDataWithCredential(facebookCredential);
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  async getToken(): Promise<string> {
    if (this.platform.is('ios')) {
      await this.messaging.grantPermission();
    }
    return this.messaging.getToken();
  }

  // getQuestion(userId: number): Promise<Question> {
  //   return new Promise<Question>((resolve, reject) => {
  //     this.firestore.collection('answers').where('userId', '==', userId).get({ source: 'server' })
  //       .then(querySnapshot => {
  //         const answers: Answer[] = [];
  //         querySnapshot.forEach(doc => {
  //           answers.push(doc.data() as Answer);
  //         });

          
  //       })
  //       .catch(error => {
  //         if (error.code === 'unavailable') {
  //           console.log('falta de conexão');
  //         }
  //         else if (error.code === 'permission-denied') {
  //           console.log('Usuário deslogado do firebase');
  //         }
  //       });
  //   });
  // }

  // getUserList() {
  //   this.firestore.collection('users').get({ source: 'server' }) //TODO: definir tipo da lista de retorno
  //     .then(querySnapshot => {
  //       console.log(querySnapshot.docs);
  //     })
  //     .catch(error => {
  //       if (error.code === 'unavailable') {
  //         console.log('falta de conexão');
  //       }
  //       else if (error.code === 'permission-denied') {
  //         console.log('Usuário deslogado do firebase');
  //       }
  //     });
  // }

}
