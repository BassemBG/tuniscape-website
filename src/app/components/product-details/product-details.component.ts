import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductType } from 'src/app/shared/enums/productType.enum';
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
  receivedId: any;
  formattedDescription: string = ''; //used to display description with back to lines



  constructor(
    private productService: ProductService,
    private router: Router,
    private act: ActivatedRoute,
    @Inject('API_URL_GET_IMAGE') public apiUrlGetImage: string,
    private titleService: Title //used to update pages window titles
  ) {}

  ngOnInit(): void {
    //get id from url
    this.receivedId = this.act.snapshot.paramMap.get('id');

    //get product details
    this.productService.getProductById(this.receivedId).subscribe(
      (res) => {
        this.product = res;

        this.formatDescription(this.product.description);

        this.titleService.setTitle(this.product.name);

        //setting the ui stuff only when product is loaded: sizes, out of stock visibility, main image
        this.sizeNames = Object.keys(this.product.availableQuantity).filter(
          (size) => {
            // Exclude the key "_id"

            return size !== '_id';
          }
        );

        //setting out of stock or not
        let totalAvailableQuantity = this.product.totalQuantity;

        // Check if total available quantity is greater than 0
        if (totalAvailableQuantity > 0) {
          this.isOutOfStock = false;
        } else {
          this.isOutOfStock = true;
        }

        this.selectedImage = this.product.images[0];
      },

      (err) => {
        console.log(err);
      }
    );

    //this.product = this.productService.getSelectedProduct();
  }

  //format desc to show back to lines
  formatDescription(description: string): void {
    this.formattedDescription = description.replace(/\n/g, '<br>');
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
    //get type to treat each differently, accessories don't have sizes
    const productType: ProductType = this.product.type;

    const { _id, name, type, price, images } = this.product;
    const image = images[0];
    this.productToAdd = { _id, name, type, price, image };

    if (productType === ProductType.ACCESSORIES) {
      if (this.product.totalQuantity >= this.selectedQuantity) {
        this.productToAdd['size'] = '-';
        this.productToAdd['quantity'] = this.selectedQuantity;
        this.productToAdd['totalPrice'] =
          this.selectedQuantity * this.productToAdd['price'];
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart',
          text: 'Your product was succesfully added to cart !',
          confirmButtonText: 'Check my Cart',
          confirmButtonColor: 'darkgreen',
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
          confirmButtonColor: 'darkgreen',
        });
        return; //TO DO : if condition isn't satisfied throw error with frontend
      }
    } else {
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
            confirmButtonColor: 'darkgreen',
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
            confirmButtonColor: 'darkgreen',
          });
          return; //TO DO : if condition isn't satisfied throw error with frontend
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No size selected',
          text: 'Please select your size before proceeding further !',
          confirmButtonColor: 'darkgreen',
        });
        return; //TO DO: if condition isn't satisfied throw error
      }
    }

    this.productService.addCartProduct(this.productToAdd);

    console.log('Added to cart');
  }

  buyNow(): void {
    //get type to treat each differently, accessories don't have sizes
    const productType: ProductType = this.product.type;

    const { _id, name, type, price, images } = this.product;
    const image = images[0];
    this.productToAdd = { _id, name, type, price, image };

    if (productType === ProductType.ACCESSORIES) {
      if (this.product.totalQuantity >= this.selectedQuantity) {
        this.productToAdd['size'] = '-';
        this.productToAdd['quantity'] = this.selectedQuantity;
        this.productToAdd['totalPrice'] =
          this.selectedQuantity * this.productToAdd['price'];
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Insufficient Quantity',
          text: 'The specified quantity is unavailable !',
          confirmButtonColor: 'darkgreen',
        });
        return; //TO DO : if condition isn't satisfied throw error with frontend
      }
    } else {
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
          Swal.fire({
            icon: 'error',
            title: 'Insufficient Quantity',
            text: 'The specified quantity is unavailable !',
            confirmButtonColor: 'darkgreen',
          });
          return; //TO DO : if condition isn't satisfied throw error with frontend
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No size selected',
          text: 'Please select your size before proceeding further !',
          confirmButtonColor: 'darkgreen',
        });
        return; //TO DO: if condition isn't satisfied throw error
      }
    }

    this.productService.setProductsToBuy([this.productToAdd]);
    console.log('buy now Done');

    this.router.navigate(['checkout']);
  }
}
