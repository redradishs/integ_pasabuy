import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cartItems: any[] = [];
  //add
  private cartSubject = new BehaviorSubject<any[]>([]); // Observable for cart state
  cartItems$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
    //add
    this.updateCartSubject();
   }


   addToCart(product: any, quantity: number = 1, size?: any): void {
    const variationId = size ? size.variation_id : null;
    const existingItem = this.cartItems.find(item => 
      item.product_id === product.product_id && item.variation_id === variationId
    );
  
    if (existingItem) {
      existingItem.quantity += quantity; 
    } else {
      this.cartItems.push({
        ...product,
        variation_id: variationId,
        quantity
      });
    }
  
    this.saveCartToLocalStorage();
    //add
    this.updateCartSubject();
  }

    // Get all cart items
    getCartItems(): any[] {
      this.loadCartFromLocalStorage();
      return this.cartItems;
    }
  
    // Remove a product from the cart
    removeFromCart(productId: number): void {
      // Filter out the specific item
      this.cartItems = this.cartItems.filter(item => item.product_id !== productId);
    
      // Save the updated cart to localStorage or backend
      this.saveCartToLocalStorage();
      this.updateCartSubject();
    }
    
    // Clear the entire cart
    clearCart(): void {
      this.cartItems = [];
      this.saveCartToLocalStorage();
      this.updateCartSubject();
    }
  
    // Save cart to local storage
    private saveCartToLocalStorage(): void {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  
    // Load cart from local storage
    private loadCartFromLocalStorage(): void {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
      }else {
        this.cartItems = [];
      }
    }
    //add
    private updateCartSubject(): void {
      this.cartSubject.next([...this.cartItems]); // Emit a new value for the observable
    }
  }
  