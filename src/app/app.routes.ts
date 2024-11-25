import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { OrdersComponent } from './features/orders/orders.component';
import { OrderDetailsComponent } from './features/order-details/order-details.component';

export const routes: Routes = [
    { path: 'products', component: ProductsComponent, pathMatch: 'full' },
    { path: 'orders', component: OrdersComponent, pathMatch: 'full' },
    { path: 'order-details/:id', component: OrderDetailsComponent, pathMatch: 'full' },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products' },
];
