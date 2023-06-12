import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

//declare the service as injectable
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  //property which will hold the base URL for API requests
  baseUrl = environment.apiUrl;

  //inject the HttpClient service into the constructor - dependency injection
  constructor(private http: HttpClient) {}

  //sends a GET request to the endpoint in order to retrieve the orders
  getOrdersForUser(){
    return this.http.get(this.baseUrl + 'orders');
  }
  //sends a GET request to the endpoint in order to retrieve a specific order based on the order ID
  getOrderDetailed(id: number){
    return this.http.get(this.baseUrl + 'orders/' + id);
  }
}
