import { Component, OnInit, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { RouteService } from '../services/route-services/route.service';
import * as firebase from 'firebase'

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.page.html',
  styleUrls: ['./subcategories.page.scss'],
})
export class SubcategoriesPage implements OnInit {
  currentBrand : string = ''
  currentBrandID : string = ''
  pictureLink
  @ViewChild('loaderDiv', {static: true}) loaderDiv: ElementRef
  constructor(private render: Renderer2, public loadingCtrl: LoadingController, private activatedRoute : ActivatedRoute, private routeService : RouteService, private alertController : AlertController, private authService : AuthService, private navCtrl : NavController, public route : Router, public productService : ProductsService) { }

  ngOnInit() {
    // this.presentLoading()
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    this.currentBrand = this.activatedRoute.snapshot.paramMap.get('id')
    console.log(this.currentBrand);
    
    this.routeService.getBrandInfo().then(result => {
      console.log(result);
      this.pictureLink = result['pictureLink']
      console.log(this.pictureLink);
      this.currentBrandID = result['brandID']
      this.getCategories(this.currentBrandID)
      this.loadAllProducts()
      setTimeout( () => {
        this.getCategoriesSnap(this.currentBrandID)
        this.refreshProducts()
      }, 1000)

    })

  }

  navigateForward(item : any){
    console.log(item);
    
    if(item === 'All'){
      console.log(true);
      
      let parameter : object = {data: {}}
      parameter['data'].pictureLink = this.pictureLink
      parameter['data'].name = this.currentBrand
      parameter['data'].brandID = this.currentBrandID
      console.log(parameter);
      
      this.routeService.storeBrandItemsListParameters(parameter).then(result => {

      })
      this.route.navigate(['items-list', 'All'])
    }else if(item !== 'All'){
      console.log(false);
      
      this.routeService.storeParemeter(item).then(result => {

      })
      this.route.navigate(['/items-list', item.data.name])
    }

  }

  categories
  getCategories(query){
    return this.productService.getBrandCategories(query).then(result => {
      console.log(result);
      this.categories = result
      setTimeout( () => {
        try {
          // this.loadingCtrl.dismiss()
          this.dismissLoader()
        } catch (error) {
          console.log(error);
          
        }

      }, 600)

    })
  }
  getCategoriesSnap(currentBrandID){
    console.log('getting snaps');
    
    return firebase.firestore().collection('category').where('brandID', '==', currentBrandID).onSnapshot(data => {
      
      
      for(let key in data.docChanges()){
        let change = data.docChanges()[key]
        let addToCategories : boolean = false
        if(change.type === 'added'){
          if(this.categories.length === 0){
            if(change.doc.data().deleteQueue === false){
              console.log('well this is nt working');
              
              addToCategories = true
            }else{
              console.log('this might be working');
              
              addToCategories = false
            }
          }else{
            console.log('lengthu');
            
            for(let i in this.categories){
              if(this.categories[i].categoryID === change.doc.id){
                if(change.doc.data().deleteQueue === false){
                  this.categories[i] = {data: change.doc.data(), categoryID: change.doc.id}
                }else if(change.doc.data().deleteQueue === true){
                  this.categories.splice(Number(i), 1)
                }
                addToCategories = false
                break
              }else if(this.categories[i].categoryID !== change.doc.id){
                console.log(change.doc.id);
                
                if(change.doc.data().deleteQueue === true){
                  addToCategories = false
                  console.log(true);
                  
                }else if(change.doc.data().deleteQueue === false){
                  addToCategories = true
                }
  
              }
            }
          }

          if(addToCategories === true){
            console.log('hahaha me too');
            
            this.categories.unshift({data: change.doc.data(), categoryID: change.doc.id})
          }
        }else if(change.type === 'modified'){
          console.log('modified');
          
          let addToCategoriesToo : boolean = false
          if(this.categories.length === 0){
            if(change.doc.data().deleteQueue === true){
              addToCategoriesToo = false
            }else{
              addToCategoriesToo = true
            }
          }
          for(let i in this.categories){
            console.log(i, ' in this.categories');
            
            if(this.categories[i].categoryID === change.doc.id){
              if(change.doc.data().deleteQueue === true){
                this.categories.splice(Number(i), 1)
              }else if(change.doc.data().deleteQueue === false){
                this.categories[i] === {data: change.doc.data(), categoryID: change.doc.id}
              }
              addToCategoriesToo = false
              break
            }else if(this.categories[i].categoryID !== change.doc.id){
              if(change.doc.data().deleteQueue === true){
                addToCategoriesToo = false
              }else{
                addToCategoriesToo = true
              }

            }
          }
          if(addToCategoriesToo === true){
            this.categories.unshift({data: change.doc.data(), categoryID: change.doc.id})
          }
        }
      }
      //this.loadingCtrl.dismiss()
    })
  }
  back(){
    this.route.navigate(['/landing'])
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();

    // console.log('Loading dismissed!');
  }
  allProducts: Array<any> = []
  searchInput: string = ""
  searchArray: Array<any> = []
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
  loadAllProducts(){

    // this.pageLoader = true
    return this.productService.loadAllProducts().then((result : any) => {
      //this.presentLoading()
      console.log(result);
      
      if(result){
        this.allProducts = result
        for(let key in this.allProducts){
          console.log(this.allProducts[key]);
          firebase.firestore().collection('Products').doc(this.allProducts[key].productID).update({
            deleteQueue: false
          })
        }
      }
    })
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
  goHome() {
    this.route.navigate(['/landing']);
  }
  refreshProducts(){
    firebase.firestore().collection('Products').onSnapshot(result => {
      console.log('onsnapshot');
      
      let data : object = {}
      let productID : string = ''
      let docData : object = {}
      let category : string = ''
      let brand : string = ''
      let item : Array<any> = []
      for(let key in result.docChanges()){
        //console.log(result.docChanges()[key]);
        let change = result.docChanges()[key]
        if(change.type === 'modified'){
         // console.log('yuno');
          let oldIndex = change.oldIndex
          console.log(oldIndex);
          
          if(oldIndex === -1){
            data = {}
            productID = change.doc.id
            docData = change.doc.data()
            data = {productID: productID, data: docData, category: docData['category'], categoryID: docData['categoryID'], brand: docData['brand'], brandID: docData['brandID']}
            //console.log(data);
           this.allProducts.unshift(data)
           // console.log(this.allProducts);
            
          }else if(oldIndex !== -1){
            console.log('modified using oldIndex !== -1');
            data = {}
            productID = change.doc.id
            docData = change.doc.data()
            data = {productID: productID, data: docData, category: docData['category'], categoryID: docData['categoryID'], brand: docData['brand'], brandID: docData['brandID']}
            //console.log(data);
            let addQueueChange : boolean = false
            for(let key in this.allProducts){
              if(this.allProducts[key].productID === productID){
                if(change.doc.data().deleteQueue === false){
                  this.allProducts[key] = data
                }else{
                  this.allProducts.splice(Number(key), 1)
                }
                addQueueChange = false
                break
              }else{
                if(change.doc.data().deleteQueue === false){
                  addQueueChange = true
                }
              }
            }
            if(addQueueChange === true){
              this.allProducts.unshift(data)
            }
          //  console.log(this.allProducts);
            
          }
        }else if(change.type === 'removed'){
          //console.log('removed');
          
          data = {}
          productID = change.doc.id
         // console.log(productID);
          
          for(let key in this.allProducts){
            if(productID === this.allProducts[key].productID){
            //  console.log(this.allProducts);
              
           //   console.log('matching productID');
              
              this.allProducts.splice(Number(key), 1)
            }
          }
        }else{
          let addItem : boolean = false
          //console.log('added new item');
          data = {}
          productID = change.doc.id
          docData = change.doc.data()
          data = {productID: productID, data: docData, category: docData['category'], categoryID: docData['categoryID'], brand: docData['brand'], brandID: docData['brandID']}
          for(let key in this.allProducts){
            if(productID === this.allProducts[key].productID){
              if(change.doc.data().deleteQueue === false){
                addItem = false
                break
              }else{
                addItem = false
                this.allProducts.splice(Number(key), 1)
                break
              }
            }else{
              if(change.doc.data().deleteQueue === false){
                addItem = true
              }else{
                addItem = false
              }

            }
          }
          if(this.allProducts.length === 0){
            addItem = true
          }
          console.log(addItem);
          
          if(addItem === true){
          //  console.log(true);
                        
           this.allProducts.unshift(data)
          }else{
          //  console.log(false);

          }
        }
      }
    })
  }
  search() {
    this.fnHideSearchResults(false)
    this.filterItems(this.allProducts)
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
}
