import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriesPageRoutingModule } from './subcategories-routing.module';

import { SubcategoriesPage } from './subcategories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcategoriesPageRoutingModule
  ],
  declarations: [SubcategoriesPage]
})
export class SubcategoriesPageModule {}
