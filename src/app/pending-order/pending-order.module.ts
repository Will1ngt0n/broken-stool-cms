import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingOrderPageRoutingModule } from './pending-order-routing.module';

import { PendingOrderPage } from './pending-order.page';
import { LoaderComponent } from '../components/loader/loader.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingOrderPageRoutingModule
  ],
  declarations: [PendingOrderPage, LoaderComponent]
})
export class PendingOrderPageModule {}
