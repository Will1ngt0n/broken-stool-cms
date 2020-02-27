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
  storeLink(link){
    return new Promise( (resolve, reject) => {
      this.localStorage.store('link', link)
    })
  }
  getLink(){
    return new Promise( (resolve, reject) => {
      this.localStorage.retrieve('link')
    })
  }

  storeBrandItemsListParameters(data){
    return new Promise( (resolve, reject) => {
      let loc = this.loc['_platformLocation'].location.origin
      this.localStorage.store('allCategories:' + loc, data)
      resolve('success')
    })
  }
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
