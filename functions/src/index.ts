import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

admin.messaging().sendToDevice("token", {
  notification: {
    title: 'Teste',
    body: "teste body",
    icon: 'https://studiosol-a.akamaihd.net/letras/338x298/fotos/4/8/a/1/48a17902f65d09c3e4ea362b157cdfc9.jpg'
  }
});
