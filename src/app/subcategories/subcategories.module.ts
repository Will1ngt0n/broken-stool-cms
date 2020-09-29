import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriesPageRoutingModule } from './subcategories-routing.module';

import { SubcategoriesPage } from './subcategories.page';
// import { LoaderComponent } from '../components/loader/loader.component';
import { LoaderComponentModule } from '../components/loader/loader.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcategoriesPageRoutingModule,
    LoaderComponentModule
  ],
  declarations: [SubcategoriesPage]
})
export class SubcategoriesPageModule {}
