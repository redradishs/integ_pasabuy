import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orderhistory',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})
export class OrderhistoryComponent {

  userId: number = 0;
  orders: any[] = [];

  constructor(private api: ApiService, private auth: AuthService, private router: Router){
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.viewOrderHistory(this.userId);
      } else {
        console.log("User not found");
      }
    });
    
  }


  viewOrderHistory(userId: number){
    this.api.orderhistory(this.userId).subscribe((resp: any) => {
      if(resp){
        this.orders = resp.data;
        console.log("Orders", this.orders);
      }
    })
  }


  orderDetails(id: number){
    this.router.navigate(['/orderstatus'], {
      state: { orderId: id }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value);
  }

  cancelOrder(order_id: number){
    this.api.cancelorder(order_id).subscribe((resp: any) => {
      console.log('Order has been canceled')
      this.viewOrderHistory(this.userId);
    }, error => {
      console.error("Error cancelling order", error);
    })
  }



}
