import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassGuard } from 'src/app/services/pass.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrdersComponent } from '../orders/orders.component';
import { OrderDetailsComponent } from '../orders/order-details/order-details.component';
import { ProductsComponent } from '../products/products.component';
import { AddProductComponent } from '../products/add-product/add-product.component';
import { ModifyProductComponent } from '../products/modify-product/modify-product.component';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';

const routes: Routes = [

  {
    path: '',
    canActivate: [PassGuard],
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },

      {
        path: 'orders',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },

          { path: 'list', component: OrdersComponent },

          { path: 'order-details/:id', component: OrderDetailsComponent },
        ],
      },

      {
        path: 'products',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },

          { path: 'list', component: ProductsComponent },

          { path: 'add', component: AddProductComponent },

          { path: 'modify/:id', component: ModifyProductComponent },

          { path: 'product-details/:id', component: CheckoutComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
