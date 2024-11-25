import { Component, inject, Inject } from '@angular/core';
import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  products: Product[] = [];
  orders: Order[] = [];
  private dataService = inject(DataService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
    } else {
      this.dataService.getOrders().subscribe((data) => {
        this.orders = data;
        localStorage.setItem('orders', JSON.stringify(this.orders));
      });
    }
  }

  calculateTotal(order: Order): number {
    return order.Products.reduce((total, item) => {
      const product = this.products.find((p) => p.ProductId === item.ProductId);
      return total + (product?.ProductPrice || 0) * item.Quantity;
    }, 0);
  }
  gotoOrderDetails(productId: number): void {
    this.router.navigate(['/order-details', productId]);
    // Implement navigation to product details page
  }
}
