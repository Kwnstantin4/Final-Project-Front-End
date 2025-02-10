import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Product[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  

  constructor() {}

    private updateCartItemCount() {
      const totalCount = this.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      console.log("Ενημέρωση αριθμού προϊόντων στο καλάθι:", totalCount);
      this.cartItemCount.next(totalCount);
  }
    addToCart(product: Product) {
      const existingProduct = this.cartItems.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
        
      } else {
        this.cartItems.push({ ...product, quantity: 1 }); 
      }
      this.updateCartItemCount();
    }
  
    
  
    removeFromCart(productId: string | number) {
      const parsedId = Number(productId);
      const product = this.cartItems.find((item) => Number(item.id) === parsedId);
  
      if (product) {
        if (product.quantity! > 1) {
          product.quantity! -= 1;  
        } else {
          this.cartItems = this.cartItems.filter((item) => Number(item.id) !== parsedId);
        }
        this.updateCartItemCount();
      }
    }
  
    clearCart() {
      this.cartItems = [];
      this.updateCartItemCount();
    }
  
  
  
  
  

  getCartItems(): Product[] {
    console.log("Προϊόντα στο καλάθι:", this.cartItems);
    return this.cartItems;
  }

  getTotalCost(): number {
    return this.cartItems.reduce((total, item) => total + (item.cost || 0) * (item.quantity || 1), 0);
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }


  
}




