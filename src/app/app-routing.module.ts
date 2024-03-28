import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { OrderDetailsComponent } from './admin/orders/order-details/order-details.component';
import { ProductsComponent } from './admin/products/products.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';
import { ModifyProductComponent } from './admin/products/modify-product/modify-product.component';
import { LoginComponent } from './admin/login/login.component';
import { PassGuard } from './services/pass.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },

  { path: 'product-details/:id', component: ProductDetailsComponent },

  { path: 'cart', component: ShoppingCartComponent },

  { path: 'checkout', component: CheckoutComponent },

  {
    path: 'admin',
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
  { path: 'login', component: LoginComponent },

  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
