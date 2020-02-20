import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase'
​​import * as moment from 'moment'
import { NetworkService } from '../services/network-service/network.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var window
@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.page.html',
  styleUrls: ['./pending-order.page.scss'],
})
export class PendingOrderPage implements OnInit {
  item : object = {}
  refNo : string = ''
  name : string = ''
  products : Array<any> = []
  userID
  totalPrice
  quantity
  deliveryType
  deliveryAddress
  deliveryFee : number
  grandTotal
  purchaseDate
  userAddress
  pictures : Array<any> = []
  cell
  totalQuantity : number
  routingPage

  pdfObj = null;
  reciept = null;
  letterObj = {
    to: '',
    from: '',
    text: '',
    address:''
  } 
  constructor(private networkService : NetworkService, public loadingCtrl: LoadingController, private alertController : AlertController, private authService : AuthService, private route : Router, private activatedRoute : ActivatedRoute, private productsService: ProductsService) {
  this.isOnline = false
  this.isCached = false
  this.isConnected = false
  }

  isOnline : boolean
  isCached : boolean
  isConnected : boolean
  ngOnInit() {

    // if(navigator.onLine){
    //   return this.networkService.getUID().then( result => {
    //     console.log(result);
    //     if(result === true){
    //       this.isConnected = true
    //       this.isOnline = true
    //       this.isCached = true
    //       this.activatedRoute.queryParams.subscribe(result => {
    //         //this.item = result.item
    //         //console.log(this.item);
    //         console.log(result);
    //         this.refNo = result.refNo
    //         this.status = result.status
    //         let name = result.user
    //         this.userID = result.userID
    //         console.log(name);
    //         this.cell = result.cell
    //         this.getUser(this.userID)
    //         console.log(this.cell);
    //         this.routingPage = result.currentPage
    //         console.log(this.routingPage);
            
    //         this.getOrder(this.refNo, name)
    //         this.refreshPendingOrder()
    //       })
    //     }else{
    //       this.isConnected = false
    //     }
    //   })

    // }else{
    //   this.isOnline = false
    //   this.isCached = false
    // }

    this.activatedRoute.queryParams.subscribe(result => {
      console.log(result);
      this.refNo = result.refNo
      this.status = result.status
      let name = result.user
      this.userID = result.userID
      console.log(name);
      this.cell = result.cell
      // this.getUser(this.userID)
      console.log(this.cell);
      this.routingPage = result.currentPage
      console.log(this.routingPage);
      if(navigator.onLine){
        return this.networkService.getUID().then( result => {
          console.log(result);
          if(result === true){
            this.isConnected = true
            this.isOnline = true
            this.isCached = true
            this.getUser(this.userID)
            this.getOrder(this.refNo, name)
            this.refreshPendingOrder()
          }else{
            this.isConnected = false
          }
        })
      }else{
        this.isOnline = false
        this.isCached = false
      }
    })
 
  }
  createPDF(){

  }
  createPdfm(status, date) {
    return new Promise( (resolve, reject) => {
      console.log(this.pdfObj);
    
      let name = [];
      let quantity = [];
      let cost = [];
      // name.push('Product')
      // quantity.push('Quantity')
      // cost.push('Price')
      let deliveryAddress = this.deliveryAddress
      if(this.deliveryAddress === ''){
        deliveryAddress = 'N/A'
      }
      this.letterObj.address = deliveryAddress
      this.letterObj.from = 'Broken Stool'
      this.letterObj.to = this.name
    
      let items = this.products.map((item) => {
        //console.log('Extras in table...', item);
        if (this.products.length >= 0) {
  
          return [item.product_name, item.quantity, 'R' + item.cost + '.00'];
        } else {
          return ['*********', 0, 'R0.00']
        }
      });
      this.products.forEach((item) => {
        name.push(item.product_name);
        cost.push("R " + item.cost);
        quantity.push(item.quantity)
      })
      var docDefinition = {
        content: [
  
  
  
  
          { text: 'Your Receipt', style: 'header', color: "gray", bold: true, alignment: "left", fontFamily: 'Roboto', },
          {
            image:
              'data:image/jpeg;base64,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',
            fit: [100, 100], alignment: "right", marginBottom: 20,
          },
          // { text: new Date().toTimeString(), alignment: 'right' },
  
          { text: 'From', style: 'subheader', color: "black", bold: true, alignment: "left", fontFamily: 'Roboto', },
          { text: this.letterObj.from, color: "gray", bold: true, alignment: "left", fontFamily: 'Roboto', fontSize: 11, },
  
          { text: '530 Moilwa Drive', color: "gray"},
          { text: 'Kagiso', color: "gray"},
          { text: 'Mogale City', color: "gray"},
          { text: '1754', color: "gray"},
          { text: 'To', style: 'subheader', color: "black", bold: true },
          
          { text: this.letterObj.to, color: "gray", bold: true, alignment: "left", fontFamily: 'Roboto', fontSize: 11, },

          // Client's Address
          { text: this.letterObj.address, style: 'story', margin: [5, 2], color: "gray", italic: true, alignment: "left", fontFamily: 'Roboto', fontSize: 10, },

          // { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },
          { text: 'Reference number: ', style: 'subheader', color: "black", italic: true },
          { text: this.refNo, color: "gray", italic: true },
  
  
          { text: 'Date Of Purchase: ', style: 'subheader', color: "black", bold: true, alignment: "left", fontFamily: 'Roboto', fontSize: 13, },
          { text: this.purchaseDate, style: 'subheader', color: "gray", bold: true, alignment: "left", fontFamily: 'Roboto', fontSize: 12, },
  
          {
  
            layout: 'headerLineOnly',
            table: {
  
              widths: ['auto', 'auto', '20%'],
  
              body: [
  
                [{text : 'Product:'}, {text: 'Quantity'}, {text: 'Price'}],
                [{text: name, color: 'gray'}, {text: quantity, color: 'gray'}, {text: cost, color: 'gray'},],
                // [{ text: this.status, color: 'gray' }, '', { text: '100', color: 'gray', Border: false }],
                [{text: 'Subtotal:'}, {text: ' '}, {text: 'R ' + this.totalPrice}],
                [{text: 'Delivery fee:'}, {text: ' '}, {text: 'R ' + this.deliveryFee}],
                [{ text: 'TOTAL', bold: true, color: 'gray', lineHeight: 2, marginTop: 10, },{ text: ' ', bold: true, color: 'gray', lineHeight: 2, marginTop: 10 },{ text: 'R ' + this.grandTotal, bold: true, color: 'gray', lineHeight: 2, marginTop: 10 },]
              ]
            }
  
          },
  
          
          { text: 'Order Type: ' + this.deliveryType, style: 'story', margin: [5, 2], color: "gray", italic: true, alignment: "left", fontFamily: 'Roboto', fontSize: 11, },
  
          // { text: 'Order Address: ', style: 'story', margin: [5, 2], color: "gray", italic: true, alignment: "left", fontFamily: 'Roboto', fontSize: 11, },
  
  
          { text: 'Order Status: ' + status, style: 'story', margin: [5, 2], color: "gray", italic: true, alignment: "left", fontFamily: 'Roboto', fontSize: 13, },
          { text: 'Date ' + status.toLowerCase() + ': ' + date , style: 'story', margin: [5, 2], color: "gray", italic: true, alignment: "left", fontFamily: 'Roboto', fontSize: 13, },
        ],
  
  
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: 'center',
            width: '50%',
            lineHeight: 1.5,
          },
  
  
  
        },
  
        pageSize: 'A4',
        pageOrientation: 'portrait'
  
      };
      this.pdfObj = pdfMake.createPdf(docDefinition);
      console.log(this.pdfObj);

      resolve(this.pdfObj)
    })

  }
  reload() {
    if(navigator.onLine){
      return this.networkService.getUID().then( result => {
        console.log(result);
        if(result === true){
          this.isConnected = true
          this.isOnline = true
          this.isCached = true
          this.getUser(this.userID)
          this.getOrder(this.refNo, name)
          this.refreshPendingOrder()
        }else{
          this.isConnected = false
        }
      })
    }else{
      this.isOnline = false
      this.isCached = false
    }
  }
  checkConnectionStatus(){
    if(navigator.onLine){
      this.isOnline = true
      if(this.isCached === false){
        console.log('running still');
        
        this.reload()
      }else if(this.isCached === true){
        clearInterval(this.timer)
      }
    }else{
      this.isOnline = false
      if(this.pageLoader){
        this.loadingCtrl.dismiss()
        this.pageLoader = false
        //clearInterval(this.timer)
      }
    }
    
  }
  timer
  pageLoader : boolean
  ionViewDidEnter(){
    if(this.isCached !== true){

    }
    this.timer = setInterval( () => {
      this.checkConnectionStatus()
    }, 3000)
  }
  ionViewDidLeave(){
    clearInterval(this.timer)
  }
  signOutPopup(){
    this.presentLogoutConfirmAlert()
  }
  async presentLogoutConfirmAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'You are about to sign out',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: (okay) => {
            console.log('Confirm Okay');
            return this.signOut()
          }
        }
      ]
    });
​
    await alert.present();
  }
  signOut(){
    return this.authService.signOut().then(result => {
    })
  }
  getUser(userID){
    this.presentLoading()
    this.pageLoader = true
    return this.productsService.loadUser(userID).then(result => {
      console.log(result);
      this.cell = result.cell
      this.name = result.name
      this.userAddress = result.address
    })
  }
getOrder(refNo, name){
  //this.presentLoading()
 return this.productsService.getOrderDetails(refNo).then(result => {
    this.item = result[0]
    this.item['details'].name = name
    this.products = this.item['details']['product']
    this.quantity = this.products.length
    this.deliveryType = this.item['details']['deliveryType']
    this.totalPrice = this.item['details']['totalPrice']
    console.log(this.deliveryType);
    
    if(this.deliveryType === 'Delivery'){
      this.deliveryAddress = this.userAddress
      this.deliveryFee = this.item['details']['deliveryCost']
      this.grandTotal = this.totalPrice + this.deliveryFee
    }else if(this.deliveryType === 'Collection'){
      this.deliveryAddress = ''
      this.deliveryFee = 0
      this.grandTotal = this.totalPrice
    }
    this.purchaseDate = moment(new Date(this.item['details']['timestamp'])).format('DD/MM/YYYY')
    this.countQuantity()

  })
}
async presentLoading() {
  const loading = await this.loadingCtrl.create({
    message: 'Loading...',
  });
  await loading.present();
}
countQuantity(){
  console.log('runnig checks');
  
  this.totalQuantity = 0
  for(let key in this.products){
    this.totalQuantity = this.totalQuantity + this.products[key].quantity
  }
  console.log(this.totalQuantity);
  if(this.pageLoader === true){
    console.log('asddsfs');
    
    this.loadingCtrl.dismiss()
  }
}
goBack(){
  this.route.navigate([this.routingPage])
}

​status : string;
cancelOrderConfirmed(){
  let status = 'cancelled'
  this.presentLoading()
  return this.productsService.cancelOrder(this.refNo, status, this.userID, this.products,  this.purchaseDate).then(result => {
    this.loadingCtrl.dismiss()
    this.route.navigate([this.routingPage])

  })
}
processOrder(){
  this.presentLoading()
  let status
  // if(this.item['details']['status'] === 'Order recieved' || this.item['details']['status'] === 'received'){
    status = 'processed'
  // }
  return this.productsService.processOrder(this.refNo, status).then(result => {
    //window.location.reload()
    //this.refreshPendingOrder()
    if(result === 'success'){
    firebase.firestore().collection('Order').doc(this.refNo).onSnapshot({includeMetadataChanges: true}, result => {
       // console.log(result.metadata);
        //console.log(result);
        if(result.exists){
          let status = result.data().status
          this.status = status
          console.log(status);
        }

        
        // for(let key in result.docChanges()){
        //   let change = result.docChanges()[key]
        //   console.log(change);
          
        //   if(change.type === 'added'){
        //     console.log('New item was added');
        //     console.log(result.docChanges()[key]);
        //     console.log(change.doc.data());
        //     let data : object = {}
        //     data = change.doc.data().status
        //     console.log(status);
        //     this.status = status
        //   }
        // }

      })
      
      this.loadingCtrl.dismiss()
    }
  })
​
}
orderReady(){
  this.presentLoading()
  let status = 'ready'
  return this.productsService.processOrder(this.refNo, status).then(result => {
    //console.log(result);
    
    //window.location.reload()
    if(result === 'success'){
    firebase.firestore().collection('Order').doc(this.refNo).onSnapshot({includeMetadataChanges: true}, result => {
        //console.log(result.metadata);
        //console.log(result);
        if(result.exists){
          let status = result.data().status
          this.status = status
        }



      })
      
      this.loadingCtrl.dismiss()
    }
  })
}
orderCollected(){
  this.presentLoading()
  let status;
  let date = new Date().getTime()
  let convertedDate = moment(date).format('MMMM, DD YYYY HH:MM')
  console.log(date);
  console.log(convertedDate);
  
  
  //this.presentLoading()
  if(this.deliveryType === 'Collection'){
    status = 'Collected'
    this.createPdfm(status, convertedDate).then( (result : File) => {
      let you : File
      console.log(you);
      
      let pdf : File = result
      console.log(pdf);
      //this.pdfObj.download()
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        console.log(blob);
              return this.productsService.closedOrders(this.refNo, status, this.userID, this.products, this.deliveryType, this.purchaseDate, date, blob).then(result => {
        this.loadingCtrl.dismiss()
        this.route.navigate([this.routingPage])
      })
      })
      // return this.productsService.closedOrders(this.refNo, status, this.userID, this.products, this.deliveryType, this.purchaseDate, date, this.pdfObj).then(result => {
      //   this.loadingCtrl.dismiss()
      //   this.route.navigate([this.routingPage])
      // })
    })

  }else if(this.deliveryType === 'Delivery'){
    status = 'Delivered'
    this.createPdfm(status, convertedDate).then( (result : File) => {
      

      //console.log(you);
      let pdf : File = result


      console.log(pdf);
      //this.pdfObj.download()
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        console.log(blob);
              return this.productsService.closedOrders(this.refNo, status, this.userID, this.products, this.deliveryType, this.purchaseDate, date, blob).then(result => {
        this.loadingCtrl.dismiss()
        this.route.navigate([this.routingPage])
      })
      })
      // return this.productsService.closedOrders(this.refNo, status, this.userID, this.products, this.deliveryType, this.purchaseDate, date, this.pdfObj).then(result => {
      //   this.loadingCtrl.dismiss()
      //   this.route.navigate([this.routingPage])
      // })
    })

  }
  console.log(status);
  

}
refreshPendingOrder(){
  return this.productsService.refreshPendingOrder(this.refNo).then(result => {

    this.status = result
    console.log(this.status);
    
    console.log(result);
    
  })
}
cancelOrder(){
  console.log("logging deletion");
  
  const alert = document.createElement('ion-alert');
  alert.header = 'Confirm Cancellation';
  alert.message = 'Are you sure you want to remove this item from pending orders?';
  alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary', 
      handler: (blah) => {
        console.log('User canceled');
      }
    }, {
      text: 'Remove',
      handler: () => {
        console.log('Confirm Okay')
  
        // console.log(productID);
        // console.log(item);
        this.presentLoading()
        let status = 'cancelled'
        this.presentLoading()
        return this.productsService.cancelOrder(this.refNo, status, this.userID, this.products,  this.purchaseDate).then(result => {
          this.loadingCtrl.dismiss()
          this.route.navigate([this.routingPage])
      
        })
      }
    }
  ];

  document.body.appendChild(alert);
  return alert.present();
  
}
}