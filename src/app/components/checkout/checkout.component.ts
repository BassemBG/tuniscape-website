import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  isSubmitted: boolean = false;
  addedProducts: any[] = [];
  order: any = {};
  deliveryFee : number = 7; // Fixed delivery fee
  totalWithoutDelivery : number = 0;
  grandTotal : number = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    @Inject('API_URL_GET_IMAGE') public apiUrlGetImage: string
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      city: ['', Validators.required],
      phone: ['', [Validators.required, this.validatePhoneNumber]],
    });
  }

  ngOnInit(): void {
    this.addedProducts = this.productService.getProductsToBuy();
    console.log(this.addedProducts);
    this.calculateTotal();
  }

  // Calculate totals (without delivery then grand total)
  calculateTotal(){
    for (const product of this.addedProducts) {
      this.totalWithoutDelivery += product["totalPrice"];
    }
    this.grandTotal = this.totalWithoutDelivery + this.deliveryFee;

  }

  /*checkInvalidInput(inputName: String){
    return this.checkoutForm.get("firstName")?.invalid && (this.checkoutForm.get('firstName')?.touched || this.checkoutForm.get('firstName')?.dirty);
  }*/

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.length !== 8) {
      return { invalidPhoneLength: true };
    }
    return null;
  }

  submitForm() {
    // Handle form submission logic
    this.isSubmitted = true;

    if (this.checkoutForm.valid) {
      console.log('Form submitted');
      this.order['customerInfos'] = this.checkoutForm.value;
      this.order['products'] = this.addedProducts;
      console.log(this.order);
  
  
      this.orderService.addOrder(this.order).subscribe(
        (res) => {
          console.log('Order placed successfully:', res);
          this.productService.resetCartProducts();
          this.productService.resetProductsToBuy();
          Swal.fire({
            icon: 'success',
            title: 'Order Confirmation',
            text: 'Your Order has been placed ! You will receive a confirmation email shortly !',
          }).then((result) => {          
            if (result.isConfirmed) {
              this.router.navigate(['/']);
            }
          });
        },
        (err) => {
          console.log('Error placing order:', err);
          Swal.fire({
            icon: 'error',
            title: 'Order Failure',
            text: err.error.error,
          }).then((result) => {          
            if (result.isConfirmed) {
              this.router.navigate(['/']);
            }
          });
        }
      );
  
    }
  }


}
