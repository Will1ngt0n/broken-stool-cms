import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import { ProductsService } from '../services/products-services/products.service';
import * as moment from 'moment';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import * as firebase from 'firebase'
import { NetworkService } from '../services/network-service/network.service';
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
  pendingOrdersLength = 0;
  orderHistoryLength = 0;
  inventoryLength = 0;
  addForm : boolean 
  formHasValues : boolean 
  department : any 
  picture : File
  searchArray
  pictures: Array<any> = []
  departmentOptions: Array<any> = ['Select Brand', 'Dankie Jesu', 'Kwanga']
  kwangaCategories: Array<any> = ['Formal', 'Traditional', 'Smart Casual', 'Sports']
  dankieJesuCategories: Array<any> = ['Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Bags', 'Sweaters', 'Hoodies', 'Track Suits', 'Beanies']
  newNumberOfProducts : number
  currentNumberOfProducts : number
  categoryOptions: Array<any> = ['Select Category']
  inventoryItems: Array<any> = []
  summer: boolean;
  winter: boolean = false
  kwanga: boolean = false
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
  //status = ['ready', 'received', 'processed', 'cancelled']
  blackAvailable; blackPic
  brownAvailable; brownPic
  orangeAvailable; orangePic
  yellowAvailable; yellowPic
  whiteAvailable; whitePic
  dankieJesuPic: object = {}
  kwangaPic: object = {}
  AllCatpic: object = {}
  miniSearchBarState: boolean = false;
  @ViewChild('sliderRef', { static: false }) slides: IonSlides;
  @ViewChild('sliderRefSmall', { static: true }) mySlides: IonSlides;
  @ViewChild('fileInput', {static:true}) fileInput : ElementRef
  @ViewChild('departmentCombo', {static : false}) departmentCombo : ElementRef
  
  @ViewChild('mbdepartmentCombo', {static : true}) mbdepartmentCombo : ElementRef
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

  //mobile view
  @ViewChild('mbcheckboxXS', {static : true}) mbcheckboxXS : ElementRef
  @ViewChild('mbcheckboxS', {static : true}) mbcheckboxS : ElementRef
  @ViewChild('mbcheckboxM', {static : true}) mbcheckboxM : ElementRef
  @ViewChild('mbcheckboxL', {static : true}) mbcheckboxL : ElementRef
  @ViewChild('mbcheckboxXL', {static : true}) mbcheckboxXL : ElementRef
  @ViewChild('mbcheckboxXXL', {static : true}) mbcheckboxXXL : ElementRef
  @ViewChild('mbcheckboxXXXL', {static : true}) mbcheckboxXXXL : ElementRef
  @ViewChild('mbcheckboxBlack', {static : true}) mbcheckboxBlack : ElementRef
  @ViewChild('mbcheckboxBrown', {static : true}) mbcheckboxBrown : ElementRef
  @ViewChild('mbcheckboxOrange', {static : true}) mbcheckboxOrange : ElementRef
  @ViewChild('mbcheckboxYellow', {static : true}) mbcheckboxYellow : ElementRef
  @ViewChild('mbcheckboxWhite', {static : true}) mbcheckboxWhite : ElementRef
  kwangaSpecialsPicture
  dankieJesuSpecialsPicture
  allSpecialsPicture

  sliderConfig = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    spaceBetween: 0,
    slidesPerView: 1.8, //use any number 1.8 or 4.2 or 7.3 etc..
    direction: 'horizontal',
    parallax: true,
    freeMode: false,
    allowSwipeToPrev: true,
    roundLengths: false,
    effect: 'fade'
  }
  sliderConfigSmall = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    spaceBetween: 0,
    slidesPerView: 2.32, //use any number 1.8 or 4.2 or 7.3 etc..
    direction: 'horizontal',
    parallax: true, 
    freeMode: false,
    allowSwipeToPrev: true,
    roundLengths: false,
    effect: 'fade'
  }
  itemPrice; itemDescription; itemBrand; itemCategory; itemID; itemImageLink; itemSizes; itemColors
  editName; editPrice; editDescription; editBrand; editCategory; editID; editPercentage; editStartDate; editEndDate
  searchedProductStatus
  popCheckboxXS : boolean; popCheckboxS : boolean; popCheckboxM : boolean; popCheckboxL : boolean; popCheckboxXL : boolean; popCheckboxXXL : boolean; popCheckboxXXXL : boolean ;
  checkBlack: boolean; checkBrown : boolean; checkOrange : boolean; checkYellow : boolean; checkWhite : boolean
  updateName; updatePrice; updateDescription; updateColors: Array<any> = []; updateSizes: Array<any> = []
  pictureUpdate : File

  constructor(private networkService : NetworkService, private alertController: AlertController, public loadingCtrl: LoadingController, public navCtrl: NavController, public route: Router, public authService: AuthService, public productService: ProductsService) {
    //console.log(this.department);
    this.categoryUpdateMatch = false
    this.kwangaSpecialsPicture = undefined
    this.dankieJesuSpecialsPicture = undefined
    this.allSpecialsPicture = undefined
    this.allProducts = []
    this.pendingOrders = []
    this.history = []
    this.colors = { red: '' }
    this.accessory = false;
    this.summer = false;
    this.department = 'Select Brand'
    this.selectedCategory = 'Select Category'
    this.addForm = false
    this.formHasValues = false
    this.itemName = ''
    this.price = ''
    this.description = ''
    this.size = []
    this.color = []
    this.picture = undefined
    
    this.isOnline = false
    this.isCached = false
    this.isConnected = false
    // this.pageLoader = false
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
          }
        }, {
          text: 'Okay',
          handler: (okay) => {
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
      this.route.navigate(['/login'])
    })
  }

  isOnline : boolean
  isCached : boolean
  isConnected : boolean
  preventIonViewDidEnterInit : boolean
  ngOnInit() { ////copy
//this.
    if(this.isCached){

    }else{
      if(navigator){

        if(navigator.onLine){
          //this.presentLoader()
          return this.networkService.getUID().then( result => {
            //console.log(result);
            if(result === true){
              clearInterval(this.timer)
              this.preventIonViewDidEnterInit = true
              // this.presentLoading()
              // this.pageLoader = true
              this.isOnline = true
              this.isCached = true
              this.isConnected = true
              // this.loadRunFunction()
              this.presentLoading()
              this.getCategories()
              this.pageLoader = true
              this.loadTotalNumberOfProducts()
              this.getPendingOrders()
              let date = moment(new Date()).format('LLLL');
              let tee = moment(new Date('10/12/2019')).format('LLLL')
              if (date > tee) {
              }
          
              this.getReadyOrders()
              this.getOrderHistory()
          
              this.load16CategoryItems()
              this.nativeCategory.nativeElement.disabled = true
              //snapshots
              this.refreshOrderHistory()
              this.getPendingOrdersSnap()
              this.loadFormal('Kwanga', 'Formal')
              this.loadTraditional('Kwanga', 'Traditional')
              this.loadSmartCasual('Kwanga', 'Smart Casual')
              this.loadSportsWear('Kwanga', 'Sports')
              this.loadVests('Dankie Jesu', 'Vests')
              this.loadCaps('Dankie Jesu', 'Caps')
              this.loadBucketHats('Dankie Jesu', 'Bucket Hats')
              this.loadShorts('Dankie Jesu', 'Shorts')
              this.loadCropTops('Dankie Jesu', 'Crop Tops')
              this.loadTShirts('Dankie Jesu', 'T-Shirts')
              this.loadBags('Dankie Jesu', 'Bags')
              this.loadSweaters('Dankie Jesu', 'Sweaters')
              this.loadHoodies('Dankie Jesu', 'Hoodies')
              this.loadTrackSuits('Dankie Jesu', 'Track Suits')
              this.loadBeanies('Dankie Jesu', 'Beanies')
            }else{
              this.isConnected = false
              this.preventIonViewDidEnterInit = false
            }
          })
    
        }else{
          this.isOnline = false
          this.isCached = false
        }
      }
    }


  }
  categoryList : Array<any> = []
  getCategories(){
    return this.productService.getCategories().then((result : Array<any>) => {
      let category
      console.log(result);
      for(let key in result){
        this.departmentOptions.push(result[key].brand)
      }
    })
  }
  loadRunFunction(){
    this.presentLoading()
    this.getCategories()
    this.pageLoader = true
    this.loadTotalNumberOfProducts()
    this.getPendingOrders()
    let date = moment(new Date()).format('LLLL');
    let tee = moment(new Date('10/12/2019')).format('LLLL')
    if (date > tee) {
    }

    this.getReadyOrders()
    this.getOrderHistory()

    this.load16CategoryItems()
    this.nativeCategory.nativeElement.disabled = true
    //snapshots
    this.refreshOrderHistory()
    this.getPendingOrdersSnap()
    this.loadFormal('Kwanga', 'Formal')
    this.loadTraditional('Kwanga', 'Traditional')
    this.loadSmartCasual('Kwanga', 'Smart Casual')
    this.loadSportsWear('Kwanga', 'Sports')
    this.loadVests('Dankie Jesu', 'Vests')
    this.loadCaps('Dankie Jesu', 'Caps')
    this.loadBucketHats('Dankie Jesu', 'Bucket Hats')
    this.loadShorts('Dankie Jesu', 'Shorts')
    this.loadCropTops('Dankie Jesu', 'Crop Tops')
    this.loadTShirts('Dankie Jesu', 'T-Shirts')
    this.loadBags('Dankie Jesu', 'Bags')
    this.loadSweaters('Dankie Jesu', 'Sweaters')
    this.loadHoodies('Dankie Jesu', 'Hoodies')
    this.loadTrackSuits('Dankie Jesu', 'Track Suits')
    this.loadBeanies('Dankie Jesu', 'Beanies')
  }
  reload() {
    if(navigator.onLine){
      return this.networkService.getUID().then( result => {
        //console.log(result);
        if(result === true){ 
          //this.presentLoader()
          //this.pageLoader = true
          this.isOnline = true
          this.isCached = true
          this.isConnected = true
          clearInterval(this.timer)
          // this.loadRunFunction()
          this.loadTotalNumberOfProducts()
          this.getPendingOrders()
      
          this.getReadyOrders()
          this.getOrderHistory()
          this.load16CategoryItems()
          this.nativeCategory.nativeElement.disabled = true
          //snapshots
          this.refreshOrderHistory()
          this.getPendingOrdersSnap()
          this.loadFormal('Kwanga', 'Formal')
          this.loadTraditional('Kwanga', 'Traditional')
          this.loadSmartCasual('Kwanga', 'Smart Casual')
          this.loadSportsWear('Kwanga', 'Sports')
          this.loadVests('Dankie Jesu', 'Vests')
          this.loadCaps('Dankie Jesu', 'Caps')
          this.loadBucketHats('Dankie Jesu', 'Bucket Hats')
          this.loadShorts('Dankie Jesu', 'Shorts')
          this.loadCropTops('Dankie Jesu', 'Crop Tops')
          this.loadTShirts('Dankie Jesu', 'T-Shirts')
          this.loadBags('Dankie Jesu', 'Bags')
          this.loadSweaters('Dankie Jesu', 'Sweaters')
          this.loadHoodies('Dankie Jesu', 'Hoodies')
          this.loadTrackSuits('Dankie Jesu', 'Track Suits')
          this.loadBeanies('Dankie Jesu', 'Beanies')
        }else{
          this.isConnected = false
        }
      })
    }else{
      this.isOnline = false
      this.loadingCtrl.dismiss()
    }
  }
  load16CategoryItems(){
    // this.presentLoading()
    // this.pageLoader = true
    return this.productService.load16CategoryItems().then((result : any) => {
      if(result !== null && result.length > 0){
        this.allProducts = result
      this.inventoryLength = this.allProducts.length
      this.sortProducts()
    }
    if(this.pageLoader){
      this.loadingCtrl.dismiss()
      this.pageLoader = false
    }
    })
  }

  loadFormal(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadTraditional(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
     if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
      this.modifyLocalObjects(result, brand, category)
    }else{
    }
    })
  }
  loadSmartCasual(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadSportsWear(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadVests(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }

  loadCaps(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }

  loadBucketHats(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }

  loadShorts(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadCropTops(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadTShirts(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadBags(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadSweaters(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadHoodies(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadTrackSuits(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  loadBeanies(brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).onSnapshot(result => {
      if(result.docChanges().length !== 0 && (result.docChanges()[0].type === 'modified' || result.docChanges()[0].type === 'removed')){
        this.modifyLocalObjects(result, brand, category)
      }else{
      }
    })
  }
  updateForm : boolean
  validateUpdateForm(){
    if(this.updateName === '' || this.updatePic === undefined || this.updateDescription === '' || this.itemSizes.length === 0 || this.updatePrice === '' || this.itemColors.length === 0 || this.categoryUpdateMatch === true){
      this.updateForm = false
    }else{
      this.updateForm = true
    }
  }

  changeDepartment(event) {
    this.department = event.target['value']
    console.log(this.department)
    if (this.department === 'Dankie Jesu') {
      this.categoryOptions = ['Select Category', 'Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Sweaters', 'Hoodies', 'Track Suits', 'Beanies', 'Bags']
    }
    if (this.department === 'Kwanga') {
      this.categoryOptions = ['Select Category', 'Formal', 'Traditional', 'Smart Casual', 'Sports']
    }
    if (this.department === 'Select Brand') {
      this.department = undefined
      this.nativeCategory.nativeElement.disabled = true   ////
      this.nativeCategory.nativeElement.value = 'Select Category'   ///
    }else{
      this.nativeCategory.nativeElement.disabled = false   ////
    }
    this.checkValidity()
  }
  checkItemName(){
    this.checkValidity()
  }
  checkItemDescription(){
    this.checkValidity()
  }
  changeCategory(event) {
    this.selectedCategory = event.target['value']
    if (this.selectedCategory === 'Select Category') {
      this.selectedCategory = 'Select Category'
    }
    if(this.selectedCategory === 'Vests' || this.selectedCategory === 'Caps' || this.selectedCategory === 'Bucket Hats' || this.selectedCategory === 'Shorts' || this.selectedCategory === 'Crop Tops' || this.selectedCategory === 'T-Shirts'){
      this.summer = true
    }   /// 'Sweaters', 'Hoodies', 'Track Suits', 'Beanies', 'Bags')
    if(this.selectedCategory === 'Sweaters' || this.selectedCategory === 'Hoodies' || this.selectedCategory === 'Track Suits' || this.selectedCategory === 'Beanies'){
      this.summer = false
    }
    
    if(this.selectedCategory === 'Bags' || this.selectedCategory === 'Caps' || this.selectedCategory === 'Bucket Hats' || this.selectedCategory === 'Beanies'){
      this.accessory = true   ///, 'Bags'))
    }else{
      this.accessory = false
    }

    this.checkValidity()
  }

  check(event, size) {
    let checkbox = event.target['name']
    if (checkbox) {
      if (event.target.checked === true) {
        this.size.push(size)
      } else if (event.target.checked === false) {
        let index = this.size.indexOf(size)
        console.log(index);
        this.size.splice(index, 1)
      }
    }
    this.size
    this.checkValidity()
  }
  invprice : number
  changeInventoryPrice(){
    if(this.invprice < 0){
      this.price
    }
  }
  changePrice(){
    if(Number(this.price) < 0){
      this.price = ''
    }else if(Number(this.price) > 10000){
      this.price = '10000'
    }
    console.log(this.price);
    if(this.price === null){
      this.price = ''
    }
    this.checkValidity()
  }
  generateCode : boolean
  checkValidity() {
    if(this.nativeCategory.nativeElement.disabled === true){
      this.selectedCategory = 'Select Category'
    }
    if (this.selectedCategory === 'Select Category' || this.department === 'Select Brand' || this.size.length === 0 || this.color.length === 0 || this.itemName === '' || this.description === '' || this.price === '' || this.fileInput.nativeElement.value === '' || this.picture === undefined || this.newProductCode === '' || this.newProductCode === undefined || this.categoryMatch === undefined || this.categoryMatch === true) {
      this.addForm = false
    } else {
      this.addForm = true
    }
    if (this.selectedCategory === 'Select Category' || this.department === 'Select Brand' || this.size.length === 0 || this.color.length === 0 || this.itemName === '' || this.description === '' || this.price === '' || this.fileInput.nativeElement.value === '' || this.picture === undefined || this.categoryMatch === undefined || this.categoryMatch === true) {
      this.generateCode = false
    } else {
      this.generateCode = true
    }
    if (this.department !== 'Select Brand' || this.selectedCategory !== 'Select Category' || this.size.length !== 0 || this.color.length !== 0 || this.itemName !== '' || this.description !== '' || this.price !== '' || this.fileInput.nativeElement.value !== '' || this.picture !== undefined || this.newProductCode !== '') {
      this.formHasValues = true
    }else{
      this.formHasValues = false
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
  myUpload = "../../assets/imgs/default.png";
  uploaderImage = document.getElementsByClassName("adder") as HTMLCollectionOf <HTMLElement>;
  uploadedImage = document.getElementsByClassName("imageChanged") as HTMLCollectionOf <HTMLElement>;
  addPicture(event){
    this.picture = <File>event.target.files[0]
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.myUpload = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
        if(event.target.files[0]){
          this.uploaderImage[0].style.display = "none"
          this.uploadedImage[0].style.display = "block"
        }
        this.checkValidity()
  }
  addProduct(){
    this.presentLoading()
    this.currentNumberOfProducts = this.inventoryLength
    let number : string = String(Number(this.currentNumberOfProducts) + 1)
    let sort : Array<string> = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    let tempColor = this.size
    this.size = []
    for(let color in sort){
      for(let i in tempColor){
        if(sort[color] === tempColor[i]){
          this.size.push(sort[color])
        }
      }
    }
    let checkVal : Array<string> = this.itemName.split('')
    this.cutDoubleSpace(this.itemName).then((result : string) => {
      this.itemName = result
    }).then(result => {
      this.cutDoubleSpace(this.description).then((result : string) => {
        this.itemDescription = result   
      }).then( res => {
        console.log('successful');
        this.addProducts(number)
      })

    })

        
  }
  addProducts(numberOfProducts) {
    return this.productService.addItem(this.department, this.selectedCategory, this.itemName, this.description, this.price, this.size, this.accessory, this.summer, this.color, this.picture, numberOfProducts, this.newProductCode).then((result : any) => {
      console.log(result);
      if(result === 'success'){
        console.log('successs');
        this.clearForm();
        this.productAlert('Product was successfully added')
      }
      this.loadTotalNumberOfProducts()
      this.loadingCtrl.dismiss()
    })
  }

  //Clearing all form variables and form inputs respectively
  clearForm() { //clearform for bigger screens
    this.uploaderImage[0].style.display = "block"
    this.uploadedImage[0].style.display = "none"
    this.departmentOptions = ['Select Brand', 'Dankie Jesu', 'Kwanga']
    this.categoryOptions = ['Select Category']
    this.selectedCategory = ''
    this.itemName = ''
    this.price = ''
    this.description = ''
    this.size = [];
    this.color = []
    this.picture = undefined
    this.myUpload = "../../assets/imgs/default.png"
    this.newProductCode = ''
    this.generateCode = false
    this.fileInput.nativeElement.value = ''

    if(this.departmentCombo){
    this.departmentCombo.nativeElement.value ='Select Brand'
    }
    if(this.mbdepartmentCombo){
      this.mbdepartmentCombo.nativeElement.value ='Select Brand'
    }

    let checkboxes: Array<any> = ['checkboxXS', 'checkboxS', 'checkboxM', 'checkboxL', 'checkboxXL', 'checkboxXXL', 'checkboxXXXL', 'checkboxBlack', 'checkboxBrown', 'checkboxOrange', 'checkboxYellow', 'checkboxWhite']
    let mbcheckboxes: Array<any> = ['mbcheckboxXS', 'mbcheckboxS', 'mbcheckboxM', 'mbcheckboxL', 'mbcheckboxXL', 'mbcheckboxXXL', 'mbcheckboxXXXL', 'mbcheckboxBlack', 'mbcheckboxBrown', 'mbcheckboxOrange', 'mbcheckboxYellow', 'mbcheckboxWhite']
    
    //let checkboxesNative : Array<any> = [this.checkboxXS, this.checkboxS, this.checkboxM, this.checkboxL, this.checkboxXL, this.checkboxXXL, this.checkboxXXXL, this.checkboxBlack, this.checkboxBrown, this.checkboxOrange, this.checkboxYellow, this.checkboxWhite]
    //let mbcheckboxesNative : Array<any> = [this.mbcheckboxXS, this.mbcheckboxS, this.mbcheckboxM, this.mbcheckboxL, this.mbcheckboxXL, this.mbcheckboxXXL, this.mbcheckboxXXXL, this.mbcheckboxBlack, this.mbcheckboxBrown, this.mbcheckboxOrange, this.mbcheckboxYellow, this.mbcheckboxWhite]    
    for (let i = 0; i < checkboxes.length; i++) {
      document.getElementsByName(checkboxes[i])[0]['checked'] = false
    }
    this.formHasValues = false
    this.addForm = false
    this.department = 'Select Brand'
    this.selectedCategory = 'Select Category'
  }
  mbclearForm() { //clearform for small screens
    
    this.uploaderImage[0].style.display = "block"
    this.uploadedImage[0].style.display = "none"
    this.departmentOptions = ['Select Brand', 'Dankie Jesu', 'Kwanga']
    this.categoryOptions = ['Select Category']
    this.selectedCategory = ''
    this.itemName = ''
    this.price = ''
    this.description = ''
    this.size = [];
    this.picture = undefined
    this.myUpload = "../../assets/imgs/default.png"
    this.fileInput.nativeElement.value = ''

    if(this.departmentCombo){
    this.departmentCombo.nativeElement.value ='Select Brand'
    }
    if(this.mbdepartmentCombo){
      this.mbdepartmentCombo.nativeElement.value ='Select Brand'
    }

    let checkboxes: Array<any> = ['checkboxXS', 'checkboxS', 'checkboxM', 'checkboxL', 'checkboxXL', 'checkboxXXL', 'checkboxXXXL', 'checkboxBlack', 'checkboxBrown', 'checkboxOrange', 'checkboxYellow', 'checkboxWhite']
    let mbcheckboxes: Array<any> = ['mbcheckboxXS', 'mbcheckboxS', 'mbcheckboxM', 'mbcheckboxL', 'mbcheckboxXL', 'mbcheckboxXXL', 'mbcheckboxXXXL', 'mbcheckboxBlack', 'mbcheckboxBrown', 'mbcheckboxOrange', 'mbcheckboxYellow', 'mbcheckboxWhite']
    
    //let checkboxesNative : Array<any> = [this.checkboxXS, this.checkboxS, this.checkboxM, this.checkboxL, this.checkboxXL, this.checkboxXXL, this.checkboxXXXL, this.checkboxBlack, this.checkboxBrown, this.checkboxOrange, this.checkboxYellow, this.checkboxWhite]
    //let mbcheckboxesNative : Array<any> = [this.mbcheckboxXS, this.mbcheckboxS, this.mbcheckboxM, this.mbcheckboxL, this.mbcheckboxXL, this.mbcheckboxXXL, this.mbcheckboxXXXL, this.mbcheckboxBlack, this.mbcheckboxBrown, this.mbcheckboxOrange, this.mbcheckboxYellow, this.mbcheckboxWhite]    
    for (let i = 0; i < checkboxes.length; i++) {
      document.getElementsByName(mbcheckboxes[i])[0]['checked'] = false
    }
    this.formHasValues = false
    this.addForm = false
    this.department = 'Select Brand'
    this.selectedCategory = 'Select Category'
  }
  //Routing to sales page
  viewSales(query) {
    console.log(query);
    let navOptions = {
      queryParams: { query: query }
    }
    this.navCtrl.navigateForward(['sales-specials'], navOptions)
  }

  viewMore(query) {
    this.route.navigate(['/' + query])
  }

  loadKwangaItems() {
    let category: String
    // for (let key in this.kwangaCategories) {
    //   category = this.kwangaCategories[key]
    //   console.log(category);
    //   this.loadItems(category, 'Kwanga')
    // }
  }
  loadDankieJesuItems() {
    let category: String
    // for (let key in this.dankieJesuCategories) {
    //   category = this.dankieJesuCategories[key]
    //   this.loadItems(category, 'Dankie Jesu')
    // }
  }

  loadTotalNumberOfProducts(){
    return this.productService.getNumberOfProducts().then( (result : number) => {
      this.currentNumberOfProducts = result
    })
  }

  presentLoader(){
    this.presentLoading()
  }
  loadItems(category, brand){
    let data : Array<any> = []
    return this.productService.loadCategoryItems(category, brand).then(result => {
      if(result !== undefined){
        for(let key in result){
          if(brand === 'Kwanga'){
            this.kwangaProducts.push(result[key])
            this.allProducts.push(result[key])
            if(this.kwangaSpecialsPicture !== undefined){
              this.kwangaSpecialsPicture = this.kwangaProducts[0].data.pictureLink
            }
          }else if(brand === 'Dankie Jesu'){
            this.dankieJesuProducts.push(result[key])
            this.allProducts.push(result[key])
            if(this.dankieJesuSpecialsPicture !== undefined){
              this.dankieJesuSpecialsPicture = this.dankieJesuProducts[0].data.pictureLink
            }
            if(this.allSpecialsPicture!== undefined){
              this.allSpecialsPicture = this.dankieJesuProducts[0].data.pictureLink
            }
          }
      }
      this.inventoryLength = this.allProducts.length
      this.sortProducts()
      }
    })
  }

  sortSummerProducts(){
    let addToSummer
    for(let key in this.allProducts){
      for(let i in this.summerGear){
        if(this.allProducts[key].brand === 'Dankie Jesu' && this.allProducts[key].data.isSummer === true)
        if(this.allProducts[key].productID === this.summerGear[i].productID){
          addToSummer = false
          break
        }else if(this.allProducts[key].productID !== this.summerGear[i].productID){
          addToSummer = true
        }
      }
      if(addToSummer === true && this.summerGear.length < 6){
        this.summerGear.push(this.allProducts[key])
      }
    }
    this.summerGear.sort( (a,b) => {
      let c : any = new Date(a.data.dateAdded)
      let d : any = new Date(b.data.dateAdded)
      return d - c
    });
  }
  sortWinterProducts(){
    let addToWinter
    for(let key in this.allProducts){
      for(let i in this.winterGear){
        if(this.allProducts[key].brand === 'Dankie Jesu' && this.allProducts[key].data.isSummer === false && this.allProducts[key].data.isAccessory === false){
          if(this.allProducts[key].productID === this.winterGear[i].productID){
            addToWinter = false
            break
          }else if(this.allProducts[key].productID !== this.winterGear[i].productID){
            addToWinter = true
          }
        }
      }
      if(addToWinter === true && this.winterGear.length < 6){
        this.winterGear.push(this.allProducts[key])
      }
    }
    this.winterGear.sort( (a,b) => {
      let c : any = new Date(a.data.dateAdded)
      let d : any = new Date(b.data.dateAdded)
      return d - c
    });
  }
  sortKwangaProducts(){
    let addToKwanga : boolean
    for(let key in this.allProducts){
      for(let i in this.kwangaGear){
        if(this.allProducts[key].brand === 'Kwanga'){
          if(this.allProducts[key].productID === this.kwangaGear[i].productID){
            addToKwanga = false
            break
          }else if(this.allProducts[key].productID !== this.kwangaGear[i].productID){
            addToKwanga = true
          }
        }
      }
      console.log(this.kwangaGear);
      
      if(addToKwanga === true && this.kwangaGear.length < 3){
        this.kwangaGear.push(this.allProducts[key])
      }
    }
    this.kwangaGear.sort( (a,b) => {
      let c : any = new Date(a.data.dateAdded)
      let d : any = new Date(b.data.dateAdded)
      return d - c
    });
  }
  sortProducts(){
    this.allProducts.sort( (a,b) => {
      let c : any = new Date(a.data.dateAdded)
      let d : any = new Date(b.data.dateAdded)
      return d - c
    });

    if(this.allProducts.length > 0){
      for(let key in this.allProducts){

        if(this.allProducts[key].brand === 'Kwanga'){
          if(this.kwangaGear.length < 3){
            this.kwangaGear.push(this.allProducts[key])
            console.log(this.kwangaGear);
          }
        }else if(this.allProducts[key].brand === 'Dankie Jesu') {
          if(this.allProducts[key].data.isSummer === true){
            this.summerProducts.push(this.allProducts[key])
            if(this.summerGear.length < 6){
              this.summerGear.push(this.allProducts[key])
            }
          } else if (this.allProducts[key].data.isSummer === false) {
            if(this.allProducts[key].category === 'Bags'){

            }else if(this.allProducts[key].category !== 'Bags'){
              console.log(this.allProducts[key].category);
              
              this.winterProducts.push(this.allProducts[key])
              if(this.winterGear.length < 6){
                this.winterGear.push(this.allProducts[key])
              }
            }
          }
        }
      }
    }
    console.log(this.inventoryLength, this.currentNumberOfProducts);
    
    if(this.inventoryLength === Number(this.currentNumberOfProducts)){
      if(this.loadingCtrl){
        for(let i = 0; i < 5000; i++){
          if(i === 4999){
            this.loadingCtrl.dismiss()
          }
        }
      }
    }
  }

  getPendingOrdersSnap() {
    //Running pending orders snap
    return firebase.firestore().collection('Order').onSnapshot(result => {
      let pendingOrder : Array<any> = []
      let pendingOrderModified : object = {}
      let add : boolean
     // console.log(result);
      if(result.docChanges().length > 0){
        for(let key in result.docChanges()){
          let change = result.docChanges()[key]
          if(change.type === 'modified' ){
            let refNo = change.doc.id
            let data = change.doc.data()
            let userID = data.userID
            let noOfItems : number = 0
            for(let key in data.product){
              noOfItems = noOfItems + data.product[key].quantity
            }
            pendingOrderModified = {refNo : refNo, details : data, noOfItems: noOfItems}
            console.log(pendingOrderModified);
            console.log(this.pendingOrders.length);
            if(this.pendingOrders.length === 0){
              this.pendingOrders.push(pendingOrderModified)
              this.pendingOrdersLength = this.pendingOrders.length
              this.loadUserName(userID)
              return
            }else if(this.pendingOrders.length > 0){
                add = false
                for(let key in this.pendingOrders){
                  if(this.pendingOrders[key].refNo === pendingOrderModified['refNo']){
                    add = false
                    break
                  }else if(this.pendingOrders[key].refNo !== pendingOrderModified['refNo']){
                    add = true
                  }
                }
                if(add === true){
                  this.pendingOrders.unshift(pendingOrderModified)
                  this.loadUserName(userID)
                  this.pendingOrdersLength = this.pendingOrders.length
                }
            }
          }
          if(change.type === 'removed'){
            console.log(change);
            let pendingOrderRemoved : object = {}
            let refNo = change.doc.id
            let data = change.doc.data()
            let userID = data.userID
            console.log(refNo);
            console.log(data);
            console.log(userID);
            let noOfItems : number = 0
            for(let key in data.product){
              noOfItems = noOfItems + data.product[key].quantity
            }
            pendingOrderRemoved = {refNo : refNo, details : data, noOfItems: noOfItems}
            for(let key in this.pendingOrders){
              if(this.pendingOrders[key].refNo === refNo){
                let index = Number(key)
                this.pendingOrders.splice(index, 1)
              }else if(this.pendingOrders[key].refNo !== refNo){
                
              }
            }
            // let index = this.pendingOrders.indexOf(pendingOrder)
            this.pendingOrdersLength = this.pendingOrders.length
          }
        }
      }
      console.log(this.pendingOrders);
      return pendingOrder
    })
  }
  
  getPendingOrders() {


    return this.productService.getPendingOrders().then(result => {
      console.log(result);
      //this.pendingOrders = []
      let array = result
      if (result !== null) {
        for(let i in result){
          let noOfItems : number = 0
          for(let key in result[i]['details'].product){
            noOfItems = noOfItems + Number(result[i]['details'].product[key].quantity)
          }
          result[i].noOfItems =noOfItems
        }
        this.pendingOrders = result
        console.log(result);
        this.pendingOrdersLength = this.pendingOrders.length
        for (let key in this.pendingOrders) {
          this.loadUserName(this.pendingOrders[key].details.userID)
        }
      }
    })
  }
  loadUserName(data) {
    return this.productService.loadUser(data).then(result => {
      console.log(result);
      for (let key in this.pendingOrders) {
        if (this.pendingOrders[key].details.userID === result.userID) {
          this.pendingOrders[key].details.name = result.name
          this.pendingOrders[key].details.cell = result.cell
        }
      }
      console.log(this.pendingOrders);
      // if(this.loadingCtrl){
      //   this.loadingCtrl.dismiss()
      // }

    })
  }
  getReadyOrders() {
    return this.productService.getReadyOrders().then(result => {
      this.readyOrders = result
    })
  }
  refreshOrderHistory(){
    return firebase.firestore().collection('orderHistory').onSnapshot(result => {
      let closedOrder : Array<any> = []
      let addHistory : boolean
      let refNo
      let data
      let totalPrice : Number = 0
      let grandTotal : Number = 0
      let numberOfItems : Number = 0;
      if(result.docChanges().length !== 0){
        for(let key in result.docChanges()){
          let change = result.docChanges()[key]
          //console.log(change);
          addHistory = false
          if(change.type === 'added'){
            let productID = change.doc.id
            let docData = change.doc.data()
            refNo = change.doc.id
            data = change.doc.data()
              closedOrder.push({refNo : refNo, details : data})
              if(closedOrder){
            }
          }
        }
        if(this.history.length === 0){
          for(let i in closedOrder){
            totalPrice = 0
            numberOfItems = 0
            grandTotal = 0
            for(let j in closedOrder[i].details.orders){
              //console.log(closedOrder[i].details);
              totalPrice = +totalPrice + +closedOrder[i].details.orders[j].cost * +closedOrder[i].details.orders[j].quantity
              numberOfItems = +numberOfItems + +closedOrder[i].details.orders[j].quantity
              if(closedOrder[i].details.deliveryType === 'Delivery'){
                grandTotal = Number(totalPrice) + 100
              }else if(closedOrder[i].details.deliveryType === 'Collection'){
                grandTotal = Number(totalPrice)
              }
            }
            closedOrder[i].details.totalPrice = totalPrice
            closedOrder[i].details.numberOfItems = numberOfItems
            closedOrder[i].details.grandTotal = grandTotal
        this.history.unshift(closedOrder[i])
        this.orderHistoryLength = this.history.length
          }
          return
        }else if(this.history.length > 0){
          for(let i in closedOrder){
            addHistory = false
            for(let key in this.history){
              if(this.history[key].refNo !== closedOrder[i].refNo){
                addHistory = true
              }else if(this.history[key].refNo === closedOrder[i].refNo){
                addHistory = false
                break
              }
            }
            if(addHistory === true){
              totalPrice = 0
              numberOfItems = 0
              grandTotal = 0
              for(let j in closedOrder[i].details.orders){
                //console.log(closedOrder[i].details);
                totalPrice = +totalPrice + +closedOrder[i].details.orders[i].cost * +closedOrder[i].details.orders[i].quantity
                numberOfItems = +numberOfItems + +closedOrder[i].details.orders[i].quantity
                if(closedOrder[i].details.deliveryType === 'Delivery'){
                  grandTotal = Number(totalPrice) + 100
                }else if(closedOrder[i].details.deliveryType === 'Collection'){
                  grandTotal = Number(totalPrice)
                }
              }
              closedOrder[i].details.totalPrice = totalPrice
              closedOrder[i].details.numberOfItems = numberOfItems
              closedOrder[i].details.grandTotal = grandTotal
              this.history.unshift(closedOrder[i])
              this.orderHistoryLength = this.history.length
            }else if(addHistory === false){
      
          }
          }
        }
      }
    })
  }

  // get orders that are closed, history, status == closed
  getOrderHistory(){
    return this.productService.getOrderHistory().then(result => {
      if(result !== null){
        this.history = result
        this.orderHistoryLength = this.history.length
        
        let totalPrice : Number = 0
        let numberOfItems : Number = 0;
        let  grandTotal : Number = 0
        if(this.history.length !== 0){
          for(let key in this.history){
            totalPrice = 0
            numberOfItems = 0
            grandTotal = 0
            for(let i in this.history[key].details.orders){
              //console.log(this.history[key].details);
              totalPrice = +totalPrice + +this.history[key].details.orders[i].cost * +this.history[key].details.orders[i].quantity
              numberOfItems = +numberOfItems + +this.history[key].details.orders[i].quantity
              if(this.history[key].details.deliveryType === 'Delivery'){
                grandTotal = Number(totalPrice) + 100
              }else if(this.history[key].details.deliveryType === 'Collection'){
                grandTotal = Number(totalPrice)
              }
            }
            this.history[key].details.totalPrice = totalPrice
            this.history[key].details.numberOfItems = numberOfItems
            this.history[key].details.grandTotal = grandTotal
          }
        }
      }
    })
  }
  viewOrderHistory(item) {
    //console.log(item);
    let parameter: NavigationExtras = { queryParams: { category: item, link: '/landing', refNo: item.refNo, userID: item.details.uid } }
    this.route.navigate(['order-receipt'], parameter);
    this.hideSideMenu()
  }
  closeOrder(docID) {
    return this.productService.closedOrder(docID).then(result => {

    })
  }

  showPendingList() {
    var historyItems = document.getElementsByClassName("pending-items") as HTMLCollectionOf<HTMLElement>;
    historyItems[0].style.display = "block"
    document.getElementById("helpDesk").style.display = "none"
  }
  showHistoryList() {
    var pendingItems = document.getElementsByClassName("history-items") as HTMLCollectionOf<HTMLElement>;
    pendingItems[0].style.display = "block"
    document.getElementById("helpDesk").style.display = "none"
  }
  showInventoryList() {
    var inventoryItems = document.getElementsByClassName("inventory-items") as HTMLCollectionOf<HTMLElement>;
    inventoryItems[0].style.display = "block"
    document.getElementById("helpDesk").style.display = "none"
  }
  dismissList() {
    var historyItems = document.getElementsByClassName("history-items") as HTMLCollectionOf<HTMLElement>;
    historyItems[0].style.display = "none";
    var pendingItems = document.getElementsByClassName("pending-items") as HTMLCollectionOf<HTMLElement>;
    pendingItems[0].style.display = "none";
    var inventoryItems = document.getElementsByClassName("inventory-items") as HTMLCollectionOf<HTMLElement>;
    inventoryItems[0].style.display = "none"
    document.getElementById("helpDesk").style.display = "block"

  }
  subtract(item) {
    //console.log(item.productID);
    for(let key in this.allProducts){
      if(this.allProducts[key].productID === item.productID){
        if(this.allProducts[key].data.quantity !== 0){
          this.allProducts[key].data.quantity = +this.allProducts[key].data.quantity - 1
        }
      }
    }
  }
  add(item) {
    //console.log(item);
    for(let key in this.allProducts){
      if(this.allProducts[key].productID === item.productID){
        if(this.allProducts[key].data.quantity < 10000){
          this.allProducts[key].data.quantity = +this.allProducts[key].data.quantity + 1
        }

      }
    }
  }
  changeSearchPrice(){
    console.log('changing price');
    
    if(Number(this.updatePrice) < 0){
      this.updatePrice = ''
    }else if(Number(this.updatePrice) > 10000){
      this.updatePrice = '10000'
    }
    this.validateUpdateForm()
  }
  changeQuantity(event, item){
    console.log(item);
    //console.log(event);
    console.log(event.target.value);
    
    let number: number = event.target.value
    console.log(number)
    for(let key in this.allProducts){
      if(this.allProducts[key].productID === item.productID){
        if(number < 0){
          number = 0
          this.allProducts[key].data.quantity = 1
        }else if(number > 100000){
          number = 100000
          this.allProducts[key].data.quantity = 100000
          event.target.value = 100000
        }else{
          this.allProducts[key].data.quantity = +number
        }
      }
    }
    console.log(number)

  }
  saveQuantity(brand, category, productID, quantity) {
    console.log(brand, category, productID, quantity);
    const toast = document.createElement('ion-toast');
    toast.message = 'Your changes have been saved.';
    toast.duration = 2000;
  
    document.body.appendChild(toast);
    if (quantity === '') {
      quantity = 0
    }
    return this.productService.updateQuantity(brand, category, productID, quantity).then(result => {
      console.log(result);
      // alert('Quantity has been saved');
      this.hideSideMenu();
      return toast.present();
    })
  }
  viewPendingOrder(item) {
    //console.log(item);
    let parameter: NavigationExtras = { queryParams: { status: item.details.status, refNo: item.refNo, userID: item.details.userID, user: item.details.name, cell: item.details.cell, currentPage: '/landing' } }
    this.navCtrl.navigateForward(['pending-order'], parameter);
    this.hideSideMenu()
  }

  //Search functionality
  searchInput
  search() {
    this.filterItems(this.allProducts)
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

  addUpdatePicture(event){
    this.updateSearchPic =  <File>event.target.files[0]
    this.pictureUpdate
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.updatePic = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.pictureUpdate = event.target.files[0]
    this.validateUpdateForm()
  }

  //updating items
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
    this.validateUpdateForm()
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
    this.validateUpdateForm()
  }

  showLeftSide() {
    // console.log("Showing left side menu");
    document.getElementById("left-items-list").style.left = "0"
  }
  hideSearchItem(){
    
  }
  searchButtonState: string = "search"
  // setTimeout(() => {
    
  // }, timeout);
  showSearchBar() {
    // document.getElementById("mySearchBar").focus();
    
    // console.log("Showing searchbar");
    if (this.miniSearchBarState == true) {
      this.miniSearchBarState = false;
      // console.log(this.miniSearchBarState);
      this.searchButtonState = "search";
      this.searchInput = ''
    }
    else {
      this.miniSearchBarState = true;
      // console.log(this.miniSearchBarState);
      this.searchButtonState = "close"
    }
  }
  adding:boolean = false;
  showRightSide() {
    // console.log("Showing right side menu");
    document.getElementById("right-items-list").style.right = "0"
    this.adding = true
  }

  sideMenuButtons: boolean = true;
  hideSideMenu() {
  setTimeout(() => {
    this.adding = false;
  }, 200);
    this.sideMenuButtons = true;
    document.getElementById("left-items-list").style.left = "-100%"
    document.getElementById("right-items-list").style.right = "-100%"
  }
  listOfItems: number = 0
  showPendingListSmall() {
    this.sideMenuButtons = false;
    this.listOfItems = 1;
  }
  showHistoryListSmall() {
    this.sideMenuButtons = false;
    this.listOfItems = 2;
  }
  showInventoryListSmall() {
    this.sideMenuButtons = false;
    this.listOfItems = 3;
  }
  stepBackToBtns() {
    this.sideMenuButtons = true;
    this.listOfItems = 0;
  }
  //updateName: string;
  item
  //updatePrice
  //updateDescription
  updatePic : File
  //searchName
  //searchPic
  //searchDescription
  //searchPrice
  updateProductID
  updateBrand
  updateCategory
  updateSearchPic : File
  clickedSearchItem: string = "hideItem"
  showHideSearchDetails(item) {
    console.log("closing");
    
    if (this.clickedSearchItem == "hideItem") {
      this.updateName = item.data.name
      this.updatePrice = item.data.price
      this.updateDescription = item.data.description
      this.updatePic = item.data.pictureLink
      this.pictureUpdate
      this.updateSearchPic = item.data.pictureLink
      this.updateBrand = item.brand
      this.updateCategory = item.category
      this.updateProductID = item.productID
      this.itemSizes = item.data.size
      this.itemColors = item.data.color
      this.item = item
      this.searchedProductStatus = item.data.hideItem
      console.log(this.updatePic);
      
      console.log(item);
      this.clickedSearchItem = "showItem"
      this.updateForm = true
      this.popCheckboxXS = false ;this.popCheckboxS = false ;this.popCheckboxM = false ;this.popCheckboxL = false ;this.popCheckboxXL = false ;this.popCheckboxXXL = false ;this.popCheckboxXXXL = false ;
      this.checkBlack = false; this.checkBrown = false; this.checkOrange = false; this.checkYellow = false; this.checkWhite = false
      for(let key in this.itemSizes){
        if(this.itemSizes[key] === 'XS'){
          this.popCheckboxXS = true
          this.updateSizes.push('XS')
        }else if(this.itemSizes[key] === 'S'){
          this.popCheckboxS = true
          this.updateSizes.push('S')
        }else if(this.itemSizes[key] === 'M'){
          this.popCheckboxM = true
          this.updateSizes.push('M')
        }else if(this.itemSizes[key] === 'L'){
          this.popCheckboxL = true
          this.updateSizes.push('XL')
        }else if(this.itemSizes[key] === 'XL'){
          this.popCheckboxXL = true
          this.updateSizes.push('XXL')
        }else if(this.itemSizes[key] === 'XXL'){
          this.popCheckboxXXL = true
          this.updateSizes.push('XXL')
        }else if(this.itemSizes[key] === 'XXXL'){
          this.popCheckboxXXXL = true
          this.updateSizes.push('XXXL')
        }
      }
      for(let key in this.itemColors){
        if(this.itemColors[key] === 'Black'){
          this.checkBlack = true
          this.updateSizes.push('XS')
        }else if(this.itemColors[key] === 'Brown'){
          this.checkBrown = true
          this.updateSizes.push('S')
        }else if(this.itemColors[key] === 'Orange'){
          this.checkOrange = true
          this.updateSizes.push('M')
        }else if(this.itemColors[key] === 'Yellow'){
          this.checkYellow = true
          this.updateSizes.push('XL')
        }else if(this.itemColors[key] === 'White'){
          this.checkWhite = true
          this.updateSizes.push('XXL')
        }
      }
      setTimeout(() => {
        this.searchInput = ''
      }, 100);
    }
    else {
      this.clickedSearchItem = "hideItem"
    }
  }

  addPictureUpdate(event){
    this.pictureUpdate = <File>event.target.files[0]
  }

  updateItem() {
    this.presentLoading()
    console.log(this.updateProductID, this.updateBrand, this.updateCategory, this.updatePrice, this.updateDescription, this.updateName, this.itemSizes, this.pictureUpdate, this.itemColors);
    //console.log(this.updateName);
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
    this.cutDoubleSpace(this.updateName).then(result => {
      this.updateName = result
    }).then( result => {
      this.cutDoubleSpace(this.updateDescription).then(result => {
        this.updateDescription = result
      }).then( () => {
        return this.productService.updateItemsListItem(this.updateProductID, this.updateBrand, this.updateCategory, this.updatePrice, this.updateDescription, this.updateName, this.itemSizes, this.pictureUpdate, this.itemColors).then(result => {
          console.log(result);
          if (result === 'success') {
            console.log(result);
            this.showHideSearchDetails('close')
            this.loadingCtrl.dismiss()
          }
        })
      })
    })
  }

  async productAlert(message) {
    const alert = await this.alertController.create({
      header: 'Success!',
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

  async errorLoading() {
    const alert = await this.alertController.create({
      header: 'Error!',
      message: 'We are having a problem loading your items, please reload or check your internet connection',
      buttons: [
        {
          text: 'Reload',
          handler: (reload) => {

          }
        },
        {
          text: 'Okay',
          handler: (okay) => {
            
          }
        }
      ]
    })
    await alert.present()
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
    this.presentLoading()
    return this.productService.deleteItemFromInventory(productID, brand, category, item).then(result => {
      console.log(result);
      if(result = 'Deleted'){
        this.loadTotalNumberOfProducts()
        this.loadingCtrl.dismiss()
        this.productAlert('Product was successfully deleted')
        this.showHideSearchDetails('close')
        // for(let key in this.allProducts){
        //   if(productID === this.allProducts[key].productID){

        //   }
        // }
      }
    })
  }

  hideItem(productID, brand, category, item) {
    return this.productService.hideProduct(productID, brand, category, item).then(result => {
    }).then(result => {
      this.getHideStatus(productID, brand, category)
    })
  }
  showItem(productID, brand, category, item) {
    return this.productService.showProduct(productID, brand, category, item).then(result => {
    }).then(result => {
      this.getHideStatus(productID, brand, category)
    })
  }
  getHideStatus(productID, brand, category){
    firebase.firestore().collection('Products').doc(brand).collection(category).doc(productID).onSnapshot(result => {
      let status : Boolean = result.data().hideItem
      this.item.data['hideItem'] = status      
      this.searchedProductStatus = status
    })
  }
  reloadPage(){
    window.location.reload()
  }


  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();

    // console.log('Loading dismissed!');
  }
  checkConnectionStatus(){
    console.log('me too');
    console.log(this.isCached);
    console.log(this.isOnline);
    console.log(this.timer);
    
    
    if(navigator.onLine){
      this.isOnline = true
      console.log('isOnline', this.isOnline);
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

      console.log('isOnline', this.isOnline);
    }
  }
  timer
  pageLoader : boolean
  ionViewDidEnter(){
    //console.log('hahahahahaahahahahahah');
    if(this.preventIonViewDidEnterInit === true){

    }else{
      if(this.isCached !== true){
        // this.presentLoading()
        // this.pageLoader = true
      }else{
        this.pageLoader = false
      }
      console.log(this.isOnline);
      console.log(this.isCached);
      this.timer = setInterval( () => {
        this.checkConnectionStatus()
      }, 3000)
    }

    //console.log('ion view did enter');

  }

  ionViewWillLeave(){
    console.log('ion view will leave')
  }

  ionViewDidLeave(){
  }

  ionViewWillLoad(){
    console.log('ion view will load');
  }
  
  goToHelpDesk(){
    
    this.route.navigate(['/home', 'FAQs'])
  }
  sortArray(array){
    return new Promise((resolve, reject) => {
      let sort : Array<string> = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      let tempColor = array
      array = []
      for(let color in sort){
        for(let i in tempColor){
          if(sort[color] === tempColor[i]){
            array.push(sort[color])
          }
        }
      }
      //console.log(array);
      resolve(array)
    
    })
  }

  modifyLocalObjects(result, brand, category){
    let items : Array<any> = []
    let data : object = {}
    let productID = ''
    let docData
    let addItems : boolean
    for(let key in result.docChanges()){
      let change = result.docChanges()[key]
      if(change.type === 'added'){
        data = {}
        productID = change.doc.id
        docData = change.doc.data()
        data = {productID: productID, data: docData, category: category, brand: brand}
        // items.push(data)
      }else if(change.type === 'removed'){
        productID = change.doc.id
        for(let key in this.allProducts){
          if(productID === this.allProducts[key].productID){
            let index = Number(key)
            this.allProducts.splice(index, 1)
            this.inventoryLength = this.allProducts.length
          }
        }
        if(brand === 'Dankie Jesu'){
          if(change.doc.data().isSummer === true){
            for(let key in this.summerGear){
              if(productID === this.summerGear[key].productID){
                let index = Number(key)
                this.summerGear.splice(index, 1)

              }
            }
          }else if(change.doc.data().isSummer === false){
            for(let key in this.winterGear){
              if(productID === this.winterGear[key].productID){
                let index = Number(key)
                this.winterGear.splice(index, 1)
              }
            }
          }
        }else if(brand === 'Kwanga'){
          for(let key in this.kwangaGear){
            if(productID === this.kwangaGear[key].productID){
              let index = Number(key)
              this.kwangaGear.splice(index, 1)
            }
          }
        }
        if(this.kwangaGear.length > 0){
          this.sortKwangaProducts()
        }
        if(this.summerGear.length > 0){
          this.sortSummerProducts()
        }
        if(this.winterGear.length > 0){
          this.sortWinterProducts()
        }
      }else if(change.type === 'modified'){
        productID = change.doc.id
        docData = change.doc.data()
        data = {productID: productID, data: docData, category: category, brand: brand}
        items.push(data)
        for(let key in this.allProducts){
          if(this.allProducts[key].productID === productID){
            this.allProducts[key].data = docData
          }
        }
        if(this.allProducts.length === 0){
          this.allProducts = items
          this.inventoryLength = this.allProducts.length
          if(brand === 'Dankie Jesu'){
            if(items[0].data.isSummer === true){
              this.summerGear.unshift(data)
            }else if(items[0].data.isSummer === false){
              this.winterGear.unshift(data)
            }
          }else if(brand === 'Kwanga'){
            this.kwangaGear.unshift(data)
          }
        }else if(this.allProducts.length > 0){
          for(let i in items){
            addItems = false
            for(let key in this.allProducts){
              if(this.allProducts[key].productID !== items[i].productID){
                addItems = true
              }else if(this.allProducts[key].productID === items[i].productID){
                addItems = false
                let logo : Array<any> = []
                logo.push(addItems);
                break
              }
            }
            if(addItems === true){
              this.allProducts.unshift(data)
              this.inventoryLength = this.allProducts.length
              if(brand === 'Dankie Jesu'){
                if(this.summer === true){
                  this.summerGear.unshift(data)
                  if(this.summerGear.length > 6){
                    this.summerGear.splice(this.summerGear.length - 1, 1)
                  }
    
                }else if(this.summer === false){
                  this.winterGear.unshift(data)
                  if(this.winterGear.length > 6){
                    this.winterGear.splice(this.winterGear.length - 1, 1)
                  }
                }
              }else if(brand === 'Kwanga'){
                this.kwangaGear.unshift(data)
                if(this.kwangaGear.length > 3){
                  this.kwangaGear.splice(this.kwangaGear.length - 1, 1)
                }
              }
            }
          }
        }
      }
    }

    let addToWinter : boolean
    let addToSummer : boolean
    let addToKwanga : boolean

///////////////////////////////////////////////////////////////////
    for(let i in this.allProducts){
      for(let j in this.summerGear){
      if(this.allProducts[i].brand === 'Dankie Jesu'){
        if(this.allProducts[i].data.isSummer === true){
          if(this.allProducts[i].productID !== this.summerGear[j].productID){
            addToSummer = true
          }else if(this.allProducts[i].productID === this.summerGear[j].productID){
            addToSummer = false
            return
          }
          }
        }
      }
      if(addToSummer === true){
        if(this.summerGear.length < 6){
          this.summerGear.push(this.allProducts[i])
        }
      }
    }
    for(let i in this.allProducts){
      //addToWinter = false
      for(let j in this.winterGear){
      if(this.allProducts[i].brand === 'Dankie Jesu'){
        if(this.allProducts[i].data.isSummer === false){
          if(this.allProducts[i].productID !== this.winterGear[j].productID){
            addToWinter = true
          }else if(this.allProducts[i].productID === this.winterGear[j].productID){
            addToWinter = false
            break
          }
          }
        }
      }
      if(addToWinter === true){
        if(this.winterGear.length < 6){
          this.winterGear.push(this.allProducts[i])
        }
      }
      if(addToSummer === true){
        if(this.summerGear.length < 6){
          this.summerGear.push(this.allProducts[i])
        }
      }
    }
    for(let i in this.allProducts){
      for(let j in this.kwangaGear){
      if(this.allProducts[i].brand === 'Kwanga'){
          if(this.allProducts[i].productID !== this.kwangaGear[j].productID){
            addToKwanga = true            
          }else if(this.allProducts[i].productID === this.kwangaGear[j].productID){
            addToKwanga = false
            break
          }
        }
      }
      if(addToKwanga === true){
        if(this.kwangaGear.length < 3){
          this.kwangaGear.push(this.allProducts[i])
        }
      }
    }
    if(this.kwangaGear.length > 0 ){
      this.sortKwangaProducts()
    }
    if(this.summerGear.length > 0){
      this.sortSummerProducts()
    }
    if(this.winterGear.length > 0){
      this.sortWinterProducts()
    }
  }

  newProductNameMatch
 private cutNameArray(checkVal){
    return new Promise( (resolve, reject) => {
      let array = checkVal.reverse()
        while(array[0] === ' '){
          array.splice(0, 1)
          console.log(array);
      }
      resolve (array.reverse())
    })
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
    }
      resolve ((arrayReverse.reverse()).join(''))
    })
  }
  showSearch : boolean
  findMatch(event, item){
    console.log(event);
    let val
    if(event.keyCode === 13){
      //this.searchInventoryVal = []
      this.showSearch = false
      val = this.itemName.toLowerCase()
    }else{
      this.showSearch = true
      val = event.target.value.toLowerCase()
    }
    console.log(this.itemName);
    
console.log(val);

    if(item === null){
      let match 
      if(val !== '' && val !== '*'){
        let checkVal : Array<string> = val.split('')
        this.cutDoubleSpace(val).then((result) => {
          let joined = result
          this.searchInventory(joined, event.target.tagName)
          for(let key in this.allProducts){
            if(joined === this.allProducts[key].data.name.toLowerCase()){
              this.newProductNameMatch = true
              if(this.allProducts[key].category === this.selectedCategory){
                this.categoryMatch = true
                break
              }else{
                this.categoryMatch = false
              }
              console.log(joined, this.allProducts[key].data.name.toLowerCase() );
              break
            }else{
              //console.log(joined, this.allProducts[key].data.name.toLowerCase() );
              this.newProductNameMatch = false
              this.categoryMatch = false
            }
          }
          this.checkValidity()
        })
        }else if(val === ''){
        this.categoryMatch = false
        this.searchInventoryVal = []
      }
    }else{
      console.log('item is not null');
      let match 
      if(val !== '' && val !== '*'){
        let checkVal : Array<string> = val.split('')
        this.cutDoubleSpace(val).then((result) => {
          let joined = result
          for(let key in this.allProducts){
            if(joined === this.allProducts[key].data.name.toLowerCase()){
              this.newProductNameMatch = true
              if((this.allProducts[key].category === item.category) && (this.allProducts[key].productID !== item.productID)){
                this.categoryUpdateMatch = true
                this.validateUpdateForm()
                break
              }else{
                this.categoryUpdateMatch = false
                this.validateUpdateForm()
              }
              break
            }else{
              //console.log(joined, this.allProducts[key].data.name.toLowerCase() );
              this.newProductNameMatch = false
              this.categoryUpdateMatch = false
              this.validateUpdateForm()
            }
          }
        })
      }else if(val === ''){
        this.categoryMatch = false
        this.searchInventoryVal = []
        this.validateUpdateForm()
      }
    }
    // console.log(this.categoryMatch);
    // let catMatch : boolean = this.categoryMatch
    // if(event.keyCode === 13){
    //   this.searchInventoryVal = []
    //   this.categoryMatch = catMatch
    //   console.log(this.categoryMatch);
      
    // }
  }
  
  searchInventoryVal : Array<any> = []
  searchSideInventory : Array<any> = []
  categoryMatch : boolean
  categoryUpdateMatch : boolean
  inventorySearch : boolean
  searchInventory(event, tag){
    this.inventorySearch = false
    let val = ''
    if(event.target){
      val = event.target.value.toLowerCase()
    }else{
      val = event.toLowerCase()
    }

    if(tag !== null){
      if(val !== '' && val !== '*' && tag !== 'function'){
        this.searchInventoryVal = this.allProducts.filter(item => item.data.name.toLowerCase().indexOf(val) >= 0)
        for(let key in this.searchInventoryVal){
          if((this.searchInventoryVal[key].category === this.selectedCategory) && tag !== 'function'){
           // this.categoryMatch = true
            console.log(this.searchInventoryVal[key]);
            
            break
          }else{
           // this.categoryMatch = false
          }
        }
      }else{
        this.searchInventoryVal = []
       // this.categoryMatch = false
      }
    }else if(tag === null){

      this.cutDoubleSpace(val).then( (result : any) => {
        val = result
        if(val !== '' && val !== '*' && tag !== 'function'){
          this.inventorySearch = true
          this.searchSideInventory = this.allProducts.filter(item => item.data.name.toLowerCase().indexOf(val) >= 0)
          for(let key in this.searchSideInventory){
            if((this.searchSideInventory[key].category === this.selectedCategory) && tag !== 'function'){
             // this.categoryMatch = true
              console.log(this.searchSideInventory[key]);
              
              break
            }else{
             // this.categoryMatch = false
            }
          }
        }else{
          this.searchSideInventory = []
          this.inventorySearch = false
         // this.categoryMatch = false
        }
      })

    }
    console.log(this.searchSideInventory);
    
    console.log(this.searchInventoryVal);
    
  }
  newProductCode : string = ''
  autoGenerateCode(){
    let date2 =    moment(moment.utc(new Date().getTime())).format('X')
    this.newProductCode = date2
    this.checkValidity()
    for(let key in this.allProducts){
      if(this.allProducts[key].data.productCode){
        if(this.newProductCode === this.allProducts[key].data.productCode){
          this.autoGenerateCode()
        }
      }
    }
  }
  autoFillItemName(name){
    this.itemName = name
    let event : object = {}
    event = { target : {value : this.itemName, tagName : 'function'}}
    this.findMatch(event, null)
    this.searchInventoryVal = []
  }
  autoPopulate(){
    this.clearForm()
    // console.log('dfgdfgdfgdf', this.mbdepartmentCombo);
    // console.log ('fdfgd',this.nativeCategory);
    
    // this.mbdepartmentCombo.nativeElement.value = 'fvvdvxcvx'
    // this.nativeCategory.nativeElement.value = this.selectedCategory
    
    
  }
  // dismissAutocomplete(event){
  //   console.log(event.keyCode);
  //   console.log(this.categoryMatch);
    
  //   if(event.keyCode === 13){
  //     console.log(this.categoryMatch);
      
  //     let categoryMatch : boolean = this.categoryMatch
  //     this.searchInventoryVal = []
  //     this.categoryMatch = categoryMatch
  //     console.log(this.categoryMatch);
      
  //   }
  // }

  // changeDepartment(event) {
  //   console.log(this.categoryList);
  //   this.categoryOptions = ['Select Category']
  //   this.department = event.target['value']
  //   console.log(this.department)
  //   for(let key in this.categoryList){
  //     if(this.department === this.categoryList[key].brand){
  //       console.log(this.categoryList[key]);
  //       for(let i in this.categoryList[key].categoryList){
  //         this.categoryOptions.push(this.categoryList[key].categoryList[i].category)
  //       }
  //       //console.log(options);
        
  //     }
  //   }
  //   // if (this.department === 'Dankie Jesu') {
  //   //   this.categoryOptions = ['Select Category', 'Vests', 'Caps', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts', 'Sweaters', 'Hoodies', 'Track Suits', 'Beanies', 'Bags']
  //   // }
  //   // if (this.department === 'Kwanga') {
  //   //   this.categoryOptions = ['Select Category', 'Formal', 'Traditional', 'Smart Casual', 'Sports']
  //   // }
  //   if (this.department === 'Select Brand') {
  //     this.department = undefined
  //     this.nativeCategory.nativeElement.disabled = true   ////
  //     this.nativeCategory.nativeElement.value = 'Select Category'   ///
  //   }else{
  //     this.nativeCategory.nativeElement.disabled = false   ////
  //   }
  //   this.checkValidity()
  // }

  // changeCategory(event) {
  //   this.selectedCategory = event.target['value']
  //   if (this.selectedCategory === 'Select Category') {
  //     this.selectedCategory = 'Select Category'
  //   }
  //   for(let key in this.categoryList){
  //     if(this.department === this.categoryList[key].brand){
  //       for(let i in this.categoryList[key].categoryList){
  //         if(this.categoryList[key].categoryList[i].category === this.selectedCategory){
  //           this.summer = this.categoryList[key].categoryList[i].isSummer
  //         }
  //       }
  //     }
  //   }
  //   console.log(this.summer);
    
  //   for(let key in this)
  //   // if(this.selectedCategory === 'Vests' || this.selectedCategory === 'Caps' || this.selectedCategory === 'Bucket Hats' || this.selectedCategory === 'Shorts' || this.selectedCategory === 'Crop Tops' || this.selectedCategory === 'T-Shirts'){
  //   //   this.summer = true
  //   // }   /// 'Sweaters', 'Hoodies', 'Track Suits', 'Beanies', 'Bags')
  //   // if(this.selectedCategory === 'Sweaters' || this.selectedCategory === 'Hoodies' || this.selectedCategory === 'Track Suits' || this.selectedCategory === 'Beanies'){
  //   //   this.summer = false
  //   // }
    
  //   if(this.selectedCategory === 'Bags' || this.selectedCategory === 'Caps' || this.selectedCategory === 'Bucket Hats' || this.selectedCategory === 'Beanies'){
  //     this.accessory = true   ///, 'Bags'))
  //   }else{
  //     this.accessory = false
  //   }

  //   this.checkValidity()
  // }
}
