import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ProductsService } from '../services/products-services/products.service';
import { AuthService } from '../services/auth-services/auth.service';
import { RouteService } from '../services/route-services/route.service';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.page.html',
  styleUrls: ['./subcategories.page.scss'],
})
export class SubcategoriesPage implements OnInit {
  query
  constructor(private activatedRoute : ActivatedRoute, private routeService : RouteService, private alertController : AlertController, private authService : AuthService, private navCtrl : NavController, public route : Router, public productService : ProductsService) { }

  ngOnInit() {
this.routeService.getLink().then(result => {
  
})
    this.getCategories()
  }

  navigateForward(value){
    return this.routeService.storeParemeter(value, 'Dankie Jesu', 'Summer Gear', 'summer-gear').then(result => {
      this.route.navigate(['/items-list', value])
    })

  }
  categories
  getCategories(){
    return this.productService.getBrandCategories('Dankie Jesu').then(result => {
      console.log(result);
      this.categories = result
    })
  }
  back(){
    this.route.navigate(['/landing'])
  }
  
}
