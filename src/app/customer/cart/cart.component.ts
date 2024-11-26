import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CartServiceService } from '../../service/cart-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {


  order_id: number = 0;
  carts: any[] = [];
  cartItems: any[] = [];
  userId: number = 0;
  prifiledata: any;
  voucherAmount: number = 0; 



  
  ngOnInit(): void {
    this.loadCart();
    initFlowbite();
    this.getCart(this.order_id);
    this.getCheckout(this.order_id);
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.getUserDetails(this.userId);
      } else {
        console.log("User not found");
      }
    })
  }

  constructor(private api: ApiService, private router: Router, private auth: AuthService, private cart: CartServiceService){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order_id = navigation.extras.state['orderId'];
      console.log(this.order_id)
    }
  }


  loadCart(): void {
    this.cartItems = this.cart.getCartItems();
  }


  



  getCart(id: number): void {
    this.api.getCart(this.order_id).subscribe((resp: any) => {
      try {
        this.carts = resp.data;
        console.log(this.carts);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    })
  }


  getCheckout(order_id: number): void {
    try {
      this.api.getCheckout(this.order_id).subscribe((resp: any) => {
        this.cartItems = resp.data;
        console.log(this.cartItems);
      })
    } catch (error) {
    };
  }

  getUserDetails(id: number): void {
    this.api.getProfile(id).subscribe((resp: any) => {
      try {
        this.prifiledata = resp.data[0];
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    })
  }


  incrementQuantity(item: any): void {
    if (item.quantity < item.stock) {
        item.quantity++;
        this.updateCartItem(item);
    }
}

decrementQuantity(item: any): void {
    if (item.quantity > 1) {
        item.quantity--;
        this.updateCartItem(item);
    }
}

updateCartItem(item: any): void {
    this.api.updateCartItem(item.id, { quantity: item.quantity })
        .subscribe({
            next: (resp) => console.log('Item updated', resp),
            error: (err) => console.error('Error updating item', err)
        });
}

calculateTotal(): number {
  console.log('Cart Items:', this.cartItems);
  console.log('Voucher Amount:', this.voucherAmount);
  
  return this.cartItems.reduce((total, item) => {
    console.log('Item:', item);
    console.log('Quantity:', item.quantity, 'Price:', item.unit_price);
    
    const itemTotal = (item.quantity || 0) * (item.unit_price || 0); 
    console.log('Item Total:', itemTotal);

    return total + itemTotal;
  }, 0) - (this.voucherAmount || 0);
}

getTotalItems(): number {
  return this.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
}









}
