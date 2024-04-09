import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartProductsQuantityNotif: number = 0;
  isScrolled: boolean = false;
  isMenuOpen = false;
  isHomeComponent: boolean = false;
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.cartQuantityNotif$.subscribe((newQuantity) => {
      this.cartProductsQuantityNotif = newQuantity;
      console.log('cart header notif: ', this.cartProductsQuantityNotif);
    });

    this.router.events.subscribe((event) => {
      // Check if the current route is the home component
      this.isHomeComponent = this.router.url === '/' || this.router.url === '/home';
    });

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log(this.isMenuOpen);
  }


  selectProductType(type: string): void {
    this.productService.setSelectedProductType(type);
    if (this.router.url !== '/home') {
      this.router.navigate(['/'])
      
    }
    this.closeMenu();
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Logic to determine if the user has scrolled enough to change header background
    if (window.scrollY > 120) {
      // You can adjust the offset value as needed
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }
}
