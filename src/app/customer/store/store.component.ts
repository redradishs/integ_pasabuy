import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { CartServiceService } from '../../service/cart-service.service';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../service/shared.service';
import { CommonModule } from '@angular/common';


export interface VendorProfile {
  vendor_id: number;
  vendor_name: string;
  image?: string;
  location: string;
  operating_hours: string;
  rating: number;
  description: string;
  vendor_profile_image: string;
}

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

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [HeaderComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  breadcrumbs: Array<{ label: string; link: string; iconViewBox: string }> = [];
  vendorId: number = 0;
  vendorProfile: VendorProfile = { rating: 0, vendor_id: 0, vendor_name: '', image: '', location: '', operating_hours: '', description: '', vendor_profile_image: '' };
  selectedCategory: String = 'All';
  averageRating: number = 0;
  ratingDistribution: { [key: number]: number } = {}; 
  totalRatings: number = 0;
  categories: any;
  userId: number = 0;
  cartItems: any[] = [];
  products: Product[] = [];
  voucherAmount: number = 0; 

  selectedProduct: any;
  quantity: number = 1;
  selectedVariations: any;
  orderId: number = 0;

  pickup_time = '0000-00-00 12:00';
  order_status = 'Pending';
  currentIndex: number = 0;
  selectedSize: any = null;






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


  this.vendorId = Number(this.route.snapshot.paramMap.get('vendorId'));

  this.setupBreadcrumbs();
  this.shuffleProducts();
  this.viewproducts(this.vendorId);
  this.getCategories(this.vendorId);
  this.loadCart();
  this.viewVendorProfile(this.vendorId)
  this.getRatings(this.vendorId);
  this.loadCart();

  
}

shuffleProducts(): void {
  this.products.sort(() => Math.random() - 0.5);
}

previousProduct(): void {
  this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.products.length - 1;
}

selectSize(size: any): void {
  this.selectedSize = size;
  console.log('Selected Size:', this.selectedSize); 
}


nextProduct(): void {
  this.currentIndex = (this.currentIndex + 1) % this.products.length;
}

get currentProduct() {
  return this.products[this.currentIndex];
}
formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(value);
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


closeModal() {
  this.selectedProduct = null;
}

openProductModal(product: any) {
  this.selectedProduct = product;
  this.quantity = 1;
}

incrementQuantity(): void {
  this.quantity++;
}

decrementQuantity(): void {
  if (this.quantity > 1) {
    this.quantity--;
  }
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
    order_id: null,
    variation_id: item.variation_id || null
  }));

  this.saveOrder(order, orderItems);
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

getTotalPrice(): number {
  const totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  return totalPrice - this.voucherAmount;
}


clearCart(): void {
  this.cart.clearCart();
  this.loadCart();
}

increment(item: any): void {
  item.quantity++; 
  this.saveCartToLocalStorage();
}

decrement(item: any): void {
  if (item.quantity > 1) {
    item.quantity--; 
    this.saveCartToLocalStorage();
  }
}

private saveCartToLocalStorage(): void {
  localStorage.setItem('cart', JSON.stringify(this.cartItems));
}


getProductPrice(item: any): number {
  return item.price * item.quantity;  
} 

// addToCart(product: any, quantity: number, size?: any): void {
//   if (product && quantity > 0) {
//     const cartItem = {
//       product_id: product.product_id,
//       product_name: product.product_name,
//       fullImageUrl: product.fullImageUrl || `http://localhost/tindahub_backend/api/${product.prod_img}`,
//       vendor_id: product.vendor_id,
//       vendor_name: product.vendor_name,
//       category_id: product.category_id,
//       category_name: product.category_name,
//       size: size ? size.variation_name : 'Default', 
//       price: size ? parseFloat(size.price) : parseFloat(product.price), 
//       quantity: quantity,
//       total: size 
//         ? (parseFloat(size.price) * quantity).toFixed(2)
//         : (parseFloat(product.price) * quantity).toFixed(2), 
//       variation_id: size ? size.variation_id : null, 
//     };

//     if (cartItem.variation_id) {

//       this.cart.addToCart(cartItem);
//       console.log(`${product.product_name} with variation added to cart`, cartItem);
//     } else {

//       this.cart.addToCart(cartItem);
//       console.log(`${product.product_name} added to cart (grouped)`, cartItem);
//     }

//     this.loadCart();
//     this.closeModal();
//   } else {
//     console.error('Invalid product or quantity');
//   }
// }

addToCart(product: any, quantity: number, selectedSize: any): void {
  if (product && quantity > 0) {
    const cartItem = {
      product_id: product.product_id,
      product_name: product.product_name,
      fullImageUrl: product.fullImageUrl || `http://localhost/tindahub_backend/api/${product.prod_img}`,
      vendor_id: product.vendor_id,
      vendor_name: product.vendor_name || 'Default Vendor',
      category_id: product.category_id || 'Default Category',
      category_name: product.category_name || 'Default Category Name',
      size: selectedSize ? selectedSize.variation_name : 'Default',
      price: selectedSize ? parseFloat(selectedSize.price) : parseFloat(product.price),
      quantity: quantity,
      total: selectedSize ? (parseFloat(selectedSize.price) * quantity).toFixed(2) : (parseFloat(product.price) * quantity).toFixed(2),
      variation_id: selectedSize ? selectedSize.variation_id : null, 
    };

    console.log('Cart item:', cartItem); 

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    cart.push(cartItem);

    localStorage.setItem('cart', JSON.stringify(cart));

    console.log('Cart saved to localStorage:', cart);

    this.loadCart();
    this.closeModal();
  } else {
    console.error('Invalid product or quantity');
  }
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


// saveOrderItems(orderId: number, orderItems: any[]) {
//   const orderData = {
//     data2: orderItems.map(item => ({
//       product_id: item.product_id,
//       variation_id: item.variation_id || null,  
//       quantity: item.quantity,
//       unit_price: item.unit_price,
//       special_instruction: item.special_instruction || ''  
//     }))
//   };

//   this.http.post(`http://localhost/unimart_pasabuy/api/add_itemsOrder/${orderId}`, orderData).subscribe(
//     (response) => {
//       console.log('Order items saved successfully:', response);
//         localStorage.removeItem('cart'); 
//       this.router.navigate(['/checkout'], {
//         state: { orderId: orderId }
//       });
//     },
//     (error) => {
//       console.error('Error saving order items:', error);
//     }
//   );
// }

saveOrderItems(orderId: number, orderItems: any[]) {
  const orderData = {
    data2: orderItems.map(item => ({
      product_id: item.product_id,
      variation_id: item.variation_id || null,
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


                setCategory(category: string): void {
                  this.selectedCategory = category
                }

                get FilteredProducts() {
                  if(this.selectedCategory === 'All') {
                    return this.products;
                  } 
                  return this.products.filter(product => product.category === this.selectedCategory);
                }
              



reviewpage(){
  this.router.navigate(['/reviewpage'], {
    state: { vendor_id: this.vendorId }
    });
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
