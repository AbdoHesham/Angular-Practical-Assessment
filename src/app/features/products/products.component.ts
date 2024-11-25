import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { DataService } from '../../core/services/data-service.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/models/order.model';
@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [HttpClient],
  standalone: true,
})
export class ProductsComponent {
  products: Product[] = [];
  private dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((data: any) => {
      this.products = data;
      console.log(data);
    });
  }

  editQuantity(product: Product): void {
    const newQuantity = prompt(
      'Enter new quantity:',
      product.AvailablePieces.toString()
    );
    if (newQuantity) {
      product.AvailablePieces = parseInt(newQuantity, 10);
      this.dataService
        .editProductQuantity(product.ProductId, product.AvailablePieces)
        .subscribe();
    }
  }
  addOrder(order: Product) {
    // Add the new order to the existing orders
    const newOrder: Order = {
      OrderId: order.ProductId+1,
      OrderDate: new Date().toISOString(),
      UserId: '1', // Replace with actual user ID
      Products: [{ ProductId: order.ProductId, Quantity: 1 }],
      PaymentType: 'Cash', // Replace with actual payment type
    };
    this.dataService.addOrder(newOrder);
  }
}
