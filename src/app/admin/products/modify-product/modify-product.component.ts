import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductType } from 'src/app/shared/enums/productType.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.css'],
})
export class ModifyProductComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitted: boolean = false;
  selectedImages : File[] = []; // Store uploaded selectedImages 
  productDetails: any;
  receivedId: any;
  productTypes = Object.values(ProductType); // this is used for menu of types 
  isSelectedImages: boolean = false;  //this tells us if images will be changed or not

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private act: ActivatedRoute,
    private router: Router,
    @Inject('API_URL_GET_IMAGE') public apiUrlGetImage: string
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm(); // Initialize productForm here if needed

    this.receivedId = this.act.snapshot.paramMap.get('id');

    this.productService.getProductById(this.receivedId)!.subscribe(
      (res) => {
        console.log(res);
        this.populateForm(res); // Populate the form with fetched data
      },
      (err) => {
        console.log(err);
      }
    );
}

  initForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      availableQuantity: this.formBuilder.group({
        XS: ['', Validators.required],
        S: ['', Validators.required],
        M: ['', Validators.required],
        L: ['', Validators.required],
        XL: ['', Validators.required],
      }),
      images: [], // Assuming it's optional
    });
  }


  populateForm(productDetails: any): void {
    if (productDetails) {
      this.productForm.patchValue({
        name: productDetails.name,
        type: productDetails.type,
        description: productDetails.description,
        price: productDetails.price,
        availableQuantity: {
          XS: productDetails.availableQuantity.XS,
          S: productDetails.availableQuantity.S,
          M: productDetails.availableQuantity.M,
          L: productDetails.availableQuantity.L,
          XL: productDetails.availableQuantity.XL,
        },
        images: productDetails.images,
      });
    }
  }


  fileToUpload: any;
  imageUrl: any;

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    const filePromises: Promise<any>[] = [];
  
    if (files && files.length) {
      // Clear existing selectedImages array
      this.selectedImages = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Push a promise to the array to read each file asynchronously
        filePromises.push(this.readFile(file));
      }
  
      // Resolve all promises sequentially
      Promise.all(filePromises)
        .then((results) => {
          // 'results' will contain the ordered array of image URLs or base64 strings
          this.selectedImages = results;
          this.productForm.get('images')?.setValue(files); // Update form control with files
          this.isSelectedImages = true; // Set flag to indicate images are selected
        })
        .catch((error) => {
          console.error('Error reading files:', error);
        });
    }
  }
  
  // Helper function to read each file asynchronously
  readFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result); // Resolve with the result (URL or base64 string)
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read file as data URL
    });
  }

  
  submitForm() {
    // Handle form submission logic
    console.log( "product form data before: " , this.productForm.value.name);
    
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('type', this.productForm.value.type);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append(
      'availableQuantity',
      JSON.stringify(this.productForm.value.availableQuantity)
    );

    // Append images
    
    const images = this.productForm.value.images;
    
    if (images.length > 0 && this.isSelectedImages) {
      for (const image of images) {
        formData.append('images', image);        
      }
    }
    

    
    if (this.productForm.valid) {
      console.log('Form is valid');
    }
    
    console.log("product data to update with: ");
    console.log(formData);

    this.isSubmitted = true;
    
    this.productService
      .updateProduct(this.receivedId, formData)
      .subscribe( 
        (res) => {
          console.log('Product updated successfully:', res);
          this.productForm.reset();
          this.productForm.value.images = [];
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
