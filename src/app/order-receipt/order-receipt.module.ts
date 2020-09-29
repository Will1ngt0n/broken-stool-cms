import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderReceiptPageRoutingModule } from './order-receipt-routing.module';

import { OrderReceiptPage } from './order-receipt.page';
// import { LoaderComponent } from '../components/loader/loader.component';
import { LoaderComponentModule } from '../components/loader/loader.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderReceiptPageRoutingModule,
    LoaderComponentModule
  ],
  declarations: [OrderReceiptPage]
})
export class OrderReceiptPageModule {}
