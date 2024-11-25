import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/core/services/data-service.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent {
  ordersCount: number = 0;
  private dataService = inject(DataService);
  isNavbarCollapsed = false;

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  ngOnInit(): void {
    this.loadOrdersCount();
  }

  loadOrdersCount(): void {
    this.dataService.ordersCount$.subscribe((count) => {
      this.ordersCount = count;
    });
  }
}
