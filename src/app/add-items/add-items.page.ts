import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import { LoginPageModule } from '../login/login.module';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.page.html',
  styleUrls: ['./add-items.page.scss'],
})
export class AddItemsPage implements OnInit {
  department : any
  summer : boolean = false
  winter : boolean = false
  kwanga : boolean = false
  categoryOptions : Array<any> = ['Category']
  selectedCategory : any
  itemName : String 
  price : String
  description : String
  size : Array<any> = []
  constructor(public route : Router, public authService : AuthService) {
    // this.authService.checkingAuthState().then( (result : any) => {
    //   let user : any = result
    //   if (user === null){
    //     this.route.navigate(['/login'])
    //   }
    // })
    console.log(this.department);
    
  }
  changeDepartment(event){
    console.log(event.target['value']);
    this.department = event.target['value']
    if(this.department === 'Summer'){
      this.categoryOptions = ['Vests', 'Caps ', 'Bucket Hats', 'Shorts', 'Crop Tops', 'T-Shirts']
    }
    if(this.department === 'Winter'){
      this.categoryOptions = ['Sweaters', 'Hoodies', 'Track Suits', 'Winter Hats']
    }
    if(this.department === 'Kwanga'){
      this.categoryOptions = ['Formal', 'Tradition ', 'Smart Casual', 'Sports wear']
    }
    if(this.department === 'Bags'){
      this.categoryOptions = ['Side Bag', 'Back pack']
    }
  }
  changeCategory(){
    console.log(event.target['value']);
    this.selectedCategory = event.target['value']
  }
  ngOnInit() {
  }

  ionViewDidEnter(){
    // this.department = <HTMLInputElement>document.querySelector('#selectDep')
    // console.log(this.department.addEventListener('change', (event) => {
    //   console.log(event.detail);
    //   console.log(event.target['value']);
      
    // }));
  }
  check(event, size){
    console.log(size);
    
    console.log(this.size);
    let checkbox = event.target['name']
    if(checkbox){
      if(event.target.checked=== true){
        this.size.push(size)
        console.log(this.size);
      }else if(event.target.checked=== false) {
        let index = this.size.indexOf(size)
        console.log(index);
        
        this.size.splice(index, 1)
        console.log(this.size);
      
      }
    }

  
    

    console.log(event.target.checked);
    console.log(event.target['name']);
    document.getElementById('check')
    console.log(document.getElementById('check'));
    
  }
  setSize(size){
    console.log(this.size);
    
  }
  addItem(){
    this.route.navigate(['/'])
  }
  addProduct(){

  }
  clearForm(){

  }
}
