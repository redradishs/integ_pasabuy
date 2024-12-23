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


  updatePaymentId(id:number, payment_id: any){
    return this.http.put(`${this.apiUrl}/paymentIdreg/${id}/${payment_id}`, {});
  }

  paymentSuccess(id: number){
    return this.http.put(`${this.apiUrl}/payment/${id}`, {});
  }

  paymentRevert(id: number){
    return this.http.put(`${this.apiUrl}/unpaid/${id}`, {});
  }

  //orderstatus page

  getOrderStatus(order_id: number) {
    return this.http.get(`${this.apiUrl}/getspecifiedorderStatus/${order_id}`);
  }


  cancelorder(order_id: number) {
    return this.http.put(`${this.apiUrl}/cancelorder/${order_id}`, {});
  }

  complete_confirm(order_id: number){
    return this.http.post(`${this.apiUrl}/received_conf/${order_id}`, {});
  }


  submitan_issue(id: number, data: any){
    return this.http.post(`${this.apiUrl}/submit_issue/${id}`, data);
  }

  get_reports(id: number){
    return this.http.get(`${this.apiUrl}/getIssueStatus/${id}`);
  }

  prod_review(id: number,ord: number, data: any){
    return this.http.post(`${this.apiUrl}/prod_review/${id}/${ord}`, data);
  }

  get_prodrev(id: number){
    return this.http.get(`${this.apiUrl}/getProdReview/${id}`);
  }

  //endpoints for order history

  orderhistory(id: number){
    return this.http.get(`${this.apiUrl}/orderhistory/${id}`);
  }

  orderagain(id: number){
    return this.http.post(`${this.apiUrl}/reorder/${id}`, {});
  }


  //review component

  addreview(id: number, data: any){
    return this.http.post(`${this.apiUrl}/add_review/${id}`, data);
  }

  getreview(id: number){
    return this.http.get(`${this.apiUrl}/getreviews/${id}`);
  }


  getVendorReviewProd(id: number) {
    return this.http.get(`${this.apiUrl}/getreviewsVendor/${id}`);
  }

}
