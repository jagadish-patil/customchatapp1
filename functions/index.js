const functions = require("firebase-functions");

const Filter = require('bad-words');

const admin = require('firebase-admin');
const { wait } = require("@testing-library/dom");
admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
        .document('messages/{msgID}')
        .onCreate(async (doc, ctx) => {

            const filter = new Filter();
            const { text, uid } = doc.data();

            if(filter.isProfane(text)){
                const cleaned = filter.clean(text);
                await doc.ref.update({text:`I Got restricted for life saying...${cleaned}`});
                
                await db.collection('banned').doc(uid).set({});
            }
});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
