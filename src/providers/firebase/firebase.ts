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

  getUserData(userId: string): Promise<firebase.firestore.DocumentData> {
    return new Promise<firebase.firestore.DocumentData>((resolve, reject) => {
      this.firestore.doc(`users/${userId}`).get({ source: 'server' })
        .then(documentSnapshot => {
          resolve(documentSnapshot.data());
        })
        .catch(reject);
    });
  }

  createProfile(userId: string, data: firebase.firestore.DocumentData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.doc(`users/${userId}`).set(data)
        .then(resolve)
        .catch(reject);
    });
  }

  sendFeedback(userId: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let data: firebase.firestore.DocumentData = {
        uid: userId,
        message,
        timestamp: new Date().toISOString()
      };
      this.firestore.collection('feedback').add(data)
        .then(() => resolve())
        .catch(reject);
    });
  }

  getFriendsScore(list: {id: string, name: string, score: string}[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let collection = this.firestore.collection('users');
      let query: firebase.firestore.Query;
      list.forEach(user => {
        query = (query ? query : collection).where('uid', '==', user.id);
      });
      query.get({ source: 'server' })
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            list.find(user => user.id == doc.data().uid).score = doc.data().score;
          });
          resolve();
        })
        .catch(reject);
    });
  }

  getQuestions(uid: string): Promise<firebase.firestore.QueryDocumentSnapshot[]> {
    return new Promise<firebase.firestore.QueryDocumentSnapshot[]>((resolve, reject) => {
      this.firestore.collection('answers').where('userId', '==', uid).get({ source: 'server' })
        .then(querySnapshot => {
          let count = querySnapshot.size;
          this.firestore.collection('questions').get({ source: 'server' })
            .then(querySnapshot => {
              resolve(querySnapshot.docs.slice(count));
            });
        })
        .catch(reject);
    });
  }

  setAnswer(userId: string, questionId: string, value: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let data: firebase.firestore.DocumentData = {
        userId,
        questionId,
        value
      };
      this.firestore.collection('answers').add(data)
        .then(() => resolve())
        .catch(reject);
    });
  }
}
