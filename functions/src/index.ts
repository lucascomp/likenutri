import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.feedbackNotification = functions.firestore
  .document('answers/{answerId}')
  .onCreate(async event => notificationTrigger(event));

async function notificationTrigger(event: FirebaseFirestore.DocumentSnapshot) {
  const data = event.data();
  const db = admin.firestore();

  const userId = data.userId;
  const answerId = data.answerId;

  const answer = (await db.collection('answers').where('id', '==', answerId).get())[0].data();
  if (answer.value == 2) return null;

  const question = (await db.collection('questions').where('id', '==', answer.questionId).get())[0].data();
  const user = (await db.collection('users').where('id', '==', userId).get())[0].data();

  const payload = {
    notification: {
      title: 'Dica do dia',
      body: question.notification
    }
  };

  const waitTime = Math.random() * 1000 * 21600 + 1800000;

  return setTimeout(() => admin.messaging().sendToDevice(user.token, payload), waitTime);
}
