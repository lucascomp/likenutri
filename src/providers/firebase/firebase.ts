import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

declare var require: any;
const firebaseConfig = require('../../../firebase-config.json');

@Injectable()
export class FirebaseProvider {

  public firestore: firebase.firestore.Firestore;

  constructor() {}

  initializeApp() {
    firebase.initializeApp(firebaseConfig);
    this.firestore = firebase.firestore();
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
