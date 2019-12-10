import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController } from '@ionic/angular';
​import * as moment from 'moment'
@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.page.html',
  styleUrls: ['./order-receipt.page.scss'],
})
export class OrderReceiptPage implements OnInit {
  item : Object = {}
  refNo : String = ''
  name : String = ''
  products : Array<any> = []
  pictures : Array<any> = []
  userID
  totalPrice
  quantity
  cell
  totalQuantity : Number
  routingPage
  dateOrdered
  constructor(private alertController : AlertController, private authService : AuthService, private activatedRoute : ActivatedRoute, private productsService : ProductsService, private route : Router) {
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
​
  getOrderHistory(refNo, name){
    return this.productsService.getOrderHistoryDetails(refNo).then(result => {
      console.log(result)
       this.item = result
       //this.item['details'].name = name
       console.log(this.item);
      this.products = this.item['details']['orders']
      let time = this.item['details']['date']
      this.dateOrdered = moment(new Date(time)).format('DD/MM/YYYY')
      console.log(this.dateOrdered);
      
      //  this.quantity = this.products.length
      //this.totalPrice = this.item['details']['totalPrice']
       console.log(this.products);
      this.countQuantity()
      this.countTotalPrice()
     })
   }
   countTotalPrice(){
    this.totalPrice = 0
    for(let key in this.products){
      this.totalPrice = this.totalPrice + this.products[key].quantity * this.products[key].cost
      
    }
    console.log(this.totalPrice);
    
   }
   countQuantity(){
     this.totalQuantity = 0
     for(let key in this.products){
       this.totalQuantity = this.totalQuantity + this.products[key].quantity
​
     }
     console.log(this.totalQuantity);
     
   }
   goBack(){
     this.route.navigate([this.routingPage])
   }
  ngOnInit() {
    return this.authService.checkingAuthState().then( result => {
      if(result == null){
        this.route.navigate(['/login'])
      }else{
        this.activatedRoute.queryParams.subscribe(result => {
          console.log(result);
          
          //this.item = result.item
          //console.log(this.item);
          console.log(result);
          this.refNo = result.refNo
          let name = result.user
          this.userID = result.userID
          console.log(this.userID);
          this.getUser(this.userID)
          console.log(name);
          this.cell = result.cell
          console.log(this.cell);
          this.routingPage = result.link
          console.log(this.routingPage);
          
          this.getOrderHistory(this.refNo, name)
          this.loadPictures().then(result => {
            console.log(result);
            
          })
    
        })
      }
    })
​
  }
  getUser(userID){
    return this.productsService.loadUser(userID).then(result => {
      console.log(result);
      this.cell = result.cell
      this.name = result.name
    })
  }
  async loadPictures(){
    return this.productsService.getPictures().then(result => {
      console.log(result);
      let pictures : Array<any> = []
      for(let key in result.items){
        result.items[key].getDownloadURL().then(link => {
          let path = result.items[key].fullPath
          let splitPath = path.split('/')
          let pictureID = splitPath[splitPath.length -1]
          // picture['link'] = link
          // picture['productID'] = pictureID
          this.pictures.push({link : link, productID : pictureID})
          console.log(this.pictures);
          this.insertPictures()
         });
         return result
        }
    })
  }
  
  insertPictures(){
    for(let i in this.pictures){
      //Adding pictures to products arrays
      for(let key in this.products){
        if(this.pictures[i].productID === this.products[key].productID){
          console.log('ddsfds');
          this.products[key].pictures = {link: this.pictures[i].link}
          console.log(this.products[key])
        }
      }
    }
  }
​
}