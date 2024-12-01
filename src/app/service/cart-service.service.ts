import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cartItems: any[] = [];

  constructor() {
    this.loadCartFromLocalStorage();
   }


  addToCart(product: any, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product_id === product.product_id);

    if (existingItem) {
      existingItem.quantity += quantity; // Increment quantity if product exists
    } else {
      this.cartItems.push({ ...product, quantity });
    }

    this.saveCartToLocalStorage();
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
    }
    
    // Clear the entire cart
    clearCart(): void {
      this.cartItems = [];
      this.saveCartToLocalStorage();
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
      }
    }
  }
  