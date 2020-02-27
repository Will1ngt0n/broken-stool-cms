import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { RouteService } from '../services/route-services/route.service';

@Component({
  selector: 'app-summer-gear',
  templateUrl: './summer-gear.page.html',
  styleUrls: ['./summer-gear.page.scss'],
})
export class SummerGearPage implements OnInit {
  sales : Array<any> = []
  brands : Array<any> = []
  allSales : Array<any> = []
  allProducts : Array<any> = []
  inventory : Array<any> = []
  history : Array<any> = []
  pendingOrders : Array<any> = []
  addForm : boolean 
  formHasValues : boolean 
  department : any
  picture : File
  searchArray
  searchInput
  departmentOptions : Array<any> = ['Select Department', 'Dankie Jesu', 'Kwanga']
  kwangaCategories : Array<any> = ['Formal', 'Traditional', 'Smart Casual', 'Sports Wear']
  dankieJesuCategories : Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags', 'Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  categoryOptions: Array<any> = ['Select Category']
  inventoryItems :  Array<any> = []
  summer : boolean;
  winter : boolean = false
  kwanga : boolean = false
  selectedCategory: any
  itemName : String
  price : String
  description: String
  size : Array<any> = []
  color : Array<any> = []
  colors : Object = {};
  accessory : boolean;
  summerGear : Array<any> = []
  winterGear : Array<any> = []
  kwangaGear : Array<any> = []
  kwangaProducts : Array<any> = []
  dankieJesuProducts : Array<any> = []
  summerProducts : Array<any> = []
  winterProducts : Array<any> = []
  orderedWinterProducts : Array<any> = []
  orderedSummerProducts : Array<any> = []
  seasonalWear : Array<any> = []
  status = ['ready', 'recieved', 'collected', 'processed', 'cancelled']
  blackAvailable; blackPic
  brownAvailable;  brownPic
  orangeAvailable; orangePic
  yellowAvailable;  yellowPic
  whiteAvailable; whitePic
  miniSearchBarState: boolean = false;


  constructor(private routeService : RouteService, private alertController : AlertController, private authService : AuthService, private navCtrl : NavController, public route : Router, public productService : ProductsService) {

  }
  ngOnInit() {

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

    await alert.present();
  }
  signOut(){
    return this.authService.signOut().then(result => {
      console.log(result);
    })
  }

  viewMore(query){
    this.route.navigate(['/'+ query])
  }

  navigateForward(value){
    // return this.routeService.storeParemeter(value, 'Dankie Jesu', 'Summer Gear', 'summer-gear').then(result => {
    //   this.route.navigate(['/items-list', value])
    // })

  }
  back(){
    this.route.navigate(['/landing'])
  }
  
  showPendingList() {
    var historyItems = document.getElementsByClassName("pending-items") as HTMLCollectionOf<HTMLElement>;
    historyItems[0].style.display = "block"
  }
  showHistoryList() {
    var pendingItems = document.getElementsByClassName("history-items") as HTMLCollectionOf<HTMLElement>;
    pendingItems[0].style.display = "block"
  }
  showInventoryList() {
    var inventoryItems = document.getElementsByClassName("inventory-items") as HTMLCollectionOf<HTMLElement>;
    inventoryItems[0].style.display = "block"
  }
  dismissList() {
    var historyItems = document.getElementsByClassName("history-items") as HTMLCollectionOf<HTMLElement>;
    historyItems[0].style.display = "none";
    var pendingItems = document.getElementsByClassName("pending-items") as HTMLCollectionOf<HTMLElement>;
    pendingItems[0].style.display = "none";
    var inventoryItems = document.getElementsByClassName("inventory-items") as HTMLCollectionOf<HTMLElement>;
    inventoryItems[0].style.display = "none"
  }

  showLeftSide() {
    console.log("Showing left side menu");
    document.getElementById("left-items-list").style.left = "0"
  }
  searchButtonState:string = "search"
  showSearchBar() {
    console.log("Showing searchbar");
    if (this.miniSearchBarState == true) {
      this.miniSearchBarState = false;
      console.log(this.miniSearchBarState);
      this.searchButtonState = "search"
    }
    else {
      this.miniSearchBarState = true;
      console.log(this.miniSearchBarState);
      this.searchButtonState = "close"
    }
  }
  showRightSide() {
    console.log("Showing right side menu");
    document.getElementById("right-items-list").style.right = "0"

  }

  sideMenuButtons: boolean = true;
  hideSideMenu() {
    this.sideMenuButtons = true
    document.getElementById("left-items-list").style.left = "-100%"
    document.getElementById("right-items-list").style.right = "-100%"
  }
  listOfItems: number = 0
  showPendingListSmall(){
    this.sideMenuButtons = false;
    this.listOfItems = 1;
  }
  showHistoryListSmall(){
    this.sideMenuButtons = false;
    this.listOfItems = 2;
  }
  showInventoryListSmall(){
    this.sideMenuButtons = false;
    this.listOfItems = 3;
  }
  stepBackToBtns(){
    this.sideMenuButtons = true;
    this.listOfItems = 0;
  }
  reloadPage(){
    location.reload()
  }
}
