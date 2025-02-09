import { Component, inject } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  
})
export class NavbarComponent {
  loggedUser: any = null;
  userService = inject(UserService);
  router = inject(Router);
  cartService = inject(CartService);
  cartItemCount$: Observable<number>;

  constructor() {
    this.userService.getLoggedInUser().subscribe((user) => {
      this.loggedUser = user;
    });

    this.cartItemCount$ = this.cartService.getCartItemCount();
    
    this.cartItemCount$.subscribe(count => console.log(" Αριθμός προιόντων στο καλάθι:", count));
  }
  

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}

  

