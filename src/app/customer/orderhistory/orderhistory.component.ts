import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-orderhistory',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})
export class OrderhistoryComponent {

  userId: number = 0;
  orders: any[] = [];
  selectedOrderType: string = 'All orders';
  selectedDuration: string = 'this week';
  filteredOrders: any[] = []; 

  orderStatuses: string[] = ['All orders', 'pending', 'completed', 'canceled', 'preparing', 'placed'];

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private spinner: NgxSpinnerService, private title: Title){
  }

  ngOnInit(): void {
    this.title.setTitle('History - PasaBuy');
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
    this.spinner.show();
    this.api.orderhistory(this.userId).subscribe((resp: any) => {
      if(resp){
        this.orders = resp.data;
        this.filteredOrders = this.orders; 
        console.log("Orders", this.orders);
        this.spinner.hide();
      }
    })
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesType = this.selectedOrderType === 'All orders' || order.order_status === this.selectedOrderType;
      const matchesDate = this.isWithinDuration(order.order_date, this.selectedDuration);
      return matchesType && matchesDate;
    });
  }
  isWithinDuration(orderDate: Date | Date, duration: string): boolean {
    const today = new Date();
    const date = new Date(orderDate);
    switch (duration) {
      case 'this week':
        return date >= this.startOfWeek(today) && date <= today;
      case 'this month':
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      case 'last 3 months':
        return date >= new Date(today.setMonth(today.getMonth() - 3)) && date <= today;
      case 'last 6 months':
        return date >= new Date(today.setMonth(today.getMonth() - 6)) && date <= today;
      case 'this year':
        return date.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }

  startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
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

  orderAgain(order_id: number){
    this.api.orderagain(order_id).subscribe((resp: any) => {
      console.log('Order has been ordered again')
      this.viewOrderHistory(this.userId);
      const newOrderId = resp.data.new_order_id;

      this.router.navigate(['/checkout'], {
        state: { orderId: newOrderId }
      });

    }, error => {
      console.error("Error ordering again", error);
    })
  }



}
