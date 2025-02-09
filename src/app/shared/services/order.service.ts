import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service'; 

const API_URL = `${environment.apiUrl}/orders`;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private userService = inject(UserService); 

  placeOrder(orderData: any) {
    return this.http.post(`${API_URL}`, orderData, this.userService.getAuthHeaders()) 
      .pipe(
        tap(() => console.log(" Παραγγελία στάλθηκε επιτυχώς!")),
        catchError((error) => {
          console.error(' Σφάλμα κατά την αποστολή παραγγελίας:', error);
          return throwError(() => error);
        })
      );
  }
}


