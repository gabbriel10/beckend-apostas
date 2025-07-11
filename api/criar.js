const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, nome, email } = req.body;

    await db.ref('usuarios/' + id).set({
      nome,
      email,
      saldo: 0,
    });

    return res.status(200).json({ status: 'ok' });
  }

  res.status(405).json({ error: 'Método não permitido' });
}