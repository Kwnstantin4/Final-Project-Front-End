import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from 'src/app/shared/services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterModule
],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css',
})
export class UserRegistrationComponent {
  constructor(private router: Router) {}
  userService = inject(UserService);

  registrationStatus: { success: boolean; message: string } = {
    success: false,
    message: 'Not attempted yet',
  };

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    address: new FormGroup({
      area: new FormControl('', Validators.required),
      road: new FormControl('', Validators.required),
    }),
    phone: new FormGroup({
      type: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
    }),
  }, 
  { validators: this.passwordMatchValidator() } 
  );

  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  onSubmit() {
    
      if (this.form.invalid) {
        console.log('Η φόρμα είναι άκυρη! Παρακαλώ συμπληρώστε όλα τα πεδία.');
        return;
      }
    
      const user = {
        username: this.form.get('username')?.value,
        name: this.form.get('name')?.value,
        surname: this.form.get('surname')?.value,
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        address: {
          area: this.form.get('address.area')?.value,
          road: this.form.get('address.road')?.value,
        },
        phone: [{
          type: this.form.get('phone.type')?.value,
          number: this.form.get('phone.number')?.value,
        }],
      };
    
      console.log(' Υποβολή χρήστη:', user);
    
      this.userService.registerUser(user).subscribe({
        next: (response) => {
          console.log('✔ Ο χρήστης καταχωρήθηκε:', response.msg);
          this.registrationStatus = { success: true, message: response.msg };
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
        },
        error: (error) => {
          console.error(' Σφάλμα κατά την εγγραφή:', error.error.msg);
          this.registrationStatus = { success: false, message: error.error.msg };
        },
      });
    }

    

  registerAnotherUser() {
    this.form.reset();
    this.registrationStatus = { success: false, message: 'Not attempted yet' };
  }

  checkDuplicateUsername() {
    const username = this.form.get('username')?.value;
    if (!username) return;
  
    this.userService.checkDuplicateUsername(username).subscribe({
      next: (response) => {
        console.log(response.msg);
        this.form.get('username')?.setErrors(null); //  Αν δεν υπάρχει, το username είναι έγκυρο
      },
      error: (response) => {
        console.log(response.error.msg);
        this.form.get('username')?.setErrors({ duplicateUsername: true }); //  Αν υπάρχει, δείχνει σφάλμα
      },
    });
  }
  

  checkDuplicateEmail() {
    const email = this.form.get('email')?.value;
    if (!email) return;

    this.userService.checkDuplicateEmail(email).subscribe({
      next: (response) => {
        console.log(response.msg);
        this.form.get('email')?.setErrors(null);
      },
      error: (response) => {
        console.log(response.error.msg);
        this.form.get('email')?.setErrors({ duplicateEmail: true });
      },
    });
  }

//  navigateToLogin() {
//    this.router.navigate(['/login']);
//  }

navigateToLogin() {
  this.router.navigate(['/user-login']).then(success => {
    if (!success) {
      console.error('Η πλοήγηση στο Login απέτυχε.');
    } else {
      console.log('Επιτυχής πλοήγηση στη σελίδα Login.');
    }
  });
}

}
