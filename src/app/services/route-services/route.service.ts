import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Location } from '@angular/common'
@Injectable({
  providedIn: 'root'
})
export class RouteService {
  link
  parameters : object 
  constructor( private localStorage : LocalStorageService, private loc : Location) { }
  storeParemeter (item){
    return new Promise((resolve, reject) => {
     // this.parameters = {category: category, brand: brand, title: title, link: link}
      let loc = this.loc['_platformLocation'].location.origin
      this.localStorage.store('parameters:' + loc, item)
      resolve ('success')
    })
  }
  //required for subcategories page, storing all brand info available from landing page || saved in subcategories
  storeBrandInfo(info){
    return new Promise( (resolve, reject) => {
      let loc = this.loc['_platformLocation'].location.origin
      this.localStorage.store('brandInfo:' + loc, info)
    })
  }
    //required for subcategories page, getting all brand info available on subcategories page || viewed in subcategories
  getBrandInfo(){
    return new Promise( (resolve, reject) => {
      let loc = this.loc['_platformLocation'].location.origin
      resolve (this.localStorage.retrieve('brandInfo:' + loc))
    })
  }

  //required by the items-list page, for checking difference between "All brands view" or "selected brand view"  || saved in subcategory page
  storeBrandItemsListParameters(data){
    return new Promise( (resolve, reject) => {
      let loc = this.loc['_platformLocation'].location.origin
      this.localStorage.store('allCategories:' + loc, data)
      resolve('success')
    })
  }
  //required by the items-list page, for checking difference between "All brands view" or "selected brand view"  || viewed in items-list
  readBrandItemsListParameters(){
    return new Promise( (resolve, reject) => {
      let loc = this.loc['_platformLocation'].location.origin
      resolve(this.localStorage.retrieve('allCategories:' + loc))
    })
  }
  readParameters(){
    return new Promise((resolve, reject) => {
      let loc = this.loc['_platformLocation'].location.origin
      resolve (this.localStorage.retrieve('parameters:' + loc))
    })
  }
}
