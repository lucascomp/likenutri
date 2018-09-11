"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });
const messaging = admin.messaging();
exports.createUserDoc = functions.auth.user().onCreate(user => createUserDoc(user));
exports.deleteUserDoc = functions.auth.user().onDelete(user => deleteUserDoc(user));
exports.feedbackNotification = functions.firestore.document('answers/{answerId}').onCreate((doc) => __awaiter(this, void 0, void 0, function* () { return feedbackNotification(doc); }));
function createUserDoc(user) {
    firestore.doc(`users/${user.uid}`).set({
        uid: user.uid
    });
}
function deleteUserDoc(user) {
    firestore.collection('users').doc(user.uid).delete();
}
function feedbackNotification(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = doc.data();
        if (answer.value == 2)
            return null;
        const question = (yield firestore.doc(`questions/${answer.questionId}`).get()).data();
        const user = (yield firestore.doc(`users/${answer.userId}`).get()).data();
        const payload = {
            notification: {
                title: 'Dica do dia',
                body: question.notification
            }
        };
        const waitTime = Math.random() * 1000 * 21600 + 1800000;
        return setTimeout(() => messaging.sendToDevice(user.token, payload), waitTime);
    });
}
//# sourceMappingURL=index.js.map