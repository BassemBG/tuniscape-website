import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartProductsQuantityNotif: number = 0;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.cartQuantityNotif$.subscribe((newQuantity) => {
      this.cartProductsQuantityNotif = newQuantity;
      console.log('cart header notif: ', this.cartProductsQuantityNotif);
    });
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log(this.isMenuOpen);
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

}
