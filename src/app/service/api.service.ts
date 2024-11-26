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
}
