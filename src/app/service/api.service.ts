import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // apiUrl = "http://localhost/unimart_pasabuy/api"
  // apiUrl = "http://localhost:8000/api"
  // baseUrl = "http://localhost:8000/user"


  //   apiUrl = "https://unimartpasabuyapi.vercel.app/api"
  // baseUrl = "https://unimartpasabuyapi.vercel.app/user"

  apiUrl = "https://cdnunimartpasabuyapi.onrender.com/api"
  baseUrl = "https://cdnunimartpasabuyapi.onrender.com/user"




  constructor(private http: HttpClient) { }



  //ENPOINTS FOR PROFILE PAGE
  getProfile(id: any){
    return this.http.get(`${this.baseUrl}/userDetails/${id}`);  
  }



  //endpoints for home
  getVendors(){
    return this.http.get(`${this.apiUrl}/vendors`);
  }

  //endpoints for product vendor

  getVendorProducts(vendorId: string){
    return this.http.get(`${this.apiUrl}/vendorcart/${vendorId}`);
  }

  getVendorProfile(vendorId: string){
    return this.http.get(`${this.apiUrl}/viewvendorProfile/${vendorId}`);
  }

  getCategories(id: string){
    return this.http.get(`${this.apiUrl}/productCategory/${id}`);
  }



  //endpoints for cart

  getCheckout(id: any){
    return this.http.get(`${this.apiUrl}/getCheckoutDetails/${id}`);  
  }

  getCart(id: any){
    return this.http.get(`${this.apiUrl}/getOrderDetails/${id}`);
  }

  updateCartItem(id: any, quantity: any) {
    return this.http.put(`${this.apiUrl}/updateCartItem/${id}`, {});
  }

  checkout(id: any, data: any) {
    return this.http.put(`${this.apiUrl}/updateOrder/${id}`, data);
  }

  deleteItem(order_id: any, product_id: any){
    return this.http.delete(`${this.apiUrl}/deleteItemOrder/${order_id}/${product_id}`);
  }

  addQuantity(order_id: any, product_id: any){
    return this.http.put(`${this.apiUrl}/addQuantity/${order_id}/${product_id}`, {});
  }
  
  subtractQuantity(order_id: any, product_id: any){
    return this.http.put(`${this.apiUrl}/minusQuantity/${order_id}/${product_id}`, {});
  }


  updatePaymentId(id:any, payment_id: any){
    return this.http.put(`${this.apiUrl}/paymentIdreg/${id}/${payment_id}`, {});
  }

  paymentSuccess(id: any){
    return this.http.put(`${this.apiUrl}/payment/${id}`, {});
  }

  paymentRevert(id: any){
    return this.http.put(`${this.apiUrl}/unpaid/${id}`, {});
  }

  //orderstatus page

  getOrderStatus(order_id: any) {
    return this.http.get(`${this.apiUrl}/getspecifiedorderStatus/${order_id}`);
  }


  cancelorder(order_id: any) {
    return this.http.put(`${this.apiUrl}/cancelorder/${order_id}`, {});
  }

  complete_confirm(order_id: any){
    return this.http.post(`${this.apiUrl}/received_conf/${order_id}`, {});
  }


  submitan_issue(id: any, data: any){
    return this.http.post(`${this.apiUrl}/submit_issue/${id}`, data);
  }

  get_reports(id: any){
    return this.http.get(`${this.apiUrl}/getIssueStatus/${id}`);
  }

  prod_review(id: any,ord: any, data: any){
    return this.http.post(`${this.apiUrl}/prod_review/${id}/${ord}`, data);
  }

  get_prodrev(id: any){
    return this.http.get(`${this.apiUrl}/getProdReview/${id}`);
  }

  //endpoints for order history

  orderhistory(id: any){
    return this.http.get(`${this.apiUrl}/orderhistory/${id}`);
  }

  orderagain(id: any){
    return this.http.post(`${this.apiUrl}/reorder/${id}`, {});
  }


  //review component

  addreview(id: any, data: any){
    return this.http.post(`${this.apiUrl}/add_review/${id}`, data);
  }

  getreview(id: string){
    return this.http.get(`${this.apiUrl}/getreviews/${id}`);
  }


  getVendorReviewProd(id: any) {
    return this.http.get(`${this.apiUrl}/getreviewsVendor/${id}`);
  }

}
