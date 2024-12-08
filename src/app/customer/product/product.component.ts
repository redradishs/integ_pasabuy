import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { CartServiceService } from '../../service/cart-service.service';
import { FormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SharedService } from '../../service/shared.service';

export interface Product {
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
export interface Vendor {
  id: number;
  name: string;
  image: string;
  storeHours: string;
  ratings: number;
  reviewsCount: number;
}


export interface VendorProfile {
  vendor_id: number;
  vendor_name: string;
  image?: string;
  location: string;
  operating_hours: string;
  rating: number;
  description: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, 
            HeaderComponent,
            RouterModule, 
            FormsModule
          ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  breadcrumbs: Array<{ label: string; link: string; iconViewBox: string }> = [];
  products: Product[] = [];
  vendorId: number = 0;
  cartItems: any[] = []; 
  quantity: number = 1;
  itemPrice: number = 0;
  voucherAmount: number = 0; 
  userId: any[] = [];
  orderId: number = 0;
  pickup_time = '0000-00-00 12:00';
  order_status = 'Pending';
  categories: any;
  
  averageRating: number = 0;
  ratingDistribution: { [key: number]: number } = {}; 
  totalRatings: number = 0;
  productDetails: any = {};
  selectedCategory: String = 'All';
  


  vendorProfile: VendorProfile = { rating: 0, vendor_id: 0, vendor_name: '', image: '', location: '', operating_hours: '', description: '' };
  constructor(private route: ActivatedRoute, 
              private api: ApiService, 
              private auth: AuthService, 
              private cart: CartServiceService,
               private router: Router, 
               private http: HttpClient,
              private sharedservice: SharedService) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
      } else {
        console.log("User not found");
      }
    });


    this.setupBreadcrumbs();
    this.vendorId = Number(this.route.snapshot.paramMap.get('vendorId'));
    this.viewVendorProfile(this.vendorId)
    this.viewproducts(this.vendorId);
    this.getCategories(this.vendorId);
    this.loadCart()
    this.getRatings(this.vendorId);
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
        link:  `/product/${this.vendorId}`,  
        iconViewBox: ''
      }
    ];
  }

  navigateToProductDetails(product: any): void {
    console.log('array of Product:', this.products); // Debug log
    if (product && product.vendor_id) {
      this.router.navigate(['/productDetails', product.vendor_id]);
    } else {
      console.error('Product data is missing or invalid.');
    }
  }
  

  viewVendorProfile(vendorId: number): void {
    this.api.getVendorProfile(vendorId).subscribe((resp: any) => {
      if (resp){
        this.vendorProfile = resp.data;
        console.log(this.vendorProfile);
      } else {
        console.error("Error no vendor")
      }
    })
  }

  viewproducts(vendorId: number): void {
    this.api.getVendorProducts(vendorId).subscribe((resp: any) => {
      if(resp){ 
        this.products = resp.data.map((product: any) => {
          return {
            ...product,
            fullImageUrl: `http://localhost/tindahub_backend/api/${product.prod_img}`,
          };
        });
        console.log(this.products);
      } else {
        console.error("Error no products")
      }
    })
  }

  addToCart(product: any): void {
    const existingProduct = this.cartItems.find(item => item.product_id === product.product_id);
    if (existingProduct) {
      existingProduct.quantity += 1; 
    } else {
      product.quantity = 1;
      this.cartItems.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    console.log(this.cartItems)
    Swal.fire({
      title: 'Item Added!',
      text: `${product.product_name} has been added to your cart.`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });

  }

  setCategory(category: string): void {
    this.selectedCategory = category
  }

  get FilteredProducts() {
    if(this.selectedCategory === 'All') {
      return this.products;
    } 
    return this.products.filter(product => product.category === this.selectedCategory);
  }


  loadCart(): void {
    const cartItems = this.cart.getCartItems();
    if (cartItems && cartItems.length > 0) {
      this.cartItems = cartItems.map((item: any) => {
        return {
          ...item,
          fullImageUrl: item.fullImageUrl || `http://localhost/tindahub_backend/api/${item.prod_img}`,
        };
      });
      console.log(this.cartItems); 
    } else {
      this.cartItems = [];
    }
  }
  

  removeFromCart(productId: number): void {  
    const updatedCart = this.cartItems.filter(item => item.product_id !== productId);
    if (updatedCart.length === this.cartItems.length) {
      console.warn('Product not found in the cart!');
    }
    this.cartItems = updatedCart;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  
    this.loadCart(); 
  }
  
  

  clearCart(): void {
    this.cart.clearCart();
    this.loadCart();
  }

  increment(item: any): void {
    item.quantity++; 
  }
  
  decrement(item: any): void {
    if (item.quantity > 1) {
      item.quantity--; 
    }
  }

  getProductPrice(item: any): number {
    return item.price * item.quantity;  
  } 

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    const totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return totalPrice - this.voucherAmount;
  }
   proceedToCheckout() {
    const totalAmount = this.getTotalPrice();
    const order = {
      user_id: this.userId,
      vendor_id: this.vendorId,
      total_amount: totalAmount,
      pickup_time: this.pickup_time,
      order_status: this.order_status
    };

    const orderItems = this.cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price,
      special_instruction: 'dd',
      order_id: null 
    }));

    this.saveOrder(order, orderItems);
  }


  saveOrder(order: any, orderItems: any[]) {

    this.http.post('http://localhost/unimart_pasabuy/api/add_order', order).subscribe(
      (response: any) => {
        this.orderId = response.data.order_id;
        orderItems.forEach(item => item.order_id = this.orderId);
        this.saveOrderItems(this.orderId, orderItems);
      },
      (error) => {
        console.error('Error saving order:', error);
      }
    );
  }
  

  saveOrderItems(orderId: number, orderItems: any[]) {
    const orderData = {
      data2: orderItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        special_instruction: item.special_instruction || ''
      }))
    };
  
    this.http.post(`http://localhost/unimart_pasabuy/api/add_itemsOrder/${orderId}`, orderData).subscribe(
      (response) => {
        console.log('Order items saved successfully:', response);
        localStorage.removeItem('cart'); 
        this.router.navigate(['/checkout'], {
          state: { orderId: orderId }
        });

      },
      (error) => {
        console.error('Error saving order items:', error);
      }
    );

  }

  reviewpage(){
    this.router.navigate(['/reviewpage'], {
      state: { vendor_id: this.vendorId }
    });

  }

  getCategories(vendorId: number){
    this.api.getCategories(this.vendorId).subscribe((resp: any) => {
      if(resp){
        this.categories = resp.data;
        console.log(this.categories);
      } else {
        console.error("Error no categories")
      }
    })
  }

  goToChat(vendor: { vendor_id: number; vendor_name: string }): void {
    this.sharedservice.setVendor(vendor);
    this.router.navigate(['/chat']);
  }

  getRatings(vendorId: number): void {
    this.api.getreview(vendorId).subscribe((resp: any) => {
        if (resp && resp.data) {
            this.calculateAverageRating(resp.data);
        } else {
            console.error('No rating data found');
        }
    }, error => {
        console.error('Error fetching ratings:', error);
    });
}

calculateAverageRating(reviews: any[]): void {
    const total = reviews.length;
    let sum = 0;

    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
        sum += review.rating; 
        this.ratingDistribution[review.rating] = (this.ratingDistribution[review.rating] || 0) + 1; 
    });

    this.averageRating = total > 0 ? (sum / total) : 0; 
    this.totalRatings = total; 
}

  
  

}
