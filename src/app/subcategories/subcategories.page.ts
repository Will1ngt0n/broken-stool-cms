import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private routeService : RouteService, private alertController : AlertController, private authService : AuthService, private navCtrl : NavController, public route : Router, public productService : ProductsService) { }

  ngOnInit() {
  }

  navigateForward(value){
    return this.routeService.storeParemeter(value, 'Dankie Jesu', 'Summer Gear', 'summer-gear').then(result => {
      this.route.navigate(['/items-list', value])
    })

  }
  back(){
    this.route.navigate(['/landing'])
  }
  
}
