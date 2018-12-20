import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({
    origin: true,
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
});

exports.deleteUser = functions.https.onRequest((req, res) => {
    const uid = req.body.uid;

    const delUser = admin.auth().deleteUser(uid);
    return cors(req, res, () => {
        delUser.then(() => {
            res.status(200).send({ success: true, msg: 'User Deleted Succesfully' });
        }).catch((error) => {
            console.log("Error deleting user:", error);

            res.json(error);
        });
    });


});