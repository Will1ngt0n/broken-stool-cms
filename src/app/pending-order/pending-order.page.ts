import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
declare var window
@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.page.html',
  styleUrls: ['./pending-order.page.scss'],
})
export class PendingOrderPage implements OnInit {
  item : Object = {}
  refNo : String = ''
  name : String = ''
  products : Array<any> = []
  userID
  totalPrice
  quantity
  pictures : Array<any> = []
  cell
  totalQuantity : Number
  routingPage
  ​status
  time
  deliveryType
  deliveryAddress
  constructor(private alertController : AlertController, private authService : AuthService, private route : Router, private activatedRoute : ActivatedRoute, private productsService: ProductsService) { }
​
  ngOnInit() {
    return this.authService.checkingAuthState().then( result => {
      if(result == null){
        this.route.navigate(['/login'])
      }else{
        this.activatedRoute.queryParams.subscribe(result => {
          //this.item = result.item
          //console.log(this.item);
          console.log(result);
          this.refNo = result.refNo
          let name = result.user
          this.userID = result.userID
          console.log(name);
          this.cell = result.cell
          console.log(this.cell);
          this.routingPage = result.currentPage
          console.log(this.routingPage);
          
          this.getOrder(this.refNo, name)
        })
      }
    })
​
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
      console.log(result);
    })
  }
getOrder(refNo, name){
 return this.productsService.getOrderDetails(refNo).then(result => {
   console.log(result);
   
    this.item = result
    this.item['details'].name = name
    //console.log(this.item);
    let timestamp = this.item['details']['timestamp']
    //console.log(timestamp);
    this.time = moment(new Date(timestamp)).format('DD/MM/YYYY')
    //console.log(this.time);
    let deliveryType = this.item['details']['deliveryType']
    if(deliveryType === 'Collect'){
      this.deliveryType = 'Collection'
    }else if(deliveryType === 'Deliver'){
      this.deliveryType = 'Delivery'
    }

    this.deliveryAddress = this.item['details']['address']
    console.log(this.deliveryAddress);
    
    console.log(this.deliveryType);
    
    this.totalQuantity = this.item['totalQuantity']
    this.products = this.item['details']['product']
    this.quantity = this.products.length
    this.totalPrice = this.item['details']['totalPrice']
    this.status = this.item['details']['status']
  })
}

goBack(){
  this.route.navigate([this.routingPage])
}
​
cancelOrder(){
  let status = 'cancelled'
  return this.productsService.cancelOrder(this.refNo, status, this.userID, this.products).then(result => {
    this.route.navigate([this.routingPage])
  })
}
processOrder(){
  let status
  // if(this.item['details']['status'] === 'Order recieved' || this.item['details']['status'] === 'received'){
    status = 'processed'
  // }
  return this.productsService.processOrder(this.refNo, status).then(result => {
    window.location.reload()
  })
​
}
orderReady(){
  let status = 'ready'
  return this.productsService.processOrder(this.refNo, status).then(result => {
    window.location.reload()
  })
}
orderCollected(){
  let status = 'collected'
  return this.productsService.closedOrders(this.refNo, status, this.userID, this.products).then(result => {
    this.route.navigate([this.routingPage])
  })
}
}