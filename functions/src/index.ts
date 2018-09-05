import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.feedbackNotification = functions.firestore
  .document('answers/{answerId}')
  .onCreate(async event => notificationTrigger(event));

async function notificationTrigger(event: FirebaseFirestore.DocumentSnapshot) {
  const answer = event.data();
  if (answer.value == 2) return null;

  const db = admin.firestore();
  const question = (await db.doc(`questions/${answer.questionId}`).get()).data();
  const user = (await db.doc(`users/${answer.userId}`).get()).data();

  const payload = {
    notification: {
      title: 'Dica do dia',
      body: question.notification
    }
  };

  const waitTime = Math.random() * 1000 * 21600 + 1800000;

  return setTimeout(() => admin.messaging().sendToDevice(user.token, payload), waitTime);
}
