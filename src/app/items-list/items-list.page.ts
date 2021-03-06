import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products-services/products.service';
import * as firebase from 'firebase'
import * as moment from 'moment'
import { AuthService } from '../services/auth-services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Location } from '@angular/common'
import { RouteService } from '../services/route-services/route.service';
import { NetworkService } from '../services/network-service/network.service';
import { LoginPage } from '../login/login.page';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit, OnDestroy {
  currentCategory
  kwangaCategories: Array<any> = ['Formal', 'Traditional', 'Smart Casual', 'Sports Wear']
  dankieJesuCategories: Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags', 'Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  //summerCategories : Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags']
  //winterCategories : Array<any> = ['Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats', 'Beanies']
  allItems: Array<any> = []
  currentViewedItems: Array<any> = [] //products under the category and brand the user just clicked on in previous pages
  price
  today
  endDateLimit

  description
  quantity
  searchInput : string = ''
  searchArray
  name
  productName
  pictures: Array<any> = []
  //promos and updates
  //promos
  itemName; itemPrice; itemDescription; itemBrand; itemCategory; itemID; itemImageLink; itemSizes; itemColors
  editName; editPrice; editDescription; editBrand; editCategory; editID; editPercentage; editStartDate; editEndDate
  promoButtonEnabled : boolean
  checkXS : boolean; checkS : boolean; checkM : boolean; checkL : boolean; checkXL : boolean; checkXXL : boolean; checkXXXL : boolean;
  checkBlack: boolean; checkBrown : boolean; checkOrange : boolean; checkYellow : boolean; checkWhite : boolean
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
  salePrice = 0;
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

  @ViewChild('loaderDiv', {static: true}) loaderDiv: ElementRef

  constructor(private render: Renderer2, private popover: PopoverController, private networkService : NetworkService, private routeService : RouteService, private loc: Location, public loadingCtrl: LoadingController, private alertController: AlertController, private authService: AuthService, private activatedRoute: ActivatedRoute, private productsService: ProductsService, public route: Router) {
    this.today = moment(new Date()).format('YYYY-MM-DD')
    this.isConnected = true
    this.isOnline = true
    this.isCached = true
    this.colors = { red: '' }
    this.accessory = false;
    this.summer = false;
    this.department = undefined
    this.addForm = false
    this.formHasValues = false
    this.promoButtonEnabled = false

  }
  goHome() {
    this.route.navigate(['/landing']);
  }
  async productAlert(message, header) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Okay',
          handler: (okay) => {
            console.log('User clicked "okay"');

          }
        }
      ]
    });

    await alert.present();
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
      //console.log(result);

    })
  }
  changeDepartment(event) {
    //console.log('Accessory ', this.accessory);

    //console.log(event.target['value']);
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
    //console.log(event.target['value']);
    this.selectedCategory = event.target['value']
    if (this.selectedCategory === 'Select Category') {
      this.selectedCategory = undefined
    }
    this.checkValidity()
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
        //clearInterval(this.timer)
      }
    }
  }
  timer
  ionViewDidEnter(){
    //console.log('ion view did enter');
    //console.log(this.isCached);
    console.log('we did enter bruh');
    console.log(this.pageLoader);
    
    // this.loadingCtrl.dismiss()
    if(this.isCached !== true){
      // this.presentLoading()
      // this.pageLoader = true
    }

    this.timer = setInterval( () => {
      this.checkConnectionStatus()
    }, 3000)
  }
  reload(){
    if(navigator.onLine){
      return this.networkService.getUID().then( result => {
        if(result === true){
          this.isConnected = true
          this.isOnline = true
          this.isCached = true
          clearInterval(this.timer)
          if(this.para !== 'All'){
            this.loadCategoryItemsSnap(this.currentCategory)
          }else if(this.para === 'All'){
            this.loadAllBrandProducts(this.para)
          }

        }else{
          this.isConnected = false
        }
      })
    }else{
      this.isOnline = false
      this.isCached = false
    }

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
    let checkbox = event.target['name']
    if (checkbox) {
      if (event.target.checked === true) {
        this.size.push(size)
      } else if (event.target.checked === false) {
        let index = this.size.indexOf(size)
        this.size.splice(index, 1)
      }
    }
    this.checkValidity()
  }
  checkValidity() {
    if (this.selectedCategory === undefined || this.selectedCategory === 'Select Category' || this.department === undefined || this.department === 'Select Department' || this.size.length === 0 || this.color.length === 0 || this.itemName === '' || this.description === '' || this.price === '' || this.fileInput.nativeElement.value === '' || this.picture === undefined) {
      this.addForm = false
    } else {
      this.addForm = true
    }
    if (this.department !== undefined || this.department !== 'Select Department' || this.selectedCategory !== 'Select Category' || this.selectedCategory !== undefined || this.size.length !== 0 || this.color.length !== 0 || this.itemName !== '' || this.description !== '' || this.price !== '' || this.fileInput.nativeElement.value !== '' || this.picture !== undefined) {
      this.formHasValues = true
    }
   }
  checkColor(event, color) {
    this.checkValidity()
    let checkbox = event.target['name']
    if (checkbox) {
      if (event.target.checked === true) {
        this.color.push(color)
      } else if (event.target.checked === false) {
        let index = this.color.indexOf(color)
        this.color.splice(index, 1)
      }
    }
    this.checkValidity()
  }
  addPicture(event) {
    this.picture = <File>event.target.files[0]
  }

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

  // loadKwangaItems() {
  //   let category: String
  //   for (let key in this.kwangaCategories) {
  //     category = this.kwangaCategories[key]
  //     this.loadItems(category, 'Kwanga')

  //   }
  // }
  // loadDankieJesuItems() {
  //   let category: String
  //   for (let key in this.dankieJesuCategories) {
  //     category = this.dankieJesuCategories[key]
  //     this.loadItems(category, 'Dankie Jesu')
  //   }
  // }
  loadViewedCategory() {

  }
  loadInventory(){
    return firebase.firestore().collection('Products').orderBy('timestamp', 'desc').onSnapshot(result => {
      let data : Array<any> = []
      for(let key in result.docs){
        if(result.docs[key].data().deleteQueue === false){
          let productID = result.docs[key].id
          let docData = result.docs[key].data()
          data.push({productID: productID, data: docData, category: docData.name, brand: docData.brand})
        }
      }
      this.currentViewedItems = data
      this.currentSelectedItems = data
      this.dismissLoader()
      console.log(this.currentViewedItems);
    })
  }
  //Loading items from the category and brand the user just clicked on in the previous pages
  loadAllBrandProducts(brandID){
    return firebase.firestore().collection('Products').where('brandID', '==', brandID).orderBy('timestamp', 'desc').onSnapshot(result => {
      let data : Array<any> = []
      for(let key in result.docs){
        if(result.docs[key].data().deleteQueue === false){
          let productID = result.docs[key].id
          let docData = result.docs[key].data()
          data.push({productID: productID, data: docData, category: docData.name, brand: docData.brand})
        }

      }
      this.currentViewedItems = data
      this.currentSelectedItems = data
      this.dismissLoader()
      console.log(this.currentViewedItems);
      
      //console.log(data);
      setTimeout( () => {
        try {
          this.loadingCtrl.dismiss()
        } catch (error) {
          
        }
        
      }, 1000)
      if(data.length !== 0){
        return data
      }
    })
  }
  async loadCategoryItemsSnap(category){
    // this.presentLoading()
    firebase.firestore().collection('Products').where('categoryID', '==', category).orderBy('timestamp', 'desc').onSnapshot(result => {
      let data : Array<any> = []
      for(let key in result.docs){
        if(result.docs[key].data().deleteQueue === false){
          let productID = result.docs[key].id
          let docData = result.docs[key].data()
          data.push({productID: productID, data: docData, category: category, brand: docData.brand})
        }

      }
      this.currentViewedItems = data
      this.currentSelectedItems = data
      console.log(this.currentViewedItems);
      
      //console.log(data);
      if(this.pageLoader){
        this.loadingCtrl.dismiss()
        this.pageLoader = false
        //clearInterval(this.timer)
      }
      // this.loadingCtrl.dismiss()
      this.dismissLoader()
      if(data.length !== 0){
        return data
      }
    })
  }
  async loadPictures() {
    return this.productsService.getPictures().then(result => {
      let pictures: Array<any> = []
      for (let key in result.items) {
        result.items[key].getDownloadURL().then(link => {
          let path = result.items[key].fullPath
          let splitPath = path.split('/')
          let pictureID = splitPath[splitPath.length - 1]
          this.pictures.push({ link: link, productID: pictureID })
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
        }
      }
      //Adding pictures to items on the current view
      for (let key in this.currentViewedItems) {
        if (this.pictures[i].productID === this.currentViewedItems[key].productID) {
          this.currentViewedItems[key].pictures = { link: this.pictures[i].link }
        }
      }
    }
  }
  // loadItems(category, brand) {
  //   let data: Array<any> = []
  //   return this.productsService.loadCategoryItems(category, brand).then(result => {
  //     if (result !== undefined) {
  //     }
  //     //console.log(result);

  //     for (let key in result) {
  //       if (brand === 'Kwanga') {
  //         this.kwangaProducts.push(result[key])
  //         this.allProducts.push(result[key])
  //       } else if (brand === 'Dankie Jesu') {
  //         this.dankieJesuProducts.push(result[key])
  //         this.allProducts.push(result[key])
  //         if (result[key].data.isSummer === true) {
  //           this.summerProducts.push(result[key])
  //         } else if (result[key].data.isSummer === false) {
  //           this.winterProducts.push(result[key])
  //         }
  //       }
  //     }
  //     if (this.summerProducts.length > 0) {
  //     } else if (this.winterProducts.length > 0) {
  //     }

  //   })
  // }
  orderItems() {
    this.summerProducts.sort((a, b) => a.data.dateAdded > b.data.dateAdded ? 1 : 0)
    this.winterProducts.sort((a, b) => a.data.dateAdded > b.data.dateAdded ? 1 : 0)
    for (let i = 0; i < 5; i++) { this.summerGear.push(this.summerProducts[i]) }
    for (let i = 0; i < 5; i++) { this.winterGear.push(this.winterProducts[i]) }
  }

  getSnaps(category, brand){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      let pictureLink
      for(let key in result.docChanges){
        let change = result.docChanges[key]
        if(change.type === 'modified'){
          let id = change.id
          pictureLink = change.data.pictureLink
          for(let i in this.currentViewedItems){
            if(this.currentViewedItems[i].productID === id){
              this.currentViewedItems[i].data['pictureLink'] = pictureLink
            }
          }
        }
      }
    })   
  }
  brand
  pictureLink
  para
  //////native to this page
  isOnline : boolean
  isConnected : boolean
  isCached : boolean
  pageLoader : boolean
  ngOnInit() {
    this.activatedRoute.params.subscribe(async (result) => {
      console.log(result);
      
      console.log(result.id);
      let para = result.id
      this.para = result.id
      let exists : boolean
      let reroute : boolean
      //this.load16CategoryItems()
      if(navigator.onLine){
        await this.networkService.getUID().then( result => {
          if(result === true){
            if(para === 'Inventory'){
              this.routeService.readInventoryParameter().then(result => {
                console.log(result);
                
                this.title = result['data'].name
                this.pictureLink = result['data'].pictureLink
                console.log(result['data'].name);
                
                console.log(this.pictureLink);
                
                this.currentCategory = para
                this.loadInventory()       // testing, bring this back
                this.loadInventorySnaps()  // testing, bring this back
              })
            } else if(para === 'specials') {
              
              this.title = 'Specials'
              this.currentCategory = [para]
              this.pictureLink = '../../assets/imgs/images.jpg'
              this.loadSales()
            }else if(para === 'All'){
              this.routeService.readBrandItemsListParameters().then(result => {
                console.log(result);
                let brandID = result['data'].brandID
                this.title = result['data'].name
                this.pictureLink = result['data'].pictureLink
                this.currentCategory = para + ' ' + this.title + ' products'
                this.loadAllBrandProducts(brandID)
              })
            }else if(para !== 'All'){
              this.routeService.readParameters().then(result => {
                console.log(result);
                this.title = result['data'].brand
                let categoryID = result['categoryID']
                console.log(categoryID);
                
                this.currentCategory = result['data'].name
                this.pictureLink = result['data'].pictureLink
                console.log(this.currentCategory);
                this.loadCategoryItemsSnap(categoryID)
              })
            }


           // this.orderItems()
           // this.getInventory()
            if(this.currentCategory !== '' && this.currentCategory !== undefined && this.brand !== '' && this.brand !== undefined){
              this.getSnaps(this.currentCategory, this.brand)
            }else {            
            }
            this.promoUdpate = ''
  
          }else{
            this.isConnected = false
          }
        })  
      }else{
        this.isOnline = false
      }


    })


  }
  ionViewWillEnter(){
    console.log('ion view did enter');
    // this.presentLoading()
    if(navigator.onLine){
      this.isOnline = true
    }else{
      this.isOnline = false
    }
  }

  sortProducts(){
    this.allProducts.sort( (a,b) => {
      let c : any = new Date(a.data.dateAdded)
      let d : any = new Date(b.data.dateAdded)
      return d - c
    });
  }
  back() {
    this.route.navigate(['/landing'])
  }
  navigate() {
    this.route.navigate(['/subcategories', this.title])
  }
  enableEndDateInput(){
    if(this.editStartDate){
      this.endDateLimit = moment(this.editStartDate).add('days', 1).format('YYYY-MM-DD')
    }
    this.checkPromoValidity()
  }
  promoteItem() {
    this.presentLoading()
    return this.productsService.promoteItem(this.salePrice, this.editPercentage, this.editStartDate, this.editEndDate, this.itemBrand, this.itemCategory, this.itemID, this.itemName, this.itemImageLink, this.itemDescription, this.selectedItem).then(result => {
     // this.loaderDismiss(result)
      if(result === 'success'){
        this.clearPromoForm()
        return this.dismissPromo()
      }
    })
  }

  runCheck(){
    this.checkPromoValidity()
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
          }
        }, {
          text: 'Delete',
          handler: (okay) => {
            return this.deleteItemConfirmed(productID, brand, category, item)
          }
        }
      ]
    });

    await alert.present();
  }
  deleteSalesItem(item, productID){
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
          this.presentLoading()
          return this.productsService.deleteSpecialsItem(productID, item).then(result => {
            console.log(result);
            if(result === 'success'){
                this.loadingCtrl.dismiss()
              
            }
            //location.reload()
          })
        }
      }
    ];
  
    document.body.appendChild(alert);
    return alert.present();
    
  }
  deleteItemConfirmed(productID, brand, category, item) {
    this.presentLoading()
    return this.productsService.deleteItemFromInventory(productID, brand, category, item).then(result => {
      this.loaderDismiss(result)
    })
  }
  hideItem(productID, brand, category, item) {
    this.presentLoading()
    return this.productsService.hideProduct(productID, brand, category, item).then(result => {
      this.loaderDismiss(result)
    })
  }
  loaderDismiss(res){
    if(res === 'success'){
      setTimeout( () => {
        try { this.loadingCtrl.dismiss() } catch (error) { }
      }, 300)
    }else if(res === 'error'){
      setTimeout( () => {
        try { this.loadingCtrl.dismiss() } catch (error) { }
        this.productAlert('An error occured', 'Error!')
      })
    }
  }
  showItem(productID, brand, category, item) {
    this.presentLoading()
    return this.productsService.showProduct(productID, brand, category, item).then(result => {
      this.loaderDismiss(result)
    })
  }
  reloadPage(){
    window.location.reload()
  }
  calculateSalePrice(event){
    if(event.target.value === ''){
      this.salePrice = 0
    }else if(event.target.value === ' '){
      event.target.value = ''
    }else if(event.target.value !== ''){
      if(event.target.value > 100){
        event.target.value = 99
        this.salePrice = this.itemPrice - this.itemPrice * event.target.value / 100
      }else if(event.target.value < 0){
        event.target.value = 0
        this.salePrice = this.itemPrice - this.itemPrice * event.target.value / 100
      }else{
        this.salePrice = this.itemPrice - this.itemPrice * event.target.value / 100
      }
    }
    this.checkPromoValidity()
  }
  updateFilters: string = ''
  pictureUpdate : File
  updateItem() {
    this.presentLoading()
    this.sortArray()
    this.cutDoubleSpace(this.updateName).then(result => {
      this.updateName = result
    }).then(result => {
      this.cutDoubleSpace(this.updateDescription).then(result => {
        this.updateDescription = result
      }).then(result => {
        return this.productsService.updateItemsListItem(this.itemID, this.itemBrand, this.itemCategory, this.updatePrice, this.updateDescription, this.updateName, this.itemSizes, this.pictureUpdate, this.itemColors, this.updateFilters).then(result => {
          this.loaderDismiss(result)
          if (result === 'success') {
            this.productAlert('Product was successfully updated', 'Success!')
            this.clearUpdateForm()
            return this.dismissPromo()
          }
        })
      })
    })

  }
  sortArray(){
    let sort : Array<string> = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    let tempColor = this.itemSizes
    this.itemSizes = []
    for(let color in sort){
      for(let i in tempColor){
        if(sort[color] === tempColor[i]){
          this.itemSizes.push(sort[color])
        }
      }
    }
  }
  clearUpdateForm(){
    this.pictureUpdate = undefined
    this.updateName = ''
    this.updatePrice = ''
    this.updateDescription = ''
    this.itemID = ''
    this.itemBrand = ''
    this.itemCategory = ''
    this.itemSizes = []
    this.itemColors = []
    this.checkXS =false ;this.checkS =false ;this.checkM =false ;this.checkL =false ;this.checkXL =false ;this.checkXXL =false ;this.checkXXXL =false ;
    this.checkBlack = false; this.checkBrown = false; this.checkOrange = false; this.checkYellow = false; this.checkWhite = false
  }
  updateForm : boolean
  validateUpdateForm(){
    if(this.updateName === '' || this.updateDescription === '' || this.itemSizes.length === 0 || this.updatePrice === '' || this.updatePrice === null || this.itemColors.length === 0 || this.categoryMatch === true){
      this.updateForm = false
    }else{
      this.updateForm = true
    }
  }

  updatePrices(){
    this.validateUpdateForm()
  }
  updateDescriptions(){
    this.validateUpdateForm()
  }
  clearPromoForm(){
    this.editEndDate = undefined
    this.editStartDate = undefined
    this.editPercentage = 0
    this.itemID = undefined
    this.salePrice = 0
  }
  addPictureUpdate(event){
    this.pictureUpdate = <File>event.target.files[0]
  }

  cutDoubleSpace(para){
    return new Promise( (resolve, reject) => {
      let array : Array<any> = para.split('')
      while(array[0] === ' '){
        array.splice(0, 1)
      }
      for(let i = 0; i < array.length; i++){
        if(array[i] === ' '){
          while(array[i + 1] === ' '){
            array.splice((i + 1), 1)
          }
        }
      }
      let arrayReverse : Array<any> = array.reverse()
      while(arrayReverse[0] === ' '){
        arrayReverse.splice(0, 1)
        console.log(arrayReverse);
    }
      resolve ((arrayReverse.reverse()).join(''))
    })
  }

  findMatch(event){
    let val = event.target.value.toLowerCase()
    let match 
    if(val !== '' && val !== '*'){
      let checkVal : Array<string> = val.split('')
      this.cutDoubleSpace(val).then((result) => {
        let joined = result
        console.log(joined);
        for(let key in this.currentViewedItems){
          if(joined === this.currentViewedItems[key].data.name.toLowerCase()){
            if(this.currentViewedItems[key].productID !== this.itemID){
              this.categoryMatch = true
              this.validateUpdateForm()
              break
            }else{
              this.categoryMatch = false
              this.validateUpdateForm()
            }
            break
          }else{
            this.categoryMatch = false
            this.validateUpdateForm()
          }
        }
      })

    }else if(val === ''){
      this.categoryMatch = false
      this.validateUpdateForm()
    }
  }
  
  searchInventoryVal : Array<any> = []
  searchSideInventory : Array<any> = []
  categoryMatch : boolean

  checkPromoValidity(){
    if(this.editStartDate === undefined || this.editStartDate === '' || this.editEndDate === undefined || this.editEndDate === '' || this.editPercentage === 0 || this.editPercentage === undefined || this.editPercentage === null){
      this.promoButtonEnabled = false
    }else if(this.editEndDate !== undefined && this.editEndDate !== '' && this.editStartDate !== undefined &&  this.editStartDate !== '' && this.editPercentage !== 0 && this.editPercentage !== undefined && this.editPercentage !== null){
      this.promoButtonEnabled = true
    }
  }
  submitUpdatedItem(itemName, itemPrice, itemDescription) {

  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
  }
    // promoUpd = document.getElementsByClassName("del-upd-del-list") as HTMLCollectionOf<HTMLElement>;
  toggleUpdate(productID, brand, category, name, description, price, imageLink, sizes, colors) {
    // this.promoUpd[0].style.display = "flex";
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
    this.updateForm = true
    this.checkXS =false ;this.checkS =false ;this.checkM =false ;this.checkL =false ;this.checkXL = false; this.checkXXL =false ;this.checkXXXL =false ;
    this.checkBlack = false; this.checkBrown = false; this.checkOrange = false; this.checkYellow = false; this.checkWhite = false
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
      if(this.itemColors[key] === 'Black'){
        this.checkBlack = true
        this.updateColors.push('XS')
      }else if(this.itemColors[key] === 'Brown'){
        this.checkBrown = true
        this.updateColors.push('S')
      }else if(this.itemColors[key] === 'Orange'){
        this.checkOrange = true
        this.updateColors.push('M')
      }else if(this.itemColors[key] === 'Yellow'){
        this.checkYellow = true
        this.updateColors.push('XL')
      }else if(this.itemColors[key] === 'White'){
        this.checkWhite = true
        this.updateColors.push('XXL')
      }
    }
  }
  selectedItem
  showPromo(productID, brand, category, name, description, price, imageLink, item) {
    // this.promoUpd[0].style.display = "flex";
    this.promoUdpate = "Promote item"
    this.itemName = name
    this.itemPrice = price
    this.itemDescription = description
    this.itemBrand = brand
    this.itemCategory = category
    this.itemID = productID
    this.itemImageLink = imageLink
    this.selectedItem = item
    console.log(this.promoUdpate);
    
    console.log('promo toggled');
    
  }
  dismissPromo() {
    // this.promoUpd[0].style.display = "none"
    this.categoryMatch = false
    this.editEndDate = undefined
    this.editStartDate = undefined
    this.editPercentage = undefined
    this.itemID = undefined
    this.salePrice = undefined
    this.promoUdpate = ""
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
    let index = this.itemSizes.indexOf(size)
    if (checkbox) {
      if (event.target.checked === true && index === -1) {
        console.log(index);
        
        this.itemSizes.push(size)
        console.log(this.itemSizes);
      } else if (event.target.checked === false) {
        // let index = this.itemSizes.indexOf(size)
        console.log(index);
        this.itemSizes.splice(index, 1)
        console.log(this.itemSizes);
      }
    }
    this.validateUpdateForm()
  }
  ngOnDestroy(){
    console.log('destroying page');

  }
  checkColorUpdate(event, color){
    let checkbox = event.target['name']
    let index = this.itemColors.indexOf(color)
    if(checkbox){
      if(event.target.checked === true && index === -1){
        this.itemColors.push(color)
      }else if(event.target.checked === false){
        // let index = this.itemColors.indexOf(color)
        this.itemColors.splice(index, 1)
      }
    }
    this.validateUpdateForm()
  }
  //Search functionality
  // search(query) {
  //   this.filterItems(query, this.allProducts)
  //   this.searchArray = []
  // }
  // filterItems(query, array) {
  //   let queryFormatted = query.toLowerCase();
  //   if (queryFormatted !== '') {
  //     let nameResult = array.filter(item => item.data.name.toLowerCase().indexOf(queryFormatted) >= 0)
  //     let addBrand: boolean
  //     let addCategory: boolean
  //     let addName: boolean
  //     addName = false
  //     addCategory = false
  //     addBrand = false
  //     this.searchArray = nameResult
  //   } else if (queryFormatted === '') {
  //     this.searchArray = []
  //   }
  // }
  colorsAndValue = []
  colorToggle(colorValue){
    document.getElementById(colorValue).style.boxShadow = "0px 3px 10px " + colorValue;
  }

  async promoWarnAlert() {
    const alert = await this.alertController.create({
      header: 'Wait a bit!',
      message: "This item is already on sale",
      buttons: [
        {
          text: 'Okay',
          handler: (okay) => {
            console.log('User clicked "okay"');

          }
        }
      ]
    });

    await alert.present();
  }
  alreadyOnSale(){
    this.promoWarnAlert();
  }
  load16CategoryItems(){
    // this.presentLoading()
    // this.pageLoader = true
    return this.productsService.load16CategoryItems().then((result : any) => {
      if(result !== null && result.length > 0){
        this.allProducts = result
        console.log(this.allProducts);
        
      //this.inventoryLength = this.allProducts.length
      //this.sortProducts()
    }
    if(this.pageLoader){
      //this.loadingCtrl.dismiss()
      //this.pageLoader = false
    }
    })
  }

  loadInventorySnaps(){
    return firebase.firestore().collection('Products').onSnapshot(data => {
      for(let key in data.docChanges()){
        //this.ngOnInit()
        let change = data.docChanges()[key]
        if(change.type === 'added'){
          let addToInventory : boolean = false
          if(this.inventory.length === 0){
            if(change.doc.data().deleteQueue === true){
              addToInventory = false
            }else{
              addToInventory = true
            }
          }else if(this.inventory.length !== 0){

          }
        }
        
      }
    })
  }
  runMeClear(){
    this.currentSelectedItems = this.currentViewedItems
    this.togglePop()
  }
  hiddenItems : Array<any> = []
  runMe(){
    this.hiddenItems = []
    console.log(this.currentViewedItems);
    console.log(this.link);
    
    //this.loc.go('/items-list' + '/all+hidden-items')
    for(let key in this.currentViewedItems){
      if(this.currentViewedItems[key].data.hideItem === true){
        console.log(true);
        this.hiddenItems.push(this.currentViewedItems[key])
      }
    }
    console.log(this.hiddenItems);
    this.currentSelectedItems = this.hiddenItems
    console.log(this.currentSelectedItems);
    
    this.togglePop()
  }
  visibleItems : Array<any> = []
  currentSelectedItems : Array<any> = []
  runMeNot(){
    this.visibleItems = []
    for(let key in this.currentViewedItems){
      if(this.currentViewedItems[key].data.hideItem === false){
        console.log(true);
        this.visibleItems.push(this.currentViewedItems[key])
      }
    }
    console.log(this.visibleItems);
    this.currentSelectedItems = this.visibleItems
    this.togglePop()
  }
  
  runMeDry(){
    this.hiddenItems = []
    console.log(this.allProducts);
    console.log(this.link);
    
    //this.loc.go('/items-list' + '/' + this.link + '+hidden-items')
    for(let key in this.allProducts){
      if(this.allProducts[key].data.hideItem === true){
        console.log(true);
        this.hiddenItems.push(this.allProducts[key])
      }
    }
    console.log(this.hiddenItems);
    
  }

  popOpen: boolean = false;
  openPopover(){
    var myPopover = document.getElementsByClassName("filterList") as HTMLCollectionOf <HTMLElement>;
    if(this.popOpen == false){
      this.popOpen = true;
      myPopover[0].style.display = "block"
      myPopover[0].style.height = "unset"
    }
    else{
      this.popOpen = false;
      myPopover[0].style.display = "none"
      myPopover[0].style.height = "0"
    }
  }

  popOpenS: boolean = false;
  openPopoverS(){
    var myPopoverS = document.getElementsByClassName("filterListS") as HTMLCollectionOf <HTMLElement>;
    if(this.popOpenS == false){
      this.popOpenS = true;
      myPopoverS[0].style.display = "block"
      myPopoverS[0].style.height = "unset"
    }
    else{
      this.popOpenS = false;
      myPopoverS[0].style.display = "none"
      myPopoverS[0].style.height = "0"
    }
  }

  togglePop(){
    this.openPopoverS()
    this.openPopover()
  }
  ionVdiewDidEnter () {
    console.log('we are running bruh');
    
  }

  clickedSearchItem: string = "hideItem"
  showHideSearchDetails(item) {
    console.log("closing");
    console.log(this.clickedSearchItem);
    
    if (this.clickedSearchItem == "hideItem") {
      // this.updateName = item.data.name
      // this.updatePrice = item.data.price
      // this.updateDescription = item.data.description
      // try { this.updatePic = item.data.pictureLink }
      // catch (error) {
      //   this.updatePic = null
      // }
      // this.pictureUpdate
      // this.updateSearchPic = item.data.pictureLink
      // this.updateBrand = item.brand
      // this.updateCategory = item.category
      // this.updateProductID = item.productID
      // this.itemSizes = item.data.size
      // this.itemColors = item.data.color
      // this.item = item
      // this.searchedProductStatus = item.data.hideItem
      // console.log(this.updatePic);
      
      console.log(item);
      this.clickedSearchItem = "showItem"
      // this.updateForm = true
      // this.popCheckboxXS = false ;this.popCheckboxS = false ;this.popCheckboxM = false ;this.popCheckboxL = false ;this.popCheckboxXL = false ;this.popCheckboxXXL = false ;this.popCheckboxXXXL = false ;
      // this.checkBlack = false; this.checkBrown = false; this.checkOrange = false; this.checkYellow = false; this.checkWhite = false
      // for(let key in this.itemSizes){
      //   if(this.itemSizes[key] === 'XS'){
      //     this.popCheckboxXS = true
      //     this.updateSizes.push('XS')
      //   }else if(this.itemSizes[key] === 'S'){
      //     this.popCheckboxS = true
      //     this.updateSizes.push('S')
      //   }else if(this.itemSizes[key] === 'M'){
      //     this.popCheckboxM = true
      //     this.updateSizes.push('M')
      //   }else if(this.itemSizes[key] === 'L'){
      //     this.popCheckboxL = true
      //     this.updateSizes.push('XL')
      //   }else if(this.itemSizes[key] === 'XL'){
      //     this.popCheckboxXL = true
      //     this.updateSizes.push('XXL')
      //   }else if(this.itemSizes[key] === 'XXL'){
      //     this.popCheckboxXXL = true
      //     this.updateSizes.push('XXL')
      //   }else if(this.itemSizes[key] === 'XXXL'){
      //     this.popCheckboxXXXL = true
      //     this.updateSizes.push('XXXL')
      //   }
      // }
      // for(let key in this.itemColors){
      //   if(this.itemColors[key] === 'Black'){
      //     this.checkBlack = true
      //     this.updateSizes.push('XS')
      //   }else if(this.itemColors[key] === 'Brown'){
      //     this.checkBrown = true
      //     this.updateSizes.push('S')
      //   }else if(this.itemColors[key] === 'Orange'){
      //     this.checkOrange = true
      //     this.updateSizes.push('M')
      //   }else if(this.itemColors[key] === 'Yellow'){
      //     this.checkYellow = true
      //     this.updateSizes.push('XL')
      //   }else if(this.itemColors[key] === 'White'){
      //     this.checkWhite = true
      //     this.updateSizes.push('XXL')
      //   }
      // }
      setTimeout(() => {
        this.searchInput = ''
      }, 100);
    }
    else {
      this.clickedSearchItem = "hideItem"
    }
  }
  search() {
    this.fnHideSearchResults(false)
    this.filterItems(this.currentViewedItems)
    console.log('items searching: ' + this.searchInput);
    
  }
  blnShowSearchResults : boolean = false
  fnHideSearchResults(bln : boolean) {
    console.log('we are hiding the search bar: ' + bln);
     if(bln) {
       this.blnShowSearchResults = false
     } else {
       this.blnShowSearchResults = true
     }
     console.log(this.blnShowSearchResults);
     
  }
  filterItems(array) {
    let queryFormatted = this.searchInput.toLowerCase();
    if(queryFormatted !== '' && queryFormatted !== '*'){
      let nameResult = array.filter(item => item.data.name.toLowerCase().indexOf(queryFormatted) >= 0)
      let brandResult = array.filter(item => item.brand.toLowerCase().indexOf(queryFormatted) >= 0)
      let categoryResult = array.filter(item => item.category.toLowerCase().indexOf(queryFormatted) >= 0)
      let returnResult
      let addBrand: boolean
      let addCategory: boolean
      let addName: boolean
      addCategory = false
      addName = false
      returnResult = nameResult
      for(let key in brandResult){
        for(let i in returnResult){
          if(returnResult[i].productID === brandResult[key].productID){
            addBrand = false
            break
          }else if(returnResult[i].productID !== brandResult[key].productID){
            addBrand = true
          }
        }
        if(addBrand === true){
          returnResult.push(brandResult[key])
        }
      }
      for(let key in categoryResult){
        for(let i in returnResult){
          if(returnResult[i].productID === categoryResult[key].productID){
            addCategory = false
            break
          }else if(returnResult[i].productID !== categoryResult[key].productID){
            addCategory = true
          }
        }
        if(addCategory === true){
          returnResult.push(categoryResult[key])
        }
      }
      addName = false
      addCategory = false
      addBrand = false
      this.searchArray = nameResult
    }else if(queryFormatted === '*'){
    this.searchArray = this.allProducts
    }
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
  loadSales(){
    return this.productsService.getAllSales().then(result => {
      let array = []
      array = result
      if(array.length !== 0){
        this.currentSelectedItems = result
        
      }
    })
  }
}
