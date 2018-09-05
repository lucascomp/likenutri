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
exports.feedbackNotificationOnCreate = functions.firestore
    .document('answers/{answerId}')
    .onCreate((event) => __awaiter(this, void 0, void 0, function* () { return notificationTrigger(event); }));
exports.feedbackNotificationOnUpdate = functions.firestore
    .document('answers/{answerId}')
    .onUpdate((event) => __awaiter(this, void 0, void 0, function* () { return notificationTrigger(event); }));
function notificationTrigger(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = event.data();
        const db = admin.firestore();
        const userId = data.userId;
        const answerId = data.answerId;
        const answer = (yield db.collection('answers').where('id', '==', answerId).get())[0].data();
        if (answer.value == 2)
            return null;
        const question = (yield db.collection('questions').where('id', '==', answer.questionId).get())[0].data();
        const user = (yield db.collection('users').where('id', '==', userId).get())[0].data();
        const payload = {
            notification: {
                title: 'Dica do dia',
                body: question.notification
            }
        };
        const waitTime = Math.random() * 1000 * 21600 + 1800000;
        return setTimeout(() => admin.messaging().sendToDevice(user.token, payload), waitTime);
    });
}
//# sourceMappingURL=index.js.map