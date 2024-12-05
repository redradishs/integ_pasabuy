import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CartServiceService } from '../../service/cart-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { PaymongoService } from '../../service/paymongo.service';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, 
            CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            RouterModule
          ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  breadcrumbs: Array<{ label: string; link: string; iconViewBox: string }> = [];

  orderData = {
    pickupTime: '',
    specialInstruction: '',
    modeOfPayment: '',
    order_status: ''  }

  order_id: number = 0;
  carts: any[] = [];
  cartItems: any[] = [];
  userId: number = 0;
  prifiledata: any;
  voucherAmount: number = 0; 

  amount: number = 999999; 
  description: string = 'Payment for Order #12345'; 



  
  ngOnInit(): void {
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
    this.setupBreadcrumbs();  

    this.orderData.pickupTime = this.getDateTimeOneHourAgo();
    
  }

  constructor(private api: ApiService, private router: Router, private auth: AuthService, private cart: CartServiceService, private paymongo: PaymongoService){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order_id = navigation.extras.state['orderId'];
      console.log(this.order_id)
    }
  }


  setupBreadcrumbs(): void {
    this.breadcrumbs = [
      {
        label: 'Home',
        link: '/home',
        iconViewBox: '0 0 20 20',
      },
      {
        label: 'Product',
        link: '/product',
        iconViewBox: ''
      },
      {
        label: 'Product-Details',
        link: '/productDetails',
        iconViewBox: ''
      },
      {
        label: 'Checkout',
        link: '/productDetails',
        iconViewBox: ''
      }
  
    ];
  }

  

  getDateTimeOneHourAgo(): string {
    const now = new Date();
    now.setHours(now.getHours() + 1); 
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  getCart(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.getCart(id).subscribe(
        (resp: any) => {
          try {
            this.carts = resp.data;
            console.log(this.carts);
            resolve(this.carts); 
          } catch (error) {
            console.error("Error fetching cart", error);
            reject(error);
          }
        },
        (error) => {
          console.error("Error fetching cart", error);
          reject(error);
        }
      );
    });
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
                : 'assets/unimartLogo.png',
            
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


  // proceedToCheckout(): void {
  //   const data = {
  //     pickup_time: this.orderData.pickupTime,
  //     special_instruction: this.orderData.specialInstruction,
  //     mode_of_payment: this.orderData.modeOfPayment,
  //     order_status: this.orderData.order_status
  //   };
  
  //   this.api.checkout(this.order_id, data).subscribe(
  //     (resp: any) => {
  //       console.log("Checkout Successful", resp);
  //       this.router.navigate(['/orderstatus'], {
  //         state: { orderId: this.order_id }
  //       });
  //     },
  //     (error) => {
  //       console.error("Checkout Failed", error);
  //       alert('There was an error during checkout. Please try again.');
  //     }
  //   );
  // }


  async proceedToCheckout() {
  const cartResponse = await this.getCart(this.order_id); 

    if (!cartResponse) {
      console.error("Cart response is invalid.");
      alert('There was an error fetching the cart. Please try again.');
      return; 
    }

  const totalAmountInPesos = parseFloat(cartResponse.total_amount);
  const totalAmountInCents = Math.round(totalAmountInPesos * 100); 
  const orderId = cartResponse.order_id;
  const description = `#UMXEXP${orderId}`; 

    const data = {
      pickup_time: this.orderData.pickupTime,
      special_instruction: this.orderData.specialInstruction,
      mode_of_payment: this.orderData.modeOfPayment,
      order_status: this.orderData.order_status
    };
  

    this.api.checkout(this.order_id, data).subscribe(
      async (resp: any) => {
        console.log("Checkout Successful", resp);
  
        if (this.orderData.modeOfPayment === 'Cash-on-Pickup') {
          this.router.navigate(['/orderstatus'], {
            state: { orderId: this.order_id }
          });
        } else if (this.orderData.modeOfPayment === 'Gcash') {
          try {
            const paymentLink = await this.paymongo.createPaymentLink(totalAmountInCents, description);
            console.log('Payment Link:', paymentLink);

          const paymentId = paymentLink.data.id;
          console.log("this is the payument", paymentId)
          await this.updateOrderWithPaymentId(this.order_id, paymentId);

            if (paymentLink.data.attributes.checkout_url) {
              window.open(paymentLink.data.attributes.checkout_url, '_blank');
            } else {
              console.error('Checkout URL not found in response.');
            }
          } catch (error) {
            console.error('Payment link creation failed:', error);
            alert('There was an error creating the payment link. Please try again.');
          }
          this.router.navigate(['/orderstatus'], {
            state: { orderId: this.order_id }
          });
        }
      },
      (error) => {
        console.error("Checkout Failed", error);
        alert('There was an error during checkout. Please try again.');
      }
    );
  }

  async updateOrderWithPaymentId(orderId: number, paymentId: string) {
    try {
        const response = await this.api.updatePaymentId(orderId, paymentId).toPromise();
        console.log('Order updated with payment ID successfully:', response);
    } catch (error) {
        console.error('Error updating order with payment ID:', error);
    }
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
  console.log('cartItems:', this.cartItems);
  console.log('voucherAmount:', this.voucherAmount);

  return (this.cartItems || []).reduce((total, item) => {
    const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
    return total + itemTotal;
  }, 0) - (this.voucherAmount || 0);
}

getTotalItems(): number {
  return (this.cartItems || []).reduce((total, item) => {
    if (!item) return total;
    return total + (item.quantity || 0);
  }, 0);
}


getCurrentDateTime(): string {
  const currentDate = new Date();
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  const formattedDate = currentDate.toLocaleString('en-US', options);
  
  return formattedDate;
}


add(order_id: number, product_id: number){
  this.api.addQuantity(this.order_id, product_id).subscribe((resp: any) => {
    try {
      this.getCheckout(this.order_id);
      console.log(this.cartItems);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  })
}

sub(order_id: number, product_id: number){
  this.api.subtractQuantity(this.order_id, product_id).subscribe((resp: any) => {
    try {
      this.getCheckout(this.order_id);
      console.log(this.cartItems);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  })
}

delete(order_id: number, product_id: number){
  this.api.deleteItem(this.order_id, product_id).subscribe((resp: any) => {
    try {
      this.getCheckout(this.order_id);
      console.log(this.cartItems);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  })
}

}
