import { Route } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Route[] = [
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'user-registration',
    component: UserRegistrationComponent,
  },
  
  { path: 'user-login', component: UserLoginComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '', component: WelcomeComponent },
  { path: 'login', redirectTo: 'user-login', pathMatch: 'full' }

  
];


