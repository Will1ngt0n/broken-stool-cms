import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsListPageRoutingModule } from './items-list-routing.module';

import { ItemsListPage } from './items-list.page';
// import { LoaderComponent } from '../components/loader/loader.component';
import { LoaderComponentModule } from '../components/loader/loader.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsListPageRoutingModule,
    LoaderComponentModule
  ],
  declarations: [ItemsListPage]
})
export class ItemsListPageModule {}
