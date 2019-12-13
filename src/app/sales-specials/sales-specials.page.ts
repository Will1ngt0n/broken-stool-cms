import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController } from '@ionic/angular';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-sales-specials',
  templateUrl: './sales-specials.page.html',
  styleUrls: ['./sales-specials.page.scss'],
})
export class SalesSpecialsPage implements OnInit {
  sales : Array<any> = []
  brands : Array<any> = []
  DJSales : Array<any> = []
  kwangaFullSales : Array<any> = []
  allBrandSales : Array<any> = []
  query
  kwangaSales : Array<any> = []
  dankieJesuSales : Array<any> = []
  allSales : Array<any> = []
  kwangaCategories : Array<any> = ['Formal', 'Traditional', 'Smart Casual', 'Sports Wear']
  dankieJesuCategories : Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags', 'Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  ///////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  searchInput
  searchArray : Array<any> = []
  allProducts : Array<any> = []
  inventory : Array<any> = []
  history : Array<any> = []
  pendingOrders : Array<any> = []
  readyOrders : Array<any> = []
  addForm : boolean 
  formHasValues : boolean 
  department : any
  picture : File
  pictures : Array<any> = []
  departmentOptions : Array<any> = ['Select Department', 'Dankie Jesu', 'Kwanga']
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
  blackAvailable; blackPic
  brownAvailable;  brownPic
  orangeAvailable; orangePic
  yellowAvailable;  yellowPic
  whiteAvailable; whitePic
  newPrice; newPricePercentage; newStartDate; newEndDate
  promoUpdate
  miniSearchBarState : boolean = false

  @ViewChild('fileInput', {static:true}) fileInput : ElementRef
  @ViewChild('departmentCombo', {static : true}) departmentCombo : ElementRef
  @ViewChild('nativeCategory', {static : true}) nativeCategory : ElementRef
  @ViewChild('checkboxXS', {static : true}) checkboxXS : ElementRef
  @ViewChild('checkboxS', {static : true}) checkboxS : ElementRef
  @ViewChild('checkboxM', {static : true}) checkboxM : ElementRef
  @ViewChild('checkboxL', {static : true}) checkboxL : ElementRef
  @ViewChild('checkboxXL', {static : true}) checkboxXL : ElementRef
  @ViewChild('checkboxXXL', {static : true}) checkboxXXL : ElementRef
  @ViewChild('checkboxXXXL', {static : true}) checkboxXXXL : ElementRef
  @ViewChild('checkboxBlack', {static : true}) checkboxBlack : ElementRef
  @ViewChild('checkboxBrown', {static : true}) checkboxBrown : ElementRef
  @ViewChild('checkboxOrange', {static : true}) checkboxOrange : ElementRef
  @ViewChild('checkboxYellow', {static : true}) checkboxYellow : ElementRef
  @ViewChild('checkboxWhite', {static : true}) checkboxWhite : ElementRef
  @ViewChild('btnClearForm', {static : true}) btnClearForm : ElementRef
  constructor(private alertController : AlertController, private authService : AuthService, public route : Router, public activatedRoute : ActivatedRoute, public productsService : ProductsService) {

    //this.getDankieJesuSales('Dankie Jesu')




    this.loadAll()
    //this.getKwangaSales('Kwanga')
    this.iterateThrough()


    console.log(this.department);
    //this.productsService.getCategories()
    this.loadDankieJesuItems()
    this.loadKwangaItems()
    this.colors = { red: '' }
    this.accessory = false;
    this.summer = false;
    this.department = undefined
    this.addForm = false
    this.formHasValues = false
    //this.loadSummerItems()

    //this.loadBrandProducts()

    //this.getSummerItems()
    console.log(this.department);
    // this.getAllItems()
   // this.orderItems()

    this.getPendingOrders()
    this.getReadyOrders()
    this.getClosedOrders()
    this.getInventory()
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
  ngOnInit() {
    return this.authService.checkingAuthState().then( result => {
      if(result == null){
        this.route.navigate(['/login'])
      }else{
        //this.loadPictures()
        this.activatedRoute.queryParams.subscribe(params => {
          console.log(params);
          this.query = params['query']
          console.log(this.query);
          if(this.query === 'viewAll'){
            this.toggleAll()
          }else if(this.query === 'Dankie Jesu'){
           this.toggleDankie()
          }else{
            this.toggleKwanga()
          }
          this.loadPictures().then(result => {
            console.log(result);
            
          })
        })
      }
    })

  }
  getKwangaSales(query){
    for(let i in this.allSales){
      if(this.allSales[i].brand === query){
        this.kwangaSales.push(this.allSales[i])
      }
    }
    console.log(this.kwangaSales);
  }
  getDankieJesuSales(query){
    for(let i in this.allSales){
      if(this.allSales[i].brand === query){
        this.dankieJesuSales.push(this.allSales[i])
      }
    }
    console.log(this.dankieJesuSales);
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
        }
    })
  }
  insertPictures(){  
    for(let i in this.pictures){
      //Adding pictures to products arrays
      for(let key in this.kwangaFullSales){
        if(this.pictures[i].productID === this.kwangaFullSales[key].productID){
          console.log('ddsfds');
          this.kwangaFullSales[key].pictures = {link: this.pictures[i].link}
          console.log(this.kwangaFullSales[key])
        }
      }
      for(let key in this.DJSales){
        if(this.pictures[i].productID === this.DJSales[key].productID){
          console.log('ddsfds');
          this.DJSales[key].pictures = {link: this.pictures[i].link}
          console.log(this.DJSales[key])
        }
      }
      for(let key in this.allBrandSales){
        if(this.pictures[i].productID === this.allBrandSales[key].productID){
          console.log('ddsfds');
          this.allBrandSales[key].pictures = {link: this.pictures[i].link}
          console.log(this.allBrandSales[key])
        }
      }
      
    }
  }
  
  toggleDankie() {
    //console.log(document.getElementById('dankie'));
    // console.log(this.allSales);
    // console.log(this.kwangaSales);
    // console.log(this.DJSales);
    // console.log(this.allBrandSales);
    // console.log(this.dankieJesuSales);
    // console.log(this.kwangaFullSales);
    this.brandName = "Dankie Jesu"
    console.log(this.dankieJesuSales);
    
    // alert("dankie")
    var kwa = document.getElementById("kwanga").style.background = "white";
    var kwa = document.getElementById("kwanga").style.color = "#7c0000";

    var dan = document.getElementById("dankie").style.background = "#7c0000";
    var dan = document.getElementById("dankie").style.color = "white";

    var allSubs = document.getElementById("allSubs").style.background = "white";
    var allSubs = document.getElementById("allSubs").style.color = "#7c0000";
  }

  toggleKwanga() {
    // console.log(this.allSales);
    // console.log(this.kwangaSales);
    // console.log(this.DJSales);
    // console.log(this.allBrandSales);
    // console.log(this.dankieJesuSales);
    // console.log(this.kwangaFullSales);
    this.brandName = "Kwanga Apparel";

    // alert("Kwanga")
    var kwa = document.getElementById("kwanga").style.background = "#7c0000";
    var kwa = document.getElementById("kwanga").style.color = "white";

    var dan = document.getElementById("dankie").style.background = "white";
    var dan = document.getElementById("dankie").style.color = "#7c0000";

    var allSubs = document.getElementById("allSubs").style.background = "white";
    var allSubs = document.getElementById("allSubs").style.color = "#7c0000";

  }
  

  brandName: string = "All"
  toggleAll() {
    // console.log(this.allSales);
    // console.log(this.kwangaSales);
    // console.log(this.DJSales);
    // console.log(this.allBrandSales);
    // console.log(this.dankieJesuSales);
    // console.log(this.kwangaFullSales);

    this.brandName = "All"
    console.log(this.allBrandSales);
    
    // alert("All")
    var kwa = document.getElementById("kwanga").style.background = "white";
    var kwa = document.getElementById("kwanga").style.color = "#7c0000";

    var dan = document.getElementById("dankie").style.background = "white";
    var dan = document.getElementById("dankie").style.color = "#7c0000";

    var allSubs = document.getElementById("allSubs").style.background = "#7c0000";
    var allSubs = document.getElementById("allSubs").style.color = "white";

  }
  brandNameS: string = "All"
  back(){
    this.route.navigate(['/landing'])
  }
  
  loadAll(){}

  iterateThrough(){
    console.log(this.kwangaCategories);
    for(let key in this.dankieJesuCategories){
      console.log(this.dankieJesuCategories[key]);
      this.loadCategoryItems('Dankie Jesu', this.dankieJesuCategories[key])
    }
    for(let key in this.kwangaCategories){
      this.loadCategoryItems('Kwanga', this.kwangaCategories[key])
    }
  }
  loadCategoryItems(brand, category){
    return this.productsService.getAllSales(brand, category).then(result => {
      let array = []
      array = result
      if(array.length !== 0){
        for(let key in result){
          console.log(result[key]);
          if(brand === 'Dankie Jesu'){
            this.dankieJesuSales.push(result[key])
          }else if(brand === 'Kwanga'){
            this.kwangaSales.push(result[key])
          }
        }
        console.log(this.dankieJesuSales);
        //console.log(this.kwangaSales);
        //console.log(this.sales);
        for(let key in this.dankieJesuSales){
          console.log(this.dankieJesuSales[key].productID)
          let productID = this.dankieJesuSales[key].productID
          let item = this.dankieJesuSales[key]
          this.loadProducts(brand, category, productID, item)
        }
        for(let key in this.kwangaSales){
          console.log(this.kwangaSales[key]);
          let productID = this.kwangaSales[key].productID
          let item = this.dankieJesuSales[key]
          this.loadProducts(brand, category, productID, item)
        }
      }
    })
  }
  loadProducts(brand, category, productID, item){
    this.productsService.getProduct(brand, category, productID, item).then(result => {
      //console.log(result);
      let array = []
      if(result.length !== 0){
        array = result
        console.log(array);
        if(brand === 'Dankie Jesu' && array.length !== 0){
          this.DJSales.push(result[0])
          this.allBrandSales.push(result[0])
        }else if(brand === 'Kwanga' && array.length !== 0){
          this.kwangaFullSales.push(result[0])
          this.allBrandSales.push(result[0])
        }
        console.log(this.DJSales);     
      }

    })
  }

deleteItem(item, productID){
  console.log("logging deletion");
  
  const alert = document.createElement('ion-alert');
  alert.header = 'Confirm Deletion';
  alert.message = 'Are you sure you want to remove this item from specials?';
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
  
        console.log(productID);
        console.log(item);
        
        return this.productsService.deleteSpecialsItem(productID, item).then(result => {
          console.log(result);
        })
      }
    }
  ];

  document.body.appendChild(alert);
  return alert.present();
  
}

hideItem(item, productID){
  return this.productsService.hideItem(productID, item).then(result => {
    console.log(result);
  })
}

updateItem(productID, item){
  return this.productsService.updateSpecialsItem(productID, item, this.newPrice, this.newPricePercentage, this.newStartDate, this.newEndDate).then(result => {
    
  })
}
/////////Adding product form (validation and data retrieval)
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
  if(this.department === 'Select Department'){
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
  if(this.selectedCategory === 'Select Category'){
    this.selectedCategory = undefined
  }
  this.checkValidity()
}

ionViewDidEnter() {

}
isAccessory(data) {
  if (data.target.checked === true) {
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
checkValidity(){
  console.log(this.department);
  console.log(this.selectedCategory);
  console.log(this.itemName);
  console.log(this.description);
  console.log(this.price);
  console.log(this.size);
  console.log(this.color);

  if(this.selectedCategory === undefined || this.department === undefined || this.size.length === 0 || this.color.length === 0 || this.itemName === '' || this.description === '' || this.price === ''){
    this.addForm = false
    console.log(this.addForm);
    
  }else{
    this.addForm = true
    console.log(this.addForm);
  }
  if(this.department !== undefined || this.selectedCategory !== undefined||  this.size.length !== 0 || this.color.length !== 0 || this.itemName !== '' || this.description !== '' || this.price !== ''){
    this.formHasValues = true
    console.log(this.formHasValues);
    
  }else{
    this.formHasValues = false
    console.log(this.formHasValues);
  }
}
checkColor(event, color){
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
    return this.productsService.addItem(this.department, this.selectedCategory, this.itemName, this.description, this.price, this.size, this.accessory, this.summer, this.color, this.picture).then(result => {
      this.clearForm();
    })
}
addPicture(event){
  this.picture = <File>event.target.files[0]
  console.log(<File>event.target.files)
  console.log(this.picture);
  
}

//Clearing all form variables and form inputs respectively
clearForm() {
  this.departmentOptions = ['Select Department']
  this.departmentOptions = ['Select Department', 'Dankie Jesu', 'Kwanga']
  this.categoryOptions = ['Select Category']
  this.selectedCategory = '';  this.itemName = '';  this.price = '';  this.description = ''
  this.size = [];
  document.getElementById('accessory')['checked'] = false;
  document.getElementById('summer')['checked'] = false;
  let checkboxes : Array<any> = ['checkboxXS', 'checkboxS', 'checkboxM', 'checkboxL', 'checkboxXL', 'checkboxXXL', 'checkboxXXXL', 'checkboxBlack', 'checkboxBrown', 'checkboxOrange', 'checkboxYellow', 'checkboxWhite']
  for(let i = 0; i < checkboxes.length; i++){
    document.getElementsByName(checkboxes[i])[0]['checked'] = false
  }
  this.formHasValues = false;  this.department = undefined;  this.selectedCategory = undefined
}

viewMore(query){
  this.route.navigate(['/'+ query])
}

loadKwangaItems(){
  let category : String
  console.log(this.kwangaCategories);
  console.log('run this shixt again');
  
  
  for(let key in this.kwangaCategories){
    category  = this.kwangaCategories[key]
    this.loadItems(category, 'Kwanga')
    console.log(this.kwangaCategories[key]);
    console.log('kwanga is here');
    
  }
}
loadDankieJesuItems(){
  let category : String
  console.log('fgdfgdfggdgdg');
  
  for(let key in this.dankieJesuCategories){
    category = this.dankieJesuCategories[key]
    this.loadItems(category, 'Dankie Jesu')
  }
}
loadViewedCategory(){
  
}
loadItems(category, brand){
  let data : Array<any> = []
  return this.productsService.loadCategoryItems(category, brand).then(result => {
    if(result !== undefined){
      //console.log(result);
    }
    for(let key in result){
      if(brand === 'Kwanga'){
        this.kwangaProducts.push(result[key])
       // console.log(this.kwangaProducts);
        this.allProducts.push(result[key])
      }else if(brand === 'Dankie Jesu'){
        //console.log('I belong to Dankie Jesu');
        this.dankieJesuProducts.push(result[key])
        this.allProducts.push(result[key])
        console.log(this.allProducts, 'I think i am running perfectly');
        }
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
  console.log(this.allProducts, 'inventory')
  
}
getPendingOrders(){
  // return this.productsService.getPendingOrders().then(result => {
  //   if(result.length !== 0){
  //     this.pendingOrders = result
  //     console.log(this.pendingOrders, 'pending orders');      
  //   }
  // })
}
getReadyOrders(){
  return this.productsService.getReadyOrders().then(result => {
    this.readyOrders = result
    console.log(this.readyOrders, 'ready orders');
  })
}
getClosedOrders(){
  return this.productsService.getOrderHistory().then(result => {
    if(result.length !== 0){
      this.history = result
      console.log(this.history, 'closed orders');
    }
  })
}
closeOrder(docID){
  return this.productsService.closedOrder(docID).then(result => {
    console.log(result);
    
  })
}
//Search functionality
search(query){
  this.filterItems(query, this.allProducts)
  this.searchArray = []
}
filterItems(query, array){
  let queryFormatted = query.toLowerCase();
  console.log(queryFormatted);
  console.log(array);
  if(queryFormatted !== ''){
    let nameResult = array.filter(item => item.data.name.toLowerCase().indexOf(queryFormatted) >= 0)
    let addBrand : boolean
    let addCategory : boolean
    let addName : boolean
    addName = false
    addCategory = false
    addBrand = false
    //console.log(brandResult);
    //console.log(categoryResult);
    console.log(nameResult);
    this.searchArray = nameResult
  }else if(queryFormatted === ''){
    this.searchArray = []
  }
}

toggleUpdate(item) {
  console.log(item);
  this.promoUpdate = 'Update item'
  console.log(this.promoUpdate);
  
  var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf<HTMLElement>;
  promoUpd[0].style.display = "flex";
  // this.promoUdpate = "Promote item"
  // this.itemName = name
  // this.itemPrice = price
  // this.itemDescription = description
  // this.itemBrand = brand
  // this.itemCategory = category
  // this.itemID = productID
  // this.newEndDate = 
  // this.newPrice = 
  // this.newPricePercentage =
  // this.newStartDate =

    //return array.filter(item => item.toLowerCase().indexOf(query) >= 0);
    //return queryFormatted






    
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

}
