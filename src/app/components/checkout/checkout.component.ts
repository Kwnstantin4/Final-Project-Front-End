import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { OrderService } from '../../shared/services/order.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService, 
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      alert('Παρακαλώ συμπληρώστε όλα τα πεδία σωστά.');
      return;
    }

    const userId = localStorage.getItem("userId"); 

    const orderData = {
      userId: userId,  //  Προσθήκη userId
      address: this.checkoutForm.value.address,
      phone: this.checkoutForm.value.phone,
      products: this.cartService.getCartItems().map(product => ({
        productId: product._id,  
        name: product.name || "Άγνωστο προϊόν", 
        category: product.category || "Χωρίς κατηγορία", 
        cost: product.cost || 0, 
        quantity: product.quantity 
      })),
    };

    console.log("Αποστολή παραγγελίας:", orderData);

    //  Αποστολή στο backend μέσω OrderService
    this.orderService.placeOrder(orderData).subscribe({
      next: (response) => {
        console.log(" Επιτυχής αποστολή παραγγελίας:", response);
        alert("Η παραγγελία σας ολοκληρώθηκε!");
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(" Σφάλμα κατά την αποστολή της παραγγελίας:", error);
        alert("Σφάλμα κατά την ολοκλήρωση της παραγγελίας. Δοκιμάστε ξανά.");
      }
    });
  }
}




