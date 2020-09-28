import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriesPageRoutingModule } from './subcategories-routing.module';

import { SubcategoriesPage } from './subcategories.page';
import { LoaderComponent } from '../components/loader/loader.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcategoriesPageRoutingModule
  ],
  declarations: [SubcategoriesPage, LoaderComponent]
})
export class SubcategoriesPageModule {}
