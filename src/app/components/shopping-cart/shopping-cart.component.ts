import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(
    private router: Router,
    private productService: ProductService,
    @Inject('API_URL_GET_IMAGE') public apiUrlGetImage: string,
    private titleService: Title //used to update pages window titles

  ) {}
  cartProducts: any[] = [];
  pageTitle: string = "Tuniscape Prod - Cart";
  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.cartProducts = this.productService.getAllCartProducts();
  }

  increaseQuantity(arrayIndex: number) {
    //this.cartProducts[arrayIndex].quantity += 1;
    //this.cartProducts[arrayIndex].totalPrice += this.cartProducts[arrayIndex].price;
    this.productService.modifycartProductQuantity(arrayIndex, 1);
  }

  decreaseQuantity(arrayIndex: number, currentQuantity: any) {
    //this.cartProducts[arrayIndex].quantity -= 1;
    //this.cartProducts[arrayIndex].totalPrice -= this.cartProducts[arrayIndex].price;
    if (currentQuantity > 1) {
      this.productService.modifycartProductQuantity(arrayIndex, -1);
    } else {
      console.log("can't go lower than 0 :)");
    }
  }

  getNumberItems(): number {
    var sumItems: number = 0;
    for (let i = 0; i < this.cartProducts.length; i++) {
      sumItems += this.cartProducts[i].quantity;
    }

    return sumItems;
  }

  getTotalPrice(): number {
    var totalPrice = 0;
    for (let i = 0; i < this.cartProducts.length; i++) {
      totalPrice += this.cartProducts[i].totalPrice;
    }

    return totalPrice;
  }

  deleteProduct(productId: number) {
    console.log('deleting');
    Swal.fire({
      title: "Are you sure?",
      text: "The selected product will be deleted from your shopping cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartProducts = this.cartProducts.filter(
          (product) => product._id !== productId
        );
    
        this.productService.setCartProducts(this.cartProducts);
        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted from shopping cart.",
          icon: "success"
        });
      }
    });
    
  }

  checkout() {
    this.productService.setProductsToBuy(this.cartProducts);
    this.router.navigate(['checkout']);
  }

}
