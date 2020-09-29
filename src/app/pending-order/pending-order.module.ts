import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingOrderPageRoutingModule } from './pending-order-routing.module';

import { PendingOrderPage } from './pending-order.page';
// import { LoaderComponent } from '../components/loader/loader.component';
import { LoaderComponentModule } from '../components/loader/loader.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingOrderPageRoutingModule,
    LoaderComponentModule
  ],
  declarations: [PendingOrderPage]
})
export class PendingOrderPageModule {}
