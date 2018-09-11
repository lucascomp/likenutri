import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

declare var require: any;
firebase.initializeApp(require('../../../firebase-config.json'));

@Injectable()
export class FirebaseProvider {

  public firestore = firebase.firestore();

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
    firebase.auth().onAuthStateChanged(user => subject.next(user));
  }

  login(accessToken: string): Promise<firebase.auth.UserCredential> {
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    return firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential);
  }

  logout(): Promise<void> {
    return firebase.auth().signOut();
  }

  async getToken(): Promise<string> {
    if (this.platform.is('ios')) {
      await this.messaging.grantPermission();
    }
    return this.messaging.getToken();
  }

  getUserList() {
    this.firestore.collection("users").get({ source: "server" }) //TODO: definir tipo da lista de retorno
      .then(querySnapshot => {
        console.log(querySnapshot.docs);
      })
      .catch(error => {
        if (error.code === 'unavailable') {
          console.log('falta de conexão');
        }
        else if (error.code === 'permission-denied') {
          console.log('Usuário deslogado do firebase');
        }
      });
  }

}
