import { Component, OnInit} from '@angular/core';
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

  constructor(public loadingCtrl: LoadingController, private activatedRoute : ActivatedRoute, private routeService : RouteService, private alertController : AlertController, private authService : AuthService, private navCtrl : NavController, public route : Router, public productService : ProductsService) { }

  ngOnInit() {
    this.presentLoading()
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    this.currentBrand = this.activatedRoute.snapshot.paramMap.get('id')
    console.log(this.currentBrand);
    
    this.routeService.getBrandInfo().then(result => {
      console.log(result);
      this.pictureLink = result['pictureLink']
      console.log(this.pictureLink);
      this.currentBrandID = result['brandID']
      this.getCategories(this.currentBrandID)
      setTimeout( () => {
        this.getCategoriesSnap(this.currentBrandID)
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
          this.loadingCtrl.dismiss()
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
  
}
