import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private orderService: OrderService, private act: ActivatedRoute) {}
  orderDetails: any;
  receivedId: any;
  ngOnInit(): void {
    this.receivedId = this.act.snapshot.paramMap.get('id');

    this.orderService.getOrderById(this.receivedId).subscribe(
      res=>{
        this.orderDetails = res;
      },
      err=>{
        console.log(err);
        
      }
    )
    //this.orderDetails = this.getOrderDetails();

  }

  /*getOrderDetails(){
    return this.orderService.getOrderDetails();
  }*/

  calculateTotalPrice(savedOrder: any) {
    let totalPrice = 0;
    savedOrder.products.forEach((product: any) => {
      totalPrice += product.totalPrice;
    });
    return totalPrice + 7; // Adding delivery fees
  }


}
