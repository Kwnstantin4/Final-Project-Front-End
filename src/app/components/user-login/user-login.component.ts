import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginResponse, UserService } from 'src/app/shared/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggedInUser, LoginCredentials } from 'src/app/shared/interfaces/user';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule, 
    RouterModule
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent {
  invalidLogin = false;

  userService = inject(UserService);
  router = inject(Router);

  loginStatus: { success: boolean; message: string } = {
    success: false,
    message: 'Not attempted yet',
  };

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  onSubmit() {
    if (this.form.invalid) {
      console.error(" Η φόρμα είναι άκυρη!");
      return;
    }
  
    const credentials: LoginCredentials = { 
      email: this.form.value.email as string, 
      password: this.form.value.password as string 
    };
  
    this.userService.loginUser(credentials).subscribe({
      next: (response: LoginResponse) => {
        console.log("Επιτυχής σύνδεση:", response);
        
  
        const access_token = response.access_token;
        
        localStorage.setItem('access_token', access_token);
        console.log("Token αποθηκεύτηκε:", access_token);
  
        // Αποκωδικοποίηση Token
        try {
          const decodedToken = jwtDecode(access_token) as any;
          console.log("Αποκωδικοποιημένο Token:", decodedToken);
  
          if (!decodedToken.fullname) {
            console.warn(" Το fullname λείπει από το token! Δημιουργία από name + surname.");
            decodedToken.fullname = `${decodedToken.name} ${decodedToken.surname}`;
          }
  
          const loggedUser: LoggedInUser = {
            fullname: decodedToken.fullname,
            email: decodedToken.email
          };
  
          // ✔ Ενημέρωση χρήστη στο UserService
          this.userService.notifyUserLogin(loggedUser);
        } catch (error) {
          console.error("Σφάλμα αποκωδικοποίησης token:", error);
        }
  
        this.router.navigate(['/']);
      },
      error: () => {
        this.invalidLogin = true;
        console.error("Σφάλμα σύνδεσης: Λάθος email ή κωδικός!");
      },
    });
  }
  navigateToSignup() {
    this.router.navigate(['/user-registration']);
  }
}  