const functions = require('firebase-functions');
//import * as firebase from 'firebase'
import * as admin from 'firebase-admin';
admin.initializeApp();
// const firebaseConfig = {
//    apiKey: "AIzaSyC9Edgr1Yl4b2VHU98wSlm4xBtj2or51Vg",
//    authDomain: "broken-stool.firebaseapp.com",
//    databaseURL: "https://broken-stool.firebaseio.com",
//    projectId: "broken-stool",
//    storageBucket: "broken-stool.appspot.com",
//    messagingSenderId: "918311615055",
//    appId: "1:918311615055:web:374b3a771e9870a4c8083a",
//    measurementId: "G-YKQ4BTFTS9"
//  }; 
//  // this is where we Initialize Firebase
//  firebase.initializeApp(firebaseConfig);
// const gcs = require('@google-cloud/storage')()
//const admin = require('firebase-admin');


// exports.deleteProducts = functions.firestore.document('category/{{category}}').onDelete( (change : any, context) => {
//    const categoryID = change.data().id
//    gcs.bucket('gs://broken-stool.appspot.com').file('/category'+categoryID).delete()
//    functions.firestore.document('Products/{{product}}')
// })
//let status : boolean
//let brandID : string
exports.deleteQueue = functions.firestore.document('brands/{brandID}').onUpdate( (change : any) => {
   const brandID = change.after.id
   console.log('Here is the brand ID ===', brandID);
   
   console.log('data', change.after.data().deleteQueue);
   

   const status = change.after.data().deleteQueue
   console.log(status);
   if(status === true){
      console.log('true');
      
      return admin.firestore().collection('category').where('brandID', '==', brandID).get().then(result => {
         const categoriesToQueue : Array<string> = []
         for(const key in result.docs){
            categoriesToQueue.push(result.docs[key].id)
         }
         console.log(categoriesToQueue);
         
         for(const key in categoriesToQueue){
            return admin.firestore().collection('category').doc(categoriesToQueue[key]).update({
               deleteQueue : true
            }).then(() => {
               return null
            })
         }
         return 'dfsd'
      }).then(() => {
         return admin.firestore().collection('Products').where('brandID', '==', brandID).get().then(result => {
            const productsToQueue : Array<string> = []
            for(const key in result.docs){
               productsToQueue.push(result.docs[key].id)
            }
            console.log(productsToQueue);
            for(const key in productsToQueue){
               return admin.firestore().collection('Products').doc(productsToQueue[key]).update({
                  deleteQueue : true
               }).then(() => {
                  return null
               })
            }
            return null
         })

      })
   }else{
      return null
   }

})
