import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url = this.apiBaseUrl + 'orders/';
  orderDetails: any;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') private apiBaseUrl: string) {}

  //make api call to get all orders from DB
  getAllOrders() {
    return this.http.get(this.url + 'getall');
  }

  addOrder(order: any) {
    return this.http.post(this.url + 'add', order);
  }


  setOrderDetails(order: any){
    this.orderDetails = order;
  }

  getOrderDetails(){
    return this.orderDetails;
  }
}
