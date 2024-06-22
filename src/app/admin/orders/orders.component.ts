import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any;
  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(
      (res) => {
        console.log('All orders: ', res);
        this.orders = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkOrderDetails(orderToCheck: any) {
    //this.orderService.setOrderDetails(orderToCheck);
    this.router.navigate(['admin/orders/order-details', orderToCheck._id]);
  }

  calculateTotal(orderProducts: any) : number{
    let totalWithoutDelivery: number = 0;
    let deliveryFee : number = 7;
    for (const product of orderProducts) {
      totalWithoutDelivery += product["totalPrice"];
    }
    return totalWithoutDelivery + deliveryFee;

  }


  get count() {
    return this.orders.length;
  }


}
