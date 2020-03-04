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
      const productID : Array<any> = []
      const orderedCategoryID : Array<any> = []
      let remainingCategories : Array<any> = []
      return admin.firestore().collection('Order').get().then(orders => {
         // var ordersArray : any[]
         let addToProductID : boolean = false
         for(const key in orders.docs){
            const ordersArray = orders.docs[key].data().product
            for(const i in ordersArray){
               if(productID.length === 0){
                  addToProductID = true
               }else if(productID.length > 0){
                  for(const j in productID){

                     if(productID[j] === ordersArray[i].prod_id){
                        addToProductID = false
                        break
                     }else if(productID[j] !== ordersArray[i].prod_id){
                        addToProductID = true
                     }
                  }
               }
               if(addToProductID === true){
                  productID.push(ordersArray[i].prod_id)
               }
            }
         }
         console.log(productID, ' products in pending orders | 50');
         
      }).then(() => {
         console.log(productID, ' products in pending orders | 53');
         return admin.firestore().collection('Products').where('brandID', '==', brandID).get().then(result => {
            console.log(productID, ' products in pending orders | 71');
            
            const products : Array<any> = []
            const productsToQueue : Array<any> = []
            for(const key in result.docs){
               //console.log('this is productID ', productID);
               products.push(result.docs[key].id)
               for(const i in productID){

                  
                  if(result.docs[key].id === productID[i]){
                     //console.log(productID[i], ' is updated');
                     //productsToQueue.push(result.docs[key].id)
                     let addingBoolean = false
                     if(orderedCategoryID.length === 0){
                        addingBoolean = true
                     }
                     for(const o in orderedCategoryID){
                        if(orderedCategoryID[o] === result.docs[key].data().categoryID){
                           addingBoolean = false
                           break
                        }else if(orderedCategoryID[o] !== result.docs[key].data().categoryID){
                           addingBoolean = true
                        }
                     }
                     if(addingBoolean === true){
                        orderedCategoryID.push(result.docs[key].data().categoryID)
                     }
                     break
                  }
               }
            }

            console.log(productID, ' these are all the products that cant be deleted');
            // for(const i in productID){
            //    for(const key in products){
            //       if(products[key] === productID[i]){
            //          productsToQueue.push(products[key])
            //          products.splice(Number(key), 1)
            //       }
            //    }
            // }
            for(const j in productID){
               const index = products.indexOf(productID[j])
               productsToQueue.push(products[index])
               products.splice(Number(index), 1)
            }
            console.log(products, 'these are the products to delete');
            //console.log(products, 'this are the products to delete');
            //console.log(productsToQueue, 'this are the products to queue');
            
            
            for(const key in products){
              console.log(key, ' in products');
               
               console.log(products[key], ' is deleted from products')
               admin.firestore().collection('Products').doc(products[key]).delete().then(() => {
                  admin.storage().bucket().file('clothes/' + products[key]).delete().then( () => {
                     //
                  }).catch( () => {
                     //
                  })
               }).catch(error => {
                  //
               })
            }
            for(const key in productsToQueue){
              // console.log();
               
               console.log(productsToQueue[key], ' is edited in products')
               admin.firestore().collection('Products').doc(productsToQueue[key]).update({
                  deleteQueue : true,
                  hideItem: true
               }).then(() => {
                  //
               }).catch( () => {
                  //
               })
            }
            return null            
         }).then(() => {
         console.log(orderedCategoryID, 'here is the categoryIDs from orders');
         
         return admin.firestore().collection('category').where('brandID', '==', brandID).get().then(result => {
            const categories : Array<any> = []
            let categoriesToQueue : Array<any> = []
            let addCategoryToQueue : boolean = false
            //console.log('running get function');
            categoriesToQueue = orderedCategoryID
            for(const key in result.docs){
               categories.push(result.docs[key].id)
               console.log(categories, 'these are all the categories');
               
               for(const i in orderedCategoryID){
                  if(result.docs[key].id === orderedCategoryID[i]){
                     //addCategoryToQueue = true
                     for(const j in categoriesToQueue){
                        if(categoriesToQueue[j] === result.docs[key].id){
                           addCategoryToQueue = false
                        }else if(categoriesToQueue[j] !== result.docs[key].id){
                           addCategoryToQueue = true
                        }
                     }
                     if(addCategoryToQueue === true){
                        categoriesToQueue.push(result.docs[key].id)
                     }

                     break
                  }
               }
            }
            for(const key in categories){
               for(const i in categoriesToQueue){
                  if(categories[key] === categoriesToQueue[i]){
                     categories.splice(Number(key), 1)
                  }
               }
            }
            console.log(categories, 'categories to delete');
            
           for(const key in categories){
              console.log(categories[key], ' is deleted from categories');
               admin.firestore().collection('category').doc(categories[key]).delete().then(() => {
                  admin.storage().bucket().file('category/' + categories[key]).delete().then( () => {
                     //
                  }).catch( () => {
                     //
                  })
                  // .then( () => {
                  //    //
                  // })

               }).catch( () => {
                  //
               })
            }
            remainingCategories = categoriesToQueue
            console.log();
            
            for(const key in categoriesToQueue){
               console.log(categoriesToQueue[key], ' is updated with queue');
               admin.firestore().collection('category').doc(categoriesToQueue[key]).update({
                  deleteQueue : true,
                  hideItem: true
               }).then(() => {
                  //return null
               }).catch(() => {
                  //
               })
 
            }
            console.log(categoriesToQueue, ' This is the length of categoriesToQueue');
            if(categoriesToQueue.length === 0){
               console.log(categoriesToQueue, 'length is very much zero');
               
               return admin.firestore().collection('brands').doc(brandID).delete().then( () => {
                  return admin.storage().bucket().file('brands/' + brandID).delete().then( () => {
                     //
                  })

               })
               return 
            }else if(categoriesToQueue.length !== 0){
            console.log(remainingCategories, 'is a nonsense');
               return null
            }else{
               return
            }
            return 
         }).then(() => {
           // console.log(remainingCategories, 'here we sing for the remaining categories');;
         //    const currentCategories : Array<any> = remainingCategories
         //    if(currentCategories.length === 0){
         //       console.log(currentCategories, 'length is very much zero');
               
         //       return admin.firestore().collection('brands').doc(brandID).delete().then( () => {
         //          return admin.storage().bucket().file('brands/' + brandID).delete().then( () => {
         //             //
         //          })

         //       })
         //       return 
         //    }else if(currentCategories.length !== 0){
         //    console.log(remainingCategories, 'is a nonsense');
         //       return null
         //    }else{
         //       return
         //    }
         })
      })
   })
   }else{
      return null
   }

})

exports.queueProductForDelete = functions.firestore.document('Products/{productID}').onUpdate( (change : any) => {
   const status = change.after.data().deleteItem
   const productID = change.after.id
   console.log('Here is the product ID in queueForDelete ===', productID);
   
   console.log('data', change.after.data().deleteItem);
   if(status === true){
      const orderedProductsArray : Array<any> = []
      return admin.firestore().collection('Order').get().then(orders => {
         // var ordersArray : any[]
         let addToorderedProductsArray : boolean = false
         for(const key in orders.docs){
            const ordersArray = orders.docs[key].data().product
            for(const i in ordersArray){
               if(orderedProductsArray.length === 0){
                  addToorderedProductsArray = true
               }else if(orderedProductsArray.length > 0){
                  for(const j in orderedProductsArray){

                     if(orderedProductsArray[j] === ordersArray[i].prod_id){
                        addToorderedProductsArray = false
                        break
                     }else if(orderedProductsArray[j] !== ordersArray[i].prod_id){
                        addToorderedProductsArray = true
                     }
                  }
               }
               if(addToorderedProductsArray === true){
                  orderedProductsArray.push(ordersArray[i].prod_id)
               }
            }
         }
         console.log(orderedProductsArray, ' products in pending orders | 50');
         
      }).then(() => {
         const orderedProducts : Array<any> = orderedProductsArray
         let queueToDelete : boolean = false
         for(let key in orderedProducts){
            if(orderedProducts[key] === productID){
               queueToDelete = true
               break
            }else if(orderedProducts[key] !== productID){
               queueToDelete = false
            }else{
               return
            }
         }
         if(queueToDelete === true){
            console.log('queuing item');
            return admin.firestore().collection('Products').doc(productID).update({
               deleteQueue : true,
               hideItem: true,
               deleteItem: admin.firestore.FieldValue.delete()
            }).then( () => {
               return null
            })
            
         }else if(queueToDelete === false){
            console.log('deleting item');
            return admin.firestore().collection('Products').doc(productID).delete().then( () => {
               //const file = 
               return admin.storage().bucket().file('clothes/' + productID).delete().then(() => {
                 // return
               })
              // return file.delete()
            })
            return
         }else{
            return null
         }
      })
   }else{
      return null
   }
})

exports.checkQueuedItems = functions.firestore.document('Order/{orderID}').onUpdate( (change : any) => {
   //const orderID = change.after.id
   const productID : Array<any> = []
   const orderedCategoryID : Array<any> = []
   let remainingCategories : Array<any> = []
   return admin.firestore().collection('Order').get().then(orders => {
      // var ordersArray : any[]
      let addToProductID : boolean = false
      for(const key in orders.docs){
         const ordersArray = orders.docs[key].data().product
         for(const i in ordersArray){
            if(productID.length === 0){
               addToProductID = true
            }else if(productID.length > 0){
               for(const j in productID){

                  if(productID[j] === ordersArray[i].prod_id){
                     addToProductID = false
                     break
                  }else if(productID[j] !== ordersArray[i].prod_id){
                     addToProductID = true
                  }
               }
            }
            if(addToProductID === true){
               productID.push(ordersArray[i].prod_id)
            }
         }
      }
      console.log(productID, ' products in pending orders | 50');
      
   }).then(() => {
      console.log(productID, ' products in pending orders | 53');
      return admin.firestore().collection('Products').where('deleteQueue', '==', true).get().then(result => {
         console.log(productID, ' products in pending orders | 71');
         
         const products : Array<any> = []
         const productsToQueue : Array<any> = []
         for(const key in result.docs){
            //console.log('this is productID ', productID);
            products.push(result.docs[key].id)
            for(const i in productID){

               
               if(result.docs[key].id === productID[i]){
                  //console.log(productID[i], ' is updated');
                  //productsToQueue.push(result.docs[key].id)
                  let addingBoolean = false
                  if(orderedCategoryID.length === 0){
                     addingBoolean = true
                  }
                  for(const o in orderedCategoryID){
                     if(orderedCategoryID[o] === result.docs[key].data().categoryID){
                        addingBoolean = false
                        break
                     }else if(orderedCategoryID[o] !== result.docs[key].data().categoryID){
                        addingBoolean = true
                     }
                  }
                  if(addingBoolean === true){
                     orderedCategoryID.push(result.docs[key].data().categoryID)
                  }
                  break
               }
            }
         }

         console.log(productID, ' these are all the products that cant be deleted');
         // for(const i in productID){
         //    for(const key in products){
         //       if(products[key] === productID[i]){
         //          productsToQueue.push(products[key])
         //          products.splice(Number(key), 1)
         //       }
         //    }
         // }
         for(const j in productID){
            const index = products.indexOf(productID[j])
            productsToQueue.push(products[index])
            products.splice(Number(index), 1)
         }
         console.log(products, 'these are the products to delete');
         //console.log(products, 'this are the products to delete');
         //console.log(productsToQueue, 'this are the products to queue');
         
         
         for(const key in products){
           console.log(key, ' in products');
            
            console.log(products[key], ' is deleted from products')
            admin.firestore().collection('Products').doc(products[key]).delete().then(() => {
               admin.storage().bucket().file('clothes/' + products[key]).delete().then( () => {
                  //
               }).catch( () => {
                  //
               })
            }).catch(error => {
               //
            })
         }
         for(const key in productsToQueue){
           // console.log();
            
            console.log(productsToQueue[key], ' is edited in products')
            admin.firestore().collection('Products').doc(productsToQueue[key]).update({
               deleteQueue : true,
               hideItem: true
            }).then(() => {
               //
            }).catch( () => {
               //
            })
         }
         return null            
      }).then(() => {
      console.log(orderedCategoryID, 'here is the categoryIDs from orders');
      
      return admin.firestore().collection('category').where('deleteQueue', '==', true).get().then(result => {
         const categories : Array<any> = []
         let categoriesToQueue : Array<any> = []
         let addCategoryToQueue : boolean = false
         //console.log('running get function');
         categoriesToQueue = orderedCategoryID
         for(const key in result.docs){
            categories.push(result.docs[key].id)
            console.log(categories, 'these are all the categories');
            
            for(const i in orderedCategoryID){
               if(result.docs[key].id === orderedCategoryID[i]){
                  //addCategoryToQueue = true
                  for(const j in categoriesToQueue){
                     if(categoriesToQueue[j] === result.docs[key].id){
                        addCategoryToQueue = false
                     }else if(categoriesToQueue[j] !== result.docs[key].id){
                        addCategoryToQueue = true
                     }
                  }
                  if(addCategoryToQueue === true){
                     categoriesToQueue.push(result.docs[key].id)
                  }

                  break
               }
            }
         }
         for(const key in categories){
            for(const i in categoriesToQueue){
               if(categories[key] === categoriesToQueue[i]){
                  categories.splice(Number(key), 1)
               }
            }
         }
         console.log(categories, 'categories to delete');
         
        for(const key in categories){
           console.log(categories[key], ' is deleted from categories');
            admin.firestore().collection('category').doc(categories[key]).delete().then(() => {
               admin.storage().bucket().file('category/' + categories[key]).delete().then( () => {
                  //
               }).catch( () => {
                  //
               })
               // .then( () => {
               //    //
               // })

            }).catch( () => {
               //
            })
         }
         remainingCategories = categoriesToQueue
         console.log();
         
         for(const key in categoriesToQueue){
            console.log(categoriesToQueue[key], ' is updated with queue');
            admin.firestore().collection('category').doc(categoriesToQueue[key]).update({
               deleteQueue : true,
               hideItem: true
            }).then(() => {
               //return null
            }).catch(() => {
               //
            })

         }
         console.log(categoriesToQueue, ' This is the length of categoriesToQueue');
         if(categoriesToQueue.length === 0){
            console.log(categoriesToQueue, 'length is very much zero');
            
            // return admin.firestore().collection('brands').doc(brandID).delete().then( () => {
            //    return admin.storage().bucket().file('brands/' + brandID).delete().then( () => {
            //       //
            //    })

            // })
            return 
         }else if(categoriesToQueue.length !== 0){
         console.log(remainingCategories, 'is a nonsense');
            return null
         }else{
            return
         }
         return 
      }).then(() => {
        // console.log(remainingCategories, 'here we sing for the remaining categories');;
      //    const currentCategories : Array<any> = remainingCategories
      //    if(currentCategories.length === 0){
      //       console.log(currentCategories, 'length is very much zero');
            
      //       return admin.firestore().collection('brands').doc(brandID).delete().then( () => {
      //          return admin.storage().bucket().file('brands/' + brandID).delete().then( () => {
      //             //
      //          })

      //       })
      //       return 
      //    }else if(currentCategories.length !== 0){
      //    console.log(remainingCategories, 'is a nonsense');
      //       return null
      //    }else{
      //       return
      //    }
      })
   })
})
})
