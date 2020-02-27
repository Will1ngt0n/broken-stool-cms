import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { RouteService } from '../services/route-services/route.service';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.page.html',
  styleUrls: ['./subcategories.page.scss'],
})
export class SubcategoriesPage implements OnInit {
  currentBrand : string = ''
  pictureLink

  constructor(private activatedRoute : ActivatedRoute, private routeService : RouteService, private alertController : AlertController, private authService : AuthService, private navCtrl : NavController, public route : Router, public productService : ProductsService) { }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    this.currentBrand = this.activatedRoute.snapshot.paramMap.get('id')
    this.getCategories(this.currentBrand)
  }

  navigateForward(item : any){
    console.log(item);
    
    if(item === 'All'){
      console.log(true);
      
      let parameter : object = {data: {}}
      parameter['data'].pictureLink = this.pictureLink
      parameter['data'].name = this.currentBrand
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
    })
  }
  back(){
    this.route.navigate(['/landing'])
  }
  
}
