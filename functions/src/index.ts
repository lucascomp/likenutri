import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

const messaging = admin.messaging();

exports.deleteUserDoc = functions.auth.user().onDelete(user => deleteUserDoc(user));
exports.feedbackNotification = functions.firestore.document('answers/{answerId}').onCreate(async doc => feedbackNotification(doc));

function deleteUserDoc(user: admin.auth.UserRecord) {
  return firestore.collection('users').doc(user.uid).delete();
}

async function feedbackNotification(doc: FirebaseFirestore.DocumentSnapshot) {
  const answer = doc.data();

  const user = (await firestore.doc(`users/${answer.userId}`).get()).data();
  firestore.doc(`users/${answer.userId}`).update({
    score: user.score + answer.value
  });
  
  if (answer.value == 2) return null;
  
  const question = (await firestore.doc(`questions/${answer.questionId}`).get()).data();

  const payload = {
    notification: {
      title: 'Dica do dia',
      body: question.notification
    }
  };

  const waitTime = Math.random() * 1000 * 21600 + 1800000;

  return setTimeout(() => messaging.sendToDevice(user.token, payload), waitTime);
}
