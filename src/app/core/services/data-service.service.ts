import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private productsUrl = 'assets/order-master-dp/products.json';
  private ordersUrl = 'assets/order-master-dp/orders.json';
  private usersUrl = 'assets/order-master-dp/users.json';
  private http = inject(HttpClient);
  private ordersCountSubject = new BehaviorSubject<number>(
    this.getOrdersCountFromStorage()
  );
  ordersCount$ = this.ordersCountSubject.asObservable();

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getOrder(orderId: number): Observable<Order | undefined> {
    return this.http.get<Order[]>(this.ordersUrl).pipe(
      map((orders) => {
        const order = orders.find((order) => order.OrderId == orderId);
        if (!order) {
          console.error(`Order with ID ${orderId} not found`);
        }
        return order;
      })
    );
  }
  

  editProductQuantity(productId: number, quantity: number): Observable<void> {
    return of();
  }

  addOrder(order: Order){
    const storedOrders = localStorage.getItem('orders');
    let orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
        const updatedOrders = [...orders, order];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        // Update the BehaviorSubject
        this.ordersCountSubject.next(updatedOrders.length);
 
  }

  private getOrdersCountFromStorage(): number {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders).length : 0;
  }

}
