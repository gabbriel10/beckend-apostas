const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.database();

router.post('/criar', async (req, res) => {
  const { id, nome, email } = req.body;
  await db.ref('usuarios/' + id).set({
    nome,
    email,
    saldo: 0
  });
  res.send({ status: 'ok' });
});

router.get('/saldo/:id', async (req, res) => {
  const ref = db.ref('usuarios/' + req.params.id + '/saldo');
  ref.once('value', snapshot => res.send({ saldo: snapshot.val() }));
});

module.exports = router;