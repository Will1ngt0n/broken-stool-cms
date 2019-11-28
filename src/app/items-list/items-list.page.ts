import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  promoUdpate: string;
  constructor() { }

  ngOnInit() {
  }

  togglePromo(){
    var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf <HTMLElement>;

    promoUpd[0].style.display = "flex";
    this.promoUdpate = "Promote item"
  }
  toggleUpdate(){
    var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf <HTMLElement>;

    promoUpd[0].style.display = "flex";
    this.promoUdpate = "Update item"
  }
  dismissPromo(){
    var promoUpd = document.getElementsByClassName("del-upd-del") as HTMLCollectionOf <HTMLElement>;

    promoUpd[0].style.display = "none"
  }
}
