import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
​​import * as moment from 'moment'
import { NetworkService } from '../services/network-service/network.service';
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
  totalPrice : number
  quantity
  cell
  totalQuantity : Number
  deliveryType
  deliveryAddress
  deliveryFee : number
  grandTotal : number
  userAddress
  datePurchased
  routingPage
  timer

  @ViewChild('loaderDiv', {static: true}) loaderDiv : ElementRef
  constructor(private render: Renderer2, private networkService : NetworkService, public loadingCtrl: LoadingController, private alertController : AlertController, private authService : AuthService, private activatedRoute : ActivatedRoute, private productsService : ProductsService, private route : Router) {
​ 
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();
  
    // const { role, data } = await loading.onDidDismiss();
  
    // console.log('Loading dismissed!');
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
​   dateClosed
  status : string = ''
  getOrderHistory(refNo, name){
    return this.productsService.getOrderHistoryDetails(refNo).then(result => {
      this.item = result[0]
      console.log(this.item);
      
      this.status = this.item['details']['status']
      console.log(this.status);
      
      this.products = this.item['details']['orders']
      //this.dateClosed = this.item['details']['timestamp']
      this.deliveryType = this.item['details']['deliveryType']
      if(this.deliveryType === 'Delivery'){
        this.deliveryAddress = this.userAddress
        this.deliveryFee = this.item['details']['deliveryCost']
      }
      this.datePurchased = this.item['details']['purchaseDate']
      this.dateClosed = moment(new Date(this.item['details']['timestamp'])).format('DD/MM/YYYY')
      this.countQuantity()
      this.countTotalPrice()
    })
  }
  countTotalPrice(){
    this.totalPrice = 0
    for(let key in this.products){
      this.totalPrice = this.totalPrice + this.products[key].quantity * this.products[key].cost
    }
    if(this.deliveryType === 'Delivery'){
      if(this.item['details']['deliveryCost']){
        this.deliveryFee = this.item['details']['deliveryCost']
        this.grandTotal = this.totalPrice + this.deliveryFee
      }else{
        this.deliveryFee = 100
        this.grandTotal = this.totalPrice + this.deliveryFee 
      }
    }else if(this.deliveryType === 'Collection'){
      this.deliveryFee = 0
      this.grandTotal = +this.totalPrice
    }
    if(this.pageLoader){
     this.loadingCtrl.dismiss()     
    }
    this.dismissLoader()

   }
   countQuantity(){
     this.totalQuantity = 0
     for(let key in this.products){
       this.totalQuantity = this.totalQuantity + this.products[key].quantity
     }
   }
   goBack(){
     this.route.navigate(['/landing'])
   }
   isOnline : boolean
   isCached : boolean
   isConnected : boolean
   pageLoader : boolean
  ngOnInit() {
    if(navigator.onLine){

      return this.networkService.getUID().then( result => {
        if(result === true){
          this.isConnected = true
          this.isOnline = true
          this.isCached = true
          this.activatedRoute.queryParams.subscribe(result => {
            this.refNo = result.refNo
            let name = result.user
            this.userID = result.userID
            this.getUser(this.userID)
            this.cell = result.cell
            this.routingPage = result.link
            //this.presentLoading()
            this.getOrderHistory(this.refNo, name)
            this.loadPictures().then(result => {       
            })
            })
        }else{
          this.isConnected = false
        }
      })

    }else{
      this.isOnline = false
      this.isCached = false
    }
  }
  reload() {
    if(navigator.onLine){
      return this.networkService.getUID().then( result => {
        if(result === true){
          this.isConnected = true
          this.isOnline = true
          this.isCached = true
          clearInterval(this.timer)
          this.activatedRoute.queryParams.subscribe(result => {
            this.refNo = result.refNo
            let name = result.user
            this.userID = result.userID
            this.getUser(this.userID)
            this.cell = result.cell
            this.routingPage = result.link
            //this.presentLoading()
            this.getOrderHistory(this.refNo, name)
            // this.loadPictures().then(result => {
            //   console.log(result);
              
            // })
          })
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
      console.log(this.isCached);
      if(this.isCached === false){
        this.reload()
      }else if(this.isCached === true){
        clearInterval(this.timer)
      }
    }else{
      this.isOnline = false
      if(this.pageLoader){
        this.loadingCtrl.dismiss()
        this.pageLoader = false
      }
    }
  }
  ionViewDidEnter(){
    console.log('ion view did enter');
    console.log(this.isCached);
    if(this.isCached !== true){
      // this.presentLoading()
      // this.pageLoader = true
    }
    this.timer = setInterval( () => {
      this.checkConnectionStatus()
    }, 3000)
  }
  ionDidLeave(){
    clearInterval(this.timer)
  }
  getUser(userID){
    // this.presentLoading()
    this.pageLoader = true
    return this.productsService.loadUser(userID).then(result => {
      console.log(result);
      this.userAddress = result.address
      this.cell = result.cell
      if(result.name){
        this.name = result.name
      }else{
        this.name = 'Undefined'
      }


      // if(this.pageLoader === true){
      //   this.loadingCtrl.dismiss()
      // }
    })
  }
  async loadPictures(){
    // return this.productsService.getPictures().then(result => {
    //   console.log(result);
    //   let pictures : Array<any> = []
    //   for(let key in result.items){
    //     result.items[key].getDownloadURL().then(link => {
    //       let path = result.items[key].fullPath
    //       let splitPath = path.split('/')
    //       let pictureID = splitPath[splitPath.length -1]
    //       // picture['link'] = link
    //       // picture['productID'] = pictureID
    //       this.pictures.push({link : link, productID : pictureID})
    //       console.log(this.pictures);
    //       this.insertPictures()
    //      });
    //      return result
    //     }

    // })
  }
  
  insertPictures(){
    // for(let i in this.pictures){
    //   //Adding pictures to products arrays
    //   for(let key in this.products){
    //     if(this.pictures[i].productID === this.products[key].productID){
    //       console.log('ddsfds');
    //       this.products[key].pictures = {link: this.pictures[i].link}
    //       console.log(this.products[key])
    //     }
    //   }
    // }
  }
  dismissLoader() {
    try {
      this.render.addClass(this.loaderDiv.nativeElement, 'hidden')
    } catch (error) {
      console.warn(error)
      this.loaderDiv.nativeElement.class = 'hidden'
    }
    console.log(this.loaderDiv)
  }
}