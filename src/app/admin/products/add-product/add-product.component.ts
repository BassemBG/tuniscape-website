import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductType } from 'src/app/shared/enums/productType.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  isSubmitted: boolean = false;
  images: File[] = []; // Store uploaded images
  productTypes = Object.values(ProductType); // this is used for menu of types 

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: [ProductType.TUNISCAPE_PRODUCTS, Validators.required],
      description: [''],
      price: ['', Validators.required],
      availableQuantity: this.formBuilder.group({
        XS: [0, Validators.required],
        S: [0, Validators.required],
        M: [0, Validators.required],
        L: [0, Validators.required],
        XL: [0, Validators.required],
      }),
      totalQuantity: [0, Validators.required],
      images: [[]], // required?
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const files: File[] = event.target.files;
    // Clear existing images array
    this.images = [];
    // Loop through uploaded files and add them to the images array
    for (let i = 0; i < files.length; i++) {
      this.images.push(files[i]);
    }
    // Update the images form control value
    this.productForm.get('images')?.setValue(this.images);
  }

  submitForm() {
    // Handle form submission logic
    const productType : string = this.productForm.value.type;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('type', this.productForm.value.type);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append(
      'availableQuantity',
      JSON.stringify(this.productForm.value.availableQuantity)
    );

    //add totalQuantity from ui if accessories, else calculate given sizes quantities 
    if (productType == ProductType.ACCESSORIES) {
      formData.append('totalQuantity', this.productForm.value.totalQuantity);

    }else {
      let availableQuantityValue = this.productForm.value.availableQuantity;
      let sum: number = 0;
      Object.keys(availableQuantityValue).forEach(size => {
        // Retrieve the quantity for each size and add it to the sum
        sum += availableQuantityValue[size];
      });

      formData.append('totalQuantity', sum.toString());

      
    }

    // Append each image file
    for (let i = 0; i < this.images.length; i++) {
      formData.append('images', this.images[i]);
    }

    if (this.productForm.valid) {
      console.log('Form submitted');
    }
    //let productToAdd = this.productForm.value;
    console.log(formData);

    this.isSubmitted = true;

    this.productService.addProduct(formData).subscribe(
      (res) => {
        console.log('Product added successfully:', res);
        this.productForm.reset();
        Swal.fire({
          icon: 'success',
          title: 'Product is added !',
          text: 'Your product was succesfully added to the database !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['admin/products']);
          }
        });
      },
      (err) => {
        console.log('Error adding product:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error adding product !',
          text: 'An error occured while adding the product.',
        });
      }
    );
  }
}
