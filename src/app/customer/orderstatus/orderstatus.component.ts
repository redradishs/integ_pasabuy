import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';


interface cartsSS {
  mode_of_payment: String,
  order_date: string,
  order_id: number,
  order_status: String,
  pickup_time: String,
  request_status: String,
  special_instruction: String,
  total_amount: String,
  user_id: number,
  vendor_id: number
}


@Component({
  selector: 'app-orderstatus',
  standalone: true,
  imports: [HeaderComponent, NgIf, CommonModule, NgClass],
  templateUrl: './orderstatus.component.html',
  styleUrl: './orderstatus.component.css',
  providers: [DatePipe]
})
export class OrderstatusComponent {

  orderData = {
    pickupTime: '',
    specialInstruction: '',
    modeOfPayment: ''
  }

  order_status = "placed"

  order_id: number = 0;
  carts: any;
  cartItems: any[] = [];
  userId: number = 0;
  prifiledata: any;
  voucherAmount: number = 0; 
  orderStatus: any;
  currentstatus = "placed"
  statusLength: number = 0;

  ngOnInit(): void {
    this.getCart(this.order_id);
    this.getCheckout(this.order_id);
    this.getSpecificStatus(this.order_id);
  }

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private datePipe: DatePipe){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order_id = navigation.extras.state['orderId'];
      console.log(this.order_id)
    }
  }



  getCart(id: number): void {
    this.api.getCart(this.order_id).subscribe((resp: any) => {
      try {
        this.carts = resp.data;
        console.log("cart res", this.carts);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    })
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy h:mm a') || '';
  }

  

  
  getCheckout(order_id: number): void {
    this.api.getCheckout(order_id).subscribe(
      (resp: any) => {
        try {
          console.log('Checkout Response:', resp);
  
          if (resp && Array.isArray(resp.data)) {
            this.cartItems = resp.data.map((item: any) => ({
              ...item,
              fullImageUrl: item.product_prod_img
                ? `http://localhost/tindahub_backend/api/${item.product_prod_img}`
                : 'assets/unimartLogi.png',
            
            }));
            console.log('Full API response:', resp);
            console.log('Response data:', resp.data);
            
          } else {
            console.error('Response data is not an array or is missing');
            this.carts = [];
          }
        } catch (error) {
          console.error('Error processing checkout response', error);
          this.cartItems = [];
        }
      },
      (error) => {
        console.error('Error fetching checkout data:', error);
      }
    );
  }


  getSpecificStatus(order_id: number){
    this.api.getOrderStatus(this.order_id).subscribe((resp: any) => {
      this.orderStatus = resp.data;
      console.log("status", this.orderStatus);
      this.statusLength = this.orderStatus.length;
      console.log("Order status length:", this.statusLength);
    }, error => {
      console.error("Error fetching order status", error);
    })
  }


  cancelOrder(order_id: number){
    this.api.cancelorder(this.order_id).subscribe((resp: any) => {
      console.log('Order has been canceled')
      this.router.navigate(['/home']);
    }, error => {
      console.error("Error cancelling order", error);
    })
  }


  





}
