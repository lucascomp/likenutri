import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

const messaging = admin.messaging();

exports.createUserDoc = functions.auth.user().onCreate(user => createUserDoc(user));
exports.deleteUserDoc = functions.auth.user().onDelete(user => deleteUserDoc(user));
exports.feedbackNotification = functions.firestore.document('answers/{answerId}').onCreate(async doc => feedbackNotification(doc));

function createUserDoc(user: admin.auth.UserRecord) {
  firestore.doc(`users/${user.uid}`).set({ uid: user.uid });
}

function deleteUserDoc(user: admin.auth.UserRecord) {
  firestore.collection('users').doc(user.uid).delete();
}

async function feedbackNotification(doc: FirebaseFirestore.DocumentSnapshot) {
  const answer = doc.data();
  if (answer.value == 2) return null;

  const question = (await firestore.doc(`questions/${answer.questionId}`).get()).data();
  const user = (await firestore.doc(`users/${answer.userId}`).get()).data();

  const payload = {
    notification: {
      title: 'Dica do dia',
      body: question.notification
    }
  };

  const waitTime = Math.random() * 1000 * 21600 + 1800000;

  return setTimeout(() => messaging.sendToDevice(user.token, payload), waitTime);
}
