import { Component } from '@angular/core';

import {  RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, CommonModule, RouterOutlet,  NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  user: any = null;  



  constructor(private userService: UserService) {
    this.user = this.userService.getUser();  
  }
  logout() {
    this.userService.logout(); 
    this.user = null; 
  }
  
}

