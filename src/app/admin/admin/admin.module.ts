import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrdersComponent } from '../orders/orders.component';
import { OrderDetailsComponent } from '../orders/order-details/order-details.component';
import { ProductsComponent } from '../products/products.component';
import { AddProductComponent } from '../products/add-product/add-product.component';
import { ModifyProductComponent } from '../products/modify-product/modify-product.component';
import { LoginComponent } from '../login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    OrdersComponent,
    OrderDetailsComponent,
    ProductsComponent,
    AddProductComponent,
    ModifyProductComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
