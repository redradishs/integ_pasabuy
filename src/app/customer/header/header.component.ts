import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartServiceService } from '../../service/cart-service.service';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

interface VendorProfile {
  vendor_id: number;
  vendor_name: string;
  image?: string;
  location: string;
  operating_hours: string;
  rating: number;
  description: string;
}

interface Product {
  product_id: number;
  vendor_id: number;
  product_name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviewsCount: number;
  quantity: number;
  fullImageUrl: string;
}


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,
            RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartItems: any[] = [];
  products: Product[] = [];
  orderId: number = 0;
  vendorId: number | null = null;
  quantity: number = 1;
  itemPrice: number = 0;
  voucherAmount: number = 0; 
  userId: any[] = [];
  pickup_time = '0000-00-00 12:00';
  order_status = 'Pending';
  vendorProfile: VendorProfile | null = null;

  constructor(private cart: CartServiceService,
              private auth: AuthService, 
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router

  ) { }

  ngOnInit(): void {
    this.loadCartItems();

    this.openCartDropdown();

    this.vendorId = Number(this.route.snapshot.paramMap.get('vendorId'));
    this.cdr.detectChanges();


    this.auth.getCurrentUser().subscribe(user => {
                  if (user) {
                    this.userId = user.id;
                  } else {
                    console.log("User not found");
                  }
                  this.cdr.detectChanges();
                });
                this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    this.loadCartItems(); // Refresh cart items or any data when the navigation ends
                    this.cdr.detectChanges(); // Ensure the view is updated
                  }
                });
  }

  loadCartItems(): void {
    this.cartItems = this.cart.getCartItems();
    this.cdr.detectChanges();
  }
  
  openCartDropdown(): void {
    const cartButton = document.getElementById('myCartDropdownButton1');
    if (cartButton) {
      cartButton.click();
    }
    this.cdr.detectChanges();
  }
  
  getProductPrice(item: any): number {
    return item.price * item.quantity;
  }



  removeItem(item: any): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this item from your cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.cart.removeFromCart(item.product_id);
      this.loadCartItems();
      Swal.fire({
        title: 'Removed!',
        text: 'The item has been removed from your cart.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745', // Custom green color for OK button
        customClass: {
          confirmButton: 'custom-ok-btn'  // Custom class for the OK button
        }
      });
      this.cdr.detectChanges();
    }
  });
}

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
