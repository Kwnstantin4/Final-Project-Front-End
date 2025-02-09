import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/interfaces/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService,private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }



  viewProduct(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} προστέθηκε στο καλάθι!`);
  }
}

