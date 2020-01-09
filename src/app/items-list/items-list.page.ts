import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import * as firebase from 'firebase'
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {
  currentCategory
  kwangaCategories: Array<any> = ['Formal', 'Traditional', 'Smart Casual', 'Sports Wear']
  dankieJesuCategories: Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags', 'Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  //summerCategories : Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags']
  //winterCategories : Array<any> = ['Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  allItems: Array<any> = []
  currentViewedItems: Array<any> = [] //products under the category and brand the user just clicked on in previous pages
  price
  description
  quantity
  searchInput
  searchArray
  name
  productName
  pictures: Array<any> = []
  //promos and updates
  //promos
  itemName; itemPrice; itemDescription; itemBrand; itemCategory; itemID; itemImageLink; itemSizes; itemColors
  editName; editPrice; editDescription; editBrand; editCategory; editID; editPercentage; editStartDate; editEndDate
  
  checkXS : boolean; checkS : boolean; checkM : boolean; checkL : boolean; checkXL : boolean; checkXXL : boolean; checkXXXL : boolean;
  checkRed: boolean; checkBlue : boolean; checkGreen : boolean; checkYellow : boolean; checkPink : boolean; checkWhite : boolean
  //updates
  updateName; updatePrice; updateDescription; updateColors: Array<any> = []; updateSizes: Array<any> = []

  //pricePercentage; priceNumber; startDate; endDate
  promoUdpate: string;
  link
  title
  sales: Array<any> = []
  brands: Array<any> = []
  allSales: Array<any> = []
  allProducts: Array<any> = []
  inventory: Array<any> = []
  history: Array<any> = []
  pendingOrders: Array<any> = []
  addForm: boolean
  formHasValues: boolean
  department: any
  picture: File
  departmentOptions: Array<any> = ['Select Department', 'Dankie Jesu', 'Kwanga']
  categoryOptions: Array<any> = ['Select Category']
  inventoryItems: Array<any> = []
  summer: boolean;
  winter: boolean = false
  kwanga: boolean = false
  selectedCategory: any
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

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef
  @ViewChild('departmentCombo', { static: true }) departmentCombo: ElementRef
  @ViewChild('nativeCategory', { static: true }) nativeCategory: ElementRef
  @ViewChild('checkboxXS', { static: true }) checkboxXS: ElementRef
  @ViewChild('checkboxS', { static: true }) checkboxS: ElementRef
  @ViewChild('checkboxM', { static: true }) checkboxM: ElementRef
  @ViewChild('checkboxL', { static: true }) checkboxL: ElementRef
  @ViewChild('checkboxXL', { static: true }) checkboxXL: ElementRef
  @ViewChild('checkboxXXL', { static: true }) checkboxXXL: ElementRef
  @ViewChild('checkboxXXXL', { static: true }) checkboxXXXL: ElementRef
  
  @ViewChild('checkboxBlack', { static: true }) checkboxBlack: ElementRef
  @ViewChild('checkboxBrown', { static: true }) checkboxBrown: ElementRef
  @ViewChild('checkboxOrange', { static: true }) checkboxOrange: ElementRef
  @ViewChild('checkboxYellow', { static: true }) checkboxYellow: ElementRef
  @ViewChild('checkboxWhite', { static: true }) checkboxWhite: ElementRef
  @ViewChild('btnClearForm', { static: true }) btnClearForm: ElementRef


  constructor(private alertController: AlertController, private authService: AuthService, private activatedRoute: ActivatedRoute, private productsService: ProductsService, public route: Router) {
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
    // let date = moment(new Date()).format('LLLL');
    // let tee = moment(new Date('10/12/2019')).format('LLLL')
    // console.log(date);
    // console.log(tee);
    // if(date > tee){
    //   console.log(date);

    // }
    this.orderItems()

    // for (let key in this.status) {
    //   this.getPendingOrders(this.status[key])
    // }
    //this.getPendingOrders()
    //this.getReadyOrders()
    //this.getClosedOrders()
    this.getInventory()
  }
  signOutPopup() {
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
  signOut() {
    return this.authService.signOut().then(result => {
      console.log(result);

    })
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
      this.nativeCategory.nativeElement.disabled = true
    } else {
      this.nativeCategory.nativeElement.disabled = false
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
    if (this.selectedCategory === undefined || this.selectedCategory === 'Select Category' || this.department === undefined || this.department === 'Select Department' || this.size.length === 0 || this.color.length === 0 || this.itemName === '' || this.description === '' || this.price === '' || this.fileInput.nativeElement.value === '' || this.picture === undefined) {
      this.addForm = false
      console.log(this.addForm);

    } else {
      this.addForm = true
      console.log(this.addForm);
    }
    if (this.department !== undefined || this.department !== 'Select Department' || this.selectedCategory !== 'Select Category' || this.selectedCategory !== undefined || this.size.length !== 0 || this.color.length !== 0 || this.itemName !== '' || this.description !== '' || this.price !== '' || this.fileInput.nativeElement.value !== '' || this.picture !== undefined) {
      this.formHasValues = true
      console.log(this.formHasValues, 'form has values');
      // this.btnClearForm.nativeElement.disabled = false
    }
    // else {
    //   this.formHasValues = false
    //   console.log(this.formHasValues, 'form has values');
    //   //this.btnClearForm.nativeElement.disabled = true
    // }
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
  addPicture(event) {
    this.picture = <File>event.target.files[0]
    // let name = event.target.name
    // let pictureName = name
    // this.itemName = pictureName.replace('-', ' ')
    // this.description = this.itemName
  }
  // addItem() {
  //   this.route.navigate(['/'])
  // }
  // addProduct() {
  //   return this.productsService.addItem(this.department, this.selectedCategory, this.itemName, this.description, this.price, this.size, this.accessory, this.summer, this.color, this.picture).then(result => {
  //     this.clearForm();
  //     console.log('added to first firebase')
  //   }).then(result => {
  //   })
  // }

  //Clearing all form variables and form inputs respectively
  clearForm() {
    this.departmentOptions = ['Select Department', 'Dankie Jesu', 'Kwanga']
    this.categoryOptions = ['Select Category']
    this.selectedCategory = ''
    this.itemName = ''
    this.price = ''
    this.description = ''
    this.size = [];
    this.picture = undefined
    document.getElementById('accessory')['checked'] = false;
    document.getElementById('summer')['checked'] = false;
    this.fileInput.nativeElement.value = ''
    this.departmentCombo.nativeElement.value = 'Select Department'
    let checkboxes: Array<any> = ['checkboxXS', 'checkboxS', 'checkboxM', 'checkboxL', 'checkboxXL', 'checkboxXXL', 'checkboxXXXL', 'checkboxBlack', 'checkboxBrown', 'checkboxOrange', 'checkboxYellow', 'checkboxWhite']
    let checkboxesNative: Array<any> = [this.checkboxXS, this.checkboxS, this.checkboxM, this.checkboxL, this.checkboxXL, this.checkboxXXL, this.checkboxXXXL, this.checkboxBlack, this.checkboxBrown, this.checkboxOrange, this.checkboxYellow, this.checkboxWhite]
    for (let i = 0; i < checkboxes.length; i++) {
      document.getElementsByName(checkboxes[i])[0]['checked'] = false
      checkboxesNative[i].nativeElement.checked = false
    }
    this.formHasValues = false
    this.addForm = false
    this.department = 'Select Department'
    this.selectedCategory = 'Select Category'
  }

  //Routing to sales page
  // viewSales(query){
  //   console.log(query);
  //   let navOptions = {
  //     queryParams : {query : query}
  //   }
  //   //this.navCtrl.navigateForward(['sales-specials'], navOptions)    
  // }

  // viewMore(query){
  //   this.route.navigate(['/'+ query])
  // }

  loadKwangaItems() {
    let category: String
    for (let key in this.kwangaCategories) {
      category = this.kwangaCategories[key]
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
  //Loading items from the category and brand the user just clicked on in the previous pages
  loadCategoryItems(category, brand) {
    let data: Array<any> = []
    // return this.productsService.loadCategoryItems(category, brand).then(result => {
    //   if (result !== undefined) {
    //   }
    //   console.log(result);

    //   for (let key in result) {
    //     console.log(result[key]);
    //     this.currentViewedItems.push(result[key])
    //   }
    //   //this.loadPictures()
    //   console.log('mine');

    // }).then(result => {
    //   console.log(result);

    //   //this.loadPictures()
    // })

  }
  loadCategoryItemsSnap(category, brand){
    return firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      //console.log(result.docs);
      //console.log(result);
      let data : Array<any> = []
      for(let key in result.docs){
      //  console.log('sdfdsfs');
      //  console.log(result.docs[key].data());
        let productID = result.docs[key].id
        let docData = result.docs[key].data()
        console.log(docData);
        
        data.push({productID: productID, data: docData, category: category, brand: brand})
      }
      console.log(data);
      this.currentViewedItems = data
      //console.log(data);
      if(data.length !== 0){
        return data
      }
    })
  }
  async loadPictures() {
    return this.productsService.getPictures().then(result => {
      console.log(result);
      let pictures: Array<any> = []
      for (let key in result.items) {
        result.items[key].getDownloadURL().then(link => {
          let path = result.items[key].fullPath
          let splitPath = path.split('/')
          let pictureID = splitPath[splitPath.length - 1]
          // picture['link'] = link
          // picture['productID'] = pictureID
          this.pictures.push({ link: link, productID: pictureID })
          console.log(this.pictures);
          this.insertPictures()
        });
      }

      //return pictures
    })
  }

  insertPictures() {
    for (let i in this.pictures) {
      //Adding pictures to allProducts arrays
      for (let key in this.allProducts) {
        if (this.pictures[i].productID === this.allProducts[key].productID) {
          console.log('ddsfds');
          this.allProducts[key].pictures = { link: this.pictures[i].link }
          console.log(this.allProducts[key])
        }
      }
      //Adding pictures to items on the current view
      for (let key in this.currentViewedItems) {
        if (this.pictures[i].productID === this.currentViewedItems[key].productID) {
          this.currentViewedItems[key].pictures = { link: this.pictures[i].link }
          console.log(this.currentViewedItems[key]);
        }
      }
    }
  }
  loadItems(category, brand) {
    let data: Array<any> = []
    return this.productsService.loadCategoryItems(category, brand).then(result => {
      if (result !== undefined) {
      }
      //console.log(result);

      for (let key in result) {
        if (brand === 'Kwanga') {
          this.kwangaProducts.push(result[key])
          this.allProducts.push(result[key])
        } else if (brand === 'Dankie Jesu') {
          this.dankieJesuProducts.push(result[key])
          this.allProducts.push(result[key])
          if (result[key].data.isSummer === true) {
            this.summerProducts.push(result[key])
          } else if (result[key].data.isSummer === false) {
            this.winterProducts.push(result[key])
          }
        }
      }
      if (this.summerProducts.length > 0) {
      } else if (this.winterProducts.length > 0) {
      }

    })
  }
  orderItems() {
    this.summerProducts.sort((a, b) => a.data.dateAdded > b.data.dateAdded ? 1 : 0)
    this.winterProducts.sort((a, b) => a.data.dateAdded > b.data.dateAdded ? 1 : 0)
    for (let i = 0; i < 5; i++) { this.summerGear.push(this.summerProducts[i]) }
    for (let i = 0; i < 5; i++) { this.winterGear.push(this.winterProducts[i]) }
  }
  getInventory() {
    console.log(this.allProducts, 'yugfg7g76gyg6gt7677');

  }
  getPendingOrders() {
    return this.productsService.getPendingOrders().then(result => {
      console.log(result);
      let array = result
      if (result.length !== 0) {
        for (let key in result) {
          this.pendingOrders.push(result[key])
          console.log(this.pendingOrders);
        }
        for (let key in this.pendingOrders) {
          this.loadUserName(this.pendingOrders[key].details.userID)
        }
      }
    })
  }
  loadUserName(data) {

    // // return this.productService.loadUser(ID).then(result => {
    // //   this.pendingOrders[key].name = result
    // //   console.log(this.pendingOrders);
    // // })
    // return this.productsService.loadUser(data).then(result => {
    //   console.log(result);
    //   for (let key in this.pendingOrders) {
    //     if (this.pendingOrders[key].details.userID === result.userID) {
    //       this.pendingOrders[key].details.name = result.name
    //       this.pendingOrders[key].details.cell = result.cell
    //     }
    //   }
    //   console.log(this.pendingOrders);

    // })
    // //thisgffdsg


  }
  getReadyOrders() {
    // return this.productsService.getReadyOrders().then(result => {
    // })
  }

  // get orders that are closed, history, status == closed
  getClosedOrders() {
    // return this.productsService.getOrderHistory().then(result => {

    // })
  }
  closeOrder(docID) {
    // return this.productsService.closedOrder(docID).then(result => {

    // })
  }





  //////native to this page
  ngOnInit() {
    return this.authService.checkingAuthState().then(result => {
      if (result == null) {
        this.route.navigate(['/login'])
      } else {
        this.activatedRoute.queryParams.subscribe(result => {
          console.log(result);
          this.currentCategory = result.category
          let brand = result.brand
          this.title = result.title
          console.log(this.title)
          this.link = result.link
          console.log(this.link);


          console.log(brand);
          console.log(this.currentCategory);
          console.log(this.currentCategory);
          this.loadCategoryItems(this.currentCategory, brand)
          this.loadCategoryItemsSnap(this.currentCategory, brand)
          // this.loadPictures().then(result => {
          //   console.log(result);

          // })
        })
      }
    })

  }
  // loadKwangaItems(){
  //   let category : String
  //   for(let key in this.kwangaCategories){
  //     category  = this.kwangaCategories[key]
  //     this.loadItems(category, 'Kwanga').then(result => {
  //       console.log(result);

  //     })
  //   }
  // }
  // loadDankieJesuItems(){
  //   let category : String
  //   for(let key in this.dankieJesuCategories){
  //     category = this.dankieJesuCategories[key]
  //     this.loadItems(category, 'Dankie Jesu')
  //   }
  // }
  // loadViewedCategory(){

  // }

  back() {
    this.route.navigate(['/landing'])
  }
  navigate() {
    this.route.navigate(['/' + this.link])
  }
  // loadItems(category, brand){
  //   //console.log(1234);
  //   let data : Array<any> = []
  //   return this.productsService.loadCategoryItems(category, brand).then(result => {
  //     console.log(result);
  //     for(let key in result){
  //       console.log(result);
  //       //this.allItems.push(result[key])
  //       this.currentViewedItems.push(result[key])
  //     }
  //     //console.log(this.allItems);
  //   })
  // }
  promoteItem() {
    console.log(this.editPercentage);
    console.log(this.editStartDate);
    console.log(this.editEndDate);
    console.log(this.itemID);
    let price = this.itemPrice - this.itemPrice * this.editPercentage / 100
    console.log(price);


    return this.productsService.promoteItem(price, this.editPercentage, this.editStartDate, this.editEndDate, this.itemBrand, this.itemCategory, this.itemID, this.itemName, this.itemImageLink, this.itemDescription, this.selectedItem).then(result => {
      console.log(result);
      if(result === 'success'){
        console.log(result);
        return this.dismissPromo()
      }else(
        alert('An error occurred, please retry')
      )
    })
  }
  async deleteItem(productID, brand, category, item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('User clicked "cancel"');
          }
        }, {
          text: 'Delete',
          handler: (okay) => {
            console.log('User clicked "okay"');
            return this.deleteItemConfirmed(productID, brand, category, item)
          }
        }
      ]
    });

    await alert.present();
  }
  deleteItemConfirmed(productID, brand, category, item) {
    
    return this.productsService.deleteItemFromInventory(productID, brand, category, item).then(result => {
      console.log(result);
      //location.reload()
    })
  }
  hideItem(productID, brand, category) {
    return this.productsService.hideProduct(productID, brand, category).then(result => {
      console.log(result);
    })
  }
  showItem(productID, brand, category) {
    return this.productsService.showProduct(productID, brand, category).then(result => {
      console.log(result);
      // firebase.firestore().collection('Products').doc(brand).collection(category).doc(productID).onSnapshot( result => {
      //   let hideItem = result.data().hideItem
        
      // })
    })
  }
  reloadPage(){
    window.location.reload()

  }
  pictureUpdate : File
  updateItem() {
    console.log(this.updateName, this.updatePrice, this.updateDescription, this.itemID, this.itemBrand, this.itemCategory, this.itemSizes, this.itemColors);
    //console.log(this.updateName);

    return this.productsService.updateItemsListItem(this.itemID, this.itemBrand, this.itemCategory, this.updatePrice, this.updateDescription, this.updateName, this.itemSizes, this.pictureUpdate, this.itemColors).then(result => {
      console.log(result);
        setTimeout(() => {
          //this.reloadPage()
        }, 30);
      if (result === 'success') {
        console.log(result);
        return this.dismissPromo()
      }
    })
  }
  addPictureUpdate(event){
    this.pictureUpdate = <File>event.target.files[0]
  }
  submitUpdatedItem(itemName, itemPrice, itemDescription) {

  }
  toggleUpdate(productID, brand, category, name, description, price, imageLink, sizes, colors) {
    var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf<HTMLElement>;

    promoUpd[0].style.display = "flex";
    this.promoUdpate = "Update item"
    this.updateName = name
    this.updatePrice = price
    this.updateDescription = description
    this.itemBrand = brand
    this.itemCategory = category
    this.itemID = productID
    this.itemImageLink = imageLink
    this.itemSizes = sizes
    this.itemColors = colors
    console.log(this.itemSizes);
    console.log(this.itemColors);
    
    console.log(this.checkboxXS);
    this.checkXS =false ;this.checkS =false ;this.checkM =false ;this.checkL =false ;this.checkXL =false ;this.checkXXL =false ;this.checkXXXL =false ;
    this.checkRed = false; this.checkBlue = false; this.checkGreen = false; this.checkYellow = false; this.checkPink = false; this.checkWhite = false
    for(let key in this.itemSizes){
      if(this.itemSizes[key] === 'XS'){
        this.checkXS = true
        this.updateSizes.push('XS')
      }else if(this.itemSizes[key] === 'S'){
        this.checkS = true
        this.updateSizes.push('S')
      }else if(this.itemSizes[key] === 'M'){
        this.checkM = true
        this.updateSizes.push('M')
      }else if(this.itemSizes[key] === 'L'){
        this.checkL = true
        this.updateSizes.push('XL')
      }else if(this.itemSizes[key] === 'XL'){
        this.checkXL = true
        this.updateSizes.push('XXL')
      }else if(this.itemSizes[key] === 'XXL'){
        this.checkXXL = true
        this.updateSizes.push('XXL')
      }else if(this.itemSizes[key] === 'XXXL'){
        this.checkXXXL = true
        this.updateSizes.push('XXXL')
      }
    }
    for(let key in this.itemColors){
      if(this.itemColors[key] === 'Red'){
        this.checkRed = true
        this.updateSizes.push('XS')
      }else if(this.itemColors[key] === 'Blue'){
        this.checkBlue = true
        this.updateSizes.push('S')
      }else if(this.itemColors[key] === 'Green'){
        this.checkGreen = true
        this.updateSizes.push('M')
      }else if(this.itemColors[key] === 'Yellow'){
        this.checkYellow = true
        this.updateSizes.push('XL')
      }else if(this.itemColors[key] === 'Pink'){
        this.checkPink = true
        this.updateSizes.push('XXL')
      }else if(this.itemColors[key] === 'White'){
        this.checkWhite = true
        this.updateSizes.push('XXL')
      }
    }
  }
  selectedItem
  togglePromo(productID, brand, category, name, description, price, imageLink, item) {
    var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf<HTMLElement>;

    promoUpd[0].style.display = "flex";
    this.promoUdpate = "Promote item"
    this.itemName = name
    this.itemPrice = price
    this.itemDescription = description
    this.itemBrand = brand
    this.itemCategory = category
    this.itemID = productID
    this.itemImageLink = imageLink
    this.selectedItem = item
  }
  dismissPromo() {
    var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf<HTMLElement>;

    promoUpd[0].style.display = "none"
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

  checkSizeUpdateCheckboxes(event, size) {
    console.log(size);
    console.log(this.itemSizes);
    let checkbox = event.target['name']
    if (checkbox) {
      if (event.target.checked === true) {
        this.itemSizes.push(size)
        console.log(this.itemSizes);
      } else if (event.target.checked === false) {
        let index = this.itemSizes.indexOf(size)
        console.log(index);
        this.itemSizes.splice(index, 1)
        console.log(this.itemSizes);
      }
    }
    // console.log(event.target.checked);
    // console.log(event.target['name']);
  }
  checkColorUpdate(event, color){
    let checkbox = event.target['name']
    if(checkbox){
      if(event.target.checked === true){
        this.itemColors.push(color)
        console.log(this.itemColors);
      }else if(event.target.checked === false){
        let index = this.itemColors.indexOf(color)
        this.itemColors.splice(index, 1)
        console.log(this.itemColors);
      }
    }
  }
  //Search functionality
  search(query) {
    this.filterItems(query, this.allProducts)
    this.searchArray = []
  }
  filterItems(query, array) {
    let queryFormatted = query.toLowerCase();
    console.log(queryFormatted);
    console.log(array);
    if (queryFormatted !== '') {
      let nameResult = array.filter(item => item.data.name.toLowerCase().indexOf(queryFormatted) >= 0)
      let addBrand: boolean
      let addCategory: boolean
      let addName: boolean
      addName = false
      addCategory = false
      addBrand = false
      //console.log(brandResult);
      //console.log(categoryResult);
      console.log(nameResult);
      this.searchArray = nameResult
    } else if (queryFormatted === '') {
      this.searchArray = []
    }
  }
  colorsAndValue = []
  colorToggle(colorValue){
    document.getElementById(colorValue).style.boxShadow = "0px 3px 10px " + colorValue;
  }
}
