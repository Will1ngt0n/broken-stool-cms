import * as functions from 'firebase-functions';
const gcs = require('@google-cloud/storage')()
//const admin = require('firebase-admin');


exports.deleteProducts = functions.firestore.document('category/{{category}}').onDelete( (change : any, context) => {
   const categoryID = change.data().id
   gcs.bucket('gs://broken-stool.appspot.com').file('/category'+categoryID).delete()
   functions.firestore.document('Products/{{product}}')
})
