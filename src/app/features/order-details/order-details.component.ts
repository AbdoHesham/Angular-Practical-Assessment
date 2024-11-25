import { Component, inject } from '@angular/core';
import { DataService } from '../../core/services/data-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Order } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  standalone: true
})
export class OrderDetailsComponent {
  order: Order | any;

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const orderId = this.route.snapshot.params['id'];
    this.getOrderDetails(orderId);
  }

  getOrderDetails(orderId: number): void {
    this.dataService.getOrder(orderId).subscribe((data) => {
      this.order = data;      
    });
  }
}
