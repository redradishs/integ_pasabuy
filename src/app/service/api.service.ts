import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "http://localhost/unimart_pasabuy/api"

  constructor(private http: HttpClient) { }



  //ENPOINTS FOR PROFILE PAGE
  getProfile(id: number){
    return this.http.get(`${this.apiUrl}/userDetails/${id}`);  
  }



  //endpoints for home
  getVendors(){
    return this.http.get(`${this.apiUrl}/vendors`);
  }

  //endpoints for product vendor

  getVendorProducts(vendorId: number){
    return this.http.get(`${this.apiUrl}/vendorcart/${vendorId}`);
  }

  getVendorProfile(vendorId: number){
    return this.http.get(`${this.apiUrl}/viewvendorProfile/${vendorId}`);
  }

  getCategories(id: number){
    return this.http.get(`${this.apiUrl}/productCategory/${id}`);
  }



  //endpoints for cart

  getCheckout(id: number){
    return this.http.get(`${this.apiUrl}/getCheckoutDetails/${id}`);  
  }

  getCart(id: number){
    return this.http.get(`${this.apiUrl}/getOrderDetails/${id}`);
  }

  updateCartItem(id: number, quantity: any) {
    return this.http.put(`${this.apiUrl}/updateCartItem/${id}`, {});
  }

  checkout(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/updateOrder/${id}`, data);
  }

  deleteItem(order_id: number, product_id: number){
    return this.http.delete(`${this.apiUrl}/deleteItemOrder/${order_id}/${product_id}`);
  }

  addQuantity(order_id: number, product_id: number){
    return this.http.put(`${this.apiUrl}/addQuantity/${order_id}/${product_id}`, {});
  }
  
  subtractQuantity(order_id: number, product_id: number){
    return this.http.put(`${this.apiUrl}/minusQuantity/${order_id}/${product_id}`, {});
  }


  //orderstatus page

  getOrderStatus(order_id: number) {
    return this.http.get(`${this.apiUrl}/getspecifiedorderStatus/${order_id}`);
  }


  cancelorder(order_id: number) {
    return this.http.put(`${this.apiUrl}/cancelorder/${order_id}`, {});
  }

}
