import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  productToAdd: any;
  selectedImage: string = ''; // Variable to store the selected image
  selectedSize: string = 'unselected'; // Variable to store the selected size
  selectedQuantity: number = 1; // Variable to store the selected quantity
  sizeNames: string[] = [];
  isOutOfStock: Boolean = false;
  constructor(
    private productService: ProductService,
    private router: Router,
    @Inject('API_URL_GET_IMAGE') public apiUrlGetImage: string
  ) {}

  ngOnInit(): void {
    this.product = this.productService.getSelectedProduct();
    console.log(this.product);
    this.sizeNames = Object.keys(this.product.availableQuantity).filter(
      (size) => {
        // Exclude the key "_id"

        return size !== '_id';
      }
    );

    //setting out of stock or not
    let totalAvailableQuantity = 0;
    for (const key in this.product.availableQuantity) {
      if (key !== '_id') {
        totalAvailableQuantity += this.product.availableQuantity[key];
      }
    }

    // Check if total available quantity is greater than 0
    if (totalAvailableQuantity > 0) {
      this.isOutOfStock = false;
    } else {
      this.isOutOfStock = true;
    }

    this.selectedImage = this.product.images[0];
  }

  increaseQuantity() {
    // TO DO: add condition to not pass the maximum available quantity
    this.selectedQuantity += 1;
  }

  decreaseQuantity() {
    this.selectedQuantity -= 1;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart() {
    // TO DO: add product to cartProducts available in products service
    const { _id, name, type, price, images } = this.product;
    const image = images[0];
    this.productToAdd = { _id, name, type, price, image };

    if (this.selectedSize != 'unselected') {
      if (
        this.product['availableQuantity'][this.selectedSize] >=
        this.selectedQuantity
      ) {
        this.productToAdd['size'] = this.selectedSize;
        this.productToAdd['quantity'] = this.selectedQuantity;
        this.productToAdd['totalPrice'] =
          this.selectedQuantity * this.productToAdd['price'];
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart',
          text: 'Your product was succesfully added to cart !',
          confirmButtonText: 'Check my Cart',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['cart']);
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Insufficient Quantity',
          text: 'The specified quantity is unavailable !',
        });
        return; //TO DO : if condition isn't satisfied throw error with frontend
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No size selected',
        text: 'Please select your size before proceeding further !',
      });
      return; //TO DO: if condition isn't satisfied throw error
    }
    this.productService.addCartProduct(this.productToAdd);

    console.log('Added to cart:', this.productToAdd);
  }

  buyNow(): void {
    // TO DO: i need to implement the case ki bech yechri toul

    const { _id, name, type, price, images } = this.product;
    const image = images[0];
    this.productToAdd = { _id, name, type, price, image };

    if (this.selectedSize != 'unselected') {
      if (
        this.product['availableQuantity'][this.selectedSize] >=
        this.selectedQuantity
      ) {
        this.productToAdd['size'] = this.selectedSize;
        this.productToAdd['quantity'] = this.selectedQuantity;
        this.productToAdd['totalPrice'] =
          this.selectedQuantity * this.productToAdd['price'];
      } else {
        return; //TO DO : if condition isn't satisfied throw error with frontend
      }
    } else {
      return; //TO DO: if condition isn't satisfied throw error
    }
    this.productService.setProductsToBuy([this.productToAdd]);
    console.log('buy now : ', this.productToAdd);

    this.router.navigate(['checkout']);
  }
}
