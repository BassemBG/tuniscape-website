import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  url = this.apiBaseUrl + 'orders/';
  //orderDetails: any;  this is deleted because order id is passed in url now
  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') private apiBaseUrl: string
  ) {}

  //make api call to get all orders from DB
  getAllOrders() {
    return this.http.get(this.url + 'getall');
  }

  getOrderById(id: any) {
    return this.http.get(this.url + 'getbyid/' + id);
  }

  addOrder(order: any) {
    return this.http.post(this.url + 'add', order);
  }

  //this is deleted because order id is passed in url now
  /*
  setOrderDetails(order: any){
    this.orderDetails = order;
  }

  getOrderDetails(){
    return this.orderDetails;
  }*/
}
