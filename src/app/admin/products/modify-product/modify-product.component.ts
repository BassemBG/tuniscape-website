import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.css'],
})
export class ModifyProductComponent implements OnInit {
  productForm: FormGroup = this.formBuilder.group({});
  isSubmitted: boolean = false;
  images: File[] = []; // Store uploaded images
  productDetails: any;
  receivedId: any;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private act: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.receivedId = this.act.snapshot.paramMap.get('id');

    this.productService.getProductById(this.receivedId).subscribe(
      (res) => {
        console.log(res);

        this.productDetails = res;
        this.productForm = this.formBuilder.group({
          name: [this.productDetails.name, Validators.required],
          type: [this.productDetails.type, Validators.required],
          description: [this.productDetails.description],
          price: [this.productDetails.price, Validators.required],
          availableQuantity: this.formBuilder.group({
            XS: [this.productDetails.availableQuantity.XS, Validators.required],
            S: [this.productDetails.availableQuantity.S, Validators.required],
            M: [this.productDetails.availableQuantity.M, Validators.required],
            L: [this.productDetails.availableQuantity.L, Validators.required],
            XL: [this.productDetails.availableQuantity.XL, Validators.required],
          }),
          images: [this.productDetails.images], // required?
        });
      },
      (err) => {
        console.log(err);
      }
    );

    //this.productDetails = this.productService.getAdminProductDetails(); this is deleted because id is passed in url
  }

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

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('type', this.productForm.value.type);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append(
      'availableQuantity',
      JSON.stringify(this.productForm.value.availableQuantity)
    );
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

    this.productService
      .updateProduct(this.productDetails._id, formData)
      .subscribe(
        (res) => {
          console.log('Product updated successfully:', res);
          this.productForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Product is updated !',
            text: 'Your product was succesfully updated in the database.',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['admin/products']);
            }
          });
        },
        (err) => {
          console.log('Error updating product:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error updating product !',
            text: 'An error occured while updating the product.',
          });
        }
      );
  }
}
