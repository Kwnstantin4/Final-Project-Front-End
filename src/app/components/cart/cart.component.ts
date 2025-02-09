import { Component } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/interfaces/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartItems: Product[] = [];
  totalCost: number = 0;

  constructor(private cartService: CartService, private router: Router) {
    this.updateCart();
  }

  updateCart() {
    this.cartItems = this.cartService.getCartItems();
    this.totalCost = this.cartService.getTotalCost();
    
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.updateCart(); // ✅ Ενημέρωση του UI
  }

  addItem(product: Product) {
    this.cartService.addToCart(product);
    this.updateCart(); // ✅ Ενημέρωση του UI
  }

  clearCart() {
    this.cartService.clearCart();
    this.updateCart();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}

