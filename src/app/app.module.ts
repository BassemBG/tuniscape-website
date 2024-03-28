import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { OrderDetailsComponent } from './admin/orders/order-details/order-details.component';
import { ProductsComponent } from './admin/products/products.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';
import { ModifyProductComponent } from './admin/products/modify-product/modify-product.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductsListComponent,
    ProductDetailsComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    DashboardComponent,
    OrdersComponent,
    OrderDetailsComponent,
    ProductsComponent,
    AddProductComponent,
    ModifyProductComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [
    { provide: 'API_BASE_URL', useValue: environment.apiBaseUrl }, // Provide the backend URL
    { provide: 'API_URL_GET_IMAGE', useValue: environment.apiUrlGetImage }, // Provide the backend URL
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
