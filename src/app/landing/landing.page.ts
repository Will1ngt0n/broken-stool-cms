import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import { ProductsService } from '../services/products-services/products.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  sales : Array<any> = []
  brands : Array<any> = []
  allSales : Array<any> = []
  allProducts : Array<any> = []
  inventory : Array<any> = []
  history : Array<any> = []
  readyOrders : Array<any> = []
  pendingOrders : Array<any> = []
  addForm : boolean 
  formHasValues : boolean 
  department : any
  picture
  departmentOptions : Array<any> = ['Select Department', 'Dankie Jesu', 'Kwanga']
  kwangaCategories : Array<any> = ['Formal', 'Traditional', 'Smart Casual', 'Sports Wear']
  dankieJesuCategories : Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags', 'Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  categoryOptions: Array<any> = ['Select Category']
  inventoryItems :  Array<any> = []
  summer : boolean;
  winter : boolean = false
  kwanga : boolean = false
  selectedCategory: any
  itemName: String
  price: String
  description: String
  size: Array<any> = []
  color: Array<any> = []
  colors: Object = {};
  accessory: boolean;
  summerGear: Array<any> = []
  winterGear: Array<any> = []
  kwangaGear: Array<any> = []
  kwangaProducts: Array<any> = []
  dankieJesuProducts: Array<any> = []
  summerProducts: Array<any> = []
  winterProducts: Array<any> = []
  orderedWinterProducts: Array<any> = []
  orderedSummerProducts: Array<any> = []
  seasonalWear: Array<any> = []
  status = ['ready', 'recieved', 'collected', 'processed', 'cancelled']
  blackAvailable; blackPic
  brownAvailable; brownPic
  orangeAvailable; orangePic
  yellowAvailable; yellowPic
  whiteAvailable; whitePic
  constructor(public navCtrl: NavController, public route: Router, public authService: AuthService, public productService: ProductsService) {
    console.log(this.department);
    //this.productService.getCategories()
    this.loadDankieJesuItems()
    this.loadKwangaItems()
    this.colors = { red: '' }
    this.accessory = false;
    this.summer = false;
    this.department = undefined
    this.addForm = false
    this.formHasValues = false
    let date = moment(new Date()).format('LLLL');
    let tee = moment(new Date('10/12/2019')).format('LLLL')
    console.log(date);
    console.log(tee);
    if (date > tee) {
      console.log(date);

    }
    this.orderItems()
    for(let key in this.status){
      this.getPendingOrders(this.status[key])
    }
 
    this.getReadyOrders()
    this.getClosedOrders()
    this.getInventory()
  }
  changeDepartment(event) {
    console.log('Accessory ', this.accessory);

    console.log(event.target['value']);
    this.department = event.target['value']
    if (this.department === 'Dankie Jesu') {
      this.categoryOptions = ['Select Category', 'Vests', 'Caps ', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies', 'Bags']
    }
    if (this.department === 'Kwanga') {
      this.categoryOptions = ['Select Category', 'Formal', 'Traditional', 'Smart Casual', 'Sports wear']
    }
    if (this.department === 'Select Department') {
      this.department = undefined
    }
    this.checkValidity()
  }
  isSummer(data) {
    if (data.target.checked === true) {
      this.summer = true;
    } else {
      this.summer = false;
    }
  }
  changeCategory() {
    console.log(event.target['value']);
    this.selectedCategory = event.target['value']
    if (this.selectedCategory === 'Select Category') {
      this.selectedCategory = undefined
    }
    this.checkValidity()
  }
  ngOnInit() {
  }

  ionViewDidEnter() {

  }
  isAccessory(data) {
    //console.log('My data ', data.target.checked);
    if (data.target.checked === true) {
      // console.log('Accessory');
      this.accessory = true;
    } else {
      this.accessory = false;
    }

  }
  check(event, size) {

    console.log(size);
    console.log(this.size);
    let checkbox = event.target['name']
    if (checkbox) {
      if (event.target.checked === true) {
        this.size.push(size)
        console.log(this.size);
      } else if (event.target.checked === false) {
        let index = this.size.indexOf(size)
        console.log(index);
        this.size.splice(index, 1)
        console.log(this.size);
      }
    }
    console.log(event.target.checked);
    console.log(event.target['name']);
    this.checkValidity()
  }
  checkValidity() {
    console.log(this.department);
    console.log(this.selectedCategory);
    console.log(this.itemName);
    console.log(this.description);
    console.log(this.price);
    console.log(this.size);
    console.log(this.color);

    if (this.selectedCategory === undefined || this.department === undefined || this.size.length === 0 || this.color.length === 0 || this.itemName === '' || this.description === '' || this.price === '') {
      this.addForm = false
      console.log(this.addForm);

    } else {
      this.addForm = true
      console.log(this.addForm);
    }
    if (this.department !== undefined || this.selectedCategory !== undefined || this.size.length !== 0 || this.color.length !== 0 || this.itemName !== '' || this.description !== '' || this.price !== '') {
      this.formHasValues = true
      console.log(this.formHasValues);

    } else {
      this.formHasValues = false
      console.log(this.formHasValues);
    }
  }
  checkColor(event, color) {
    this.checkValidity()
    console.log(color);
    console.log(this.size);
    let checkbox = event.target['name']
    if (checkbox) {
      if (event.target.checked === true) {
        this.color.push(color)
        console.log(this.color);
        // if(color === 'Black'){
        //   this.blackAvailable = true
        // }else if(color === 'Brown'){
        //   this.brownAvailable = true
        // }else if(color === 'Orange'){
        //   this.orangeAvailable = true
        // }else if(color === 'Yellow'){
        //   this.yellowAvailable = true
        // }else{
        //   this.whiteAvailable = true
        // }
      } else if (event.target.checked === false) {
        let index = this.color.indexOf(color)
        console.log(index);
        this.color.splice(index, 1)
        console.log(this.color);
      }
    }
    console.log(event.target.checked);
    console.log(event.target['name']);
    this.checkValidity()
  }

  addItem() {
    this.route.navigate(['/'])
  }
  addProduct() {
    console.log(this.department);
    console.log(this.selectedCategory);
    console.log(this.itemName);
    console.log(this.description);
    console.log(this.price);
    console.log(this.size);
    let date = moment(new Date()).format('LLLL');
    console.log(date);
    console.log(this.picture);
    
    return this.productService.addItem(this.department, this.selectedCategory, this.itemName, this.description, this.price, this.size, this.accessory, this.summer, this.color, this.picture).then(result => {
      this.clearForm();
    })


  }

  //Clearing all form variables and form inputs respectively
  clearForm() {
    this.departmentOptions = ['Select Department']
    this.departmentOptions = ['Select Department', 'Dankie Jesu', 'Kwanga']
    this.categoryOptions = ['Select Category']
    this.selectedCategory = ''
    this.itemName = ''
    this.price = ''
    this.description = ''
    this.size = [];
    document.getElementById('accessory')['checked'] = false;
    document.getElementById('summer')['checked'] = false;
    let checkboxes: Array<any> = ['checkboxXS', 'checkboxS', 'checkboxM', 'checkboxL', 'checkboxXL', 'checkboxXXL', 'checkboxXXXL', 'checkboxBlack', 'checkboxBrown', 'checkboxOrange', 'checkboxYellow', 'checkboxWhite']
    for (let i = 0; i < checkboxes.length; i++) {
      document.getElementsByName(checkboxes[i])[0]['checked'] = false
    }
    this.formHasValues = false
    this.department = undefined
    this.selectedCategory = undefined
  }

  //Routing to sales page
  viewSales(query) {
    console.log(query);
    let navOptions = {
      queryParams: { query: query }
    }
    this.navCtrl.navigateForward(['sales-specials'], navOptions)
  }

  viewMore(query){
    this.route.navigate(['/'+ query])
  }
  
  loadKwangaItems(){
    let category : String
    for(let key in this.kwangaCategories){
      category  = this.kwangaCategories[key]
      this.loadItems(category, 'Kwanga')
      
    }
  }
  loadDankieJesuItems() {
    let category: String
    for (let key in this.dankieJesuCategories) {
      category = this.dankieJesuCategories[key]
      this.loadItems(category, 'Dankie Jesu')
    }
  }
  loadViewedCategory() {

  }
  loadItems(category, brand){
    let data : Array<any> = []
    return this.productService.loadCategoryItems(category, brand).then(result => {
      if(result !== undefined){
      }
      for(let key in result){
        if(brand === 'Kwanga'){
          this.kwangaProducts.push(result[key])
          this.allProducts.push(result[key])
          console.log(this.allProducts);
          
        }else if(brand === 'Dankie Jesu'){
          this.dankieJesuProducts.push(result[key])
          this.allProducts.push(result[key])
          if(result[key].data.isSummer === true){
            this.summerProducts.push(result[key])
          } else if (result[key].data.isSummer === false) {
            this.winterProducts.push(result[key])
          }
        }
      }
      if(this.summerProducts.length > 0 ){
      }else if(this.winterProducts.length > 0){   
      }

      })
      }
      orderItems(){
        this.summerProducts.sort(( a , b  ) => a.data.dateAdded > b.data.dateAdded ? 1 : 0 )
        this.winterProducts.sort(( a , b  ) => a.data.dateAdded > b.data.dateAdded ? 1 : 0 )
        for(let i = 0; i < 5; i++){this.summerGear.push(this.summerProducts[i])}
        for(let i = 0; i < 5; i++){this.winterGear.push(this.winterProducts[i])}
      }
  getInventory(){
    console.log(this.allProducts, 'yugfg7g76gyg6gt7677');
    
  }
  getPendingOrders(status){
    return this.productService.getPendingOrders(status).then(result => {
      console.log(result);
      let array = result
      if(result.length !== 0){
        for(let key in result){
          this.pendingOrders.push(result[key])
          console.log(this.pendingOrders);
        }
        for(let key in this.pendingOrders){
          this.loadUserName(this.pendingOrders[key].details.userID)
        }
      }
    })
  }
  loadUserName(data){

      // return this.productService.loadUser(ID).then(result => {
      //   this.pendingOrders[key].name = result
      //   console.log(this.pendingOrders);
      // })
    return this.productService.loadUser(data).then(result => {
      console.log(result);
      for(let key in this.pendingOrders){
        if(this.pendingOrders[key].details.userID === result.userID){
          this.pendingOrders[key].details.name = result.name
          this.pendingOrders[key].details.cell = result.cell
        }
      }
      console.log(this.pendingOrders);
      
    })
    //thisgffdsg

    
  }
  getReadyOrders(){
    return this.productService.getReadyOrders().then(result => {
      this.readyOrders = result
    })
  }

  // get orders that are closed, history, status == closed
  getClosedOrders(){
    return this.productService.getClosedOrders().then(result => {
      this.history = result
    })
  }
  closeOrder(docID){
    return this.productService.closedOrder(docID).then(result => {
      
    })
  }

  //console.log(this.allItems);

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
  subtract(item){
    console.log(item.productID);
    for(let key in this.allProducts){
      if(this.allProducts[key].productID === item.productID){
        this.allProducts[key].data.quantity = this.allProducts[key].data.quantity - 1
      }
    }
  }
  add(item){
    console.log(item);
    for(let key in this.allProducts){
      if(this.allProducts[key].productID === item.productID){
        this.allProducts[key].data.quantity = this.allProducts[key].data.quantity + 1
      }
    }
  }
  changePrice(event, item){
    console.log(item);
    //console.log(event);
    let number = document.getElementById(item.productID)['value']
    console.log(number)
    for(let key in this.allProducts){
      if(this.allProducts[key].productID === item.productID){
        this.allProducts[key].data.quantity = number
      }
    }
    
  }
  saveQuantity(brand, category, productID, quantity){
    console.log(brand, category, productID, quantity);
    if(quantity === ''){
      quantity = 0
    }
    return this.productService.updateQuantity(brand, category, productID, quantity).then(result => {
      console.log(result);
    })
  }
  viewPendingOrder(item){
    console.log(item);
    let parameter : NavigationExtras = {queryParams : {refNo: item.refNo, userID: item.details.userID, user: item.details.name, cell: item.details.cell, currentPage: '/landing'}}
    this.navCtrl.navigateForward(['pending-order'], parameter);
  }
  log(){
    console.log(this.picture);
  }

  addPicture(){
    
  }
}