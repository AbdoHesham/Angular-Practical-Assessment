import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { WebAuthnService } from './services/webauthn.service';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet,
    // NavbarComponent,
    CommonModule
  ],
  template: `
    <div class="auth-container">
      <h1>Web Biometrics in Angular</h1>
      <button (click)="register()">Register with Fingerprint</button>
      <button (click)="login()">Login with Face ID</button>
      <p *ngIf="message" [ngClass]="{'success': isSuccess, 'error': !isSuccess}">{{ message }}</p>
    </div>
  `,
  styles: [`
    .auth-container {
      text-align: center;
      padding: 50px;
    }
    .success {
      color: green;
    }
    .error {
      color: red;
    }
    button {
      margin: 10px;
      padding: 10px 20px;
      font-size: 16px;
    }
    p {
      margin: 10px;
      font-size: 16px;
    }
  `]
})
export class AppComponent {
  title = 'Angular-Practical-Assessment';
  message: string | null = null; // Message to display feedback to the user
  isSuccess: boolean = false; // Indicates if the last action was successful

  private webAuthnService = inject(WebAuthnService);

  // Trigger registration process and update the UI based on the outcome
  async register() {
    try {
      await this.webAuthnService.register();
      this.message = "Registration successful!"; // Success message if registration works
      this.isSuccess = true;
    } catch (err) {
      this.message = "Registration failed. Please try again."; // Error message if something goes wrong
      this.isSuccess = false;
    }
  }

  // Trigger authentication process and update the UI based on the outcome
  async login() {
    try {
      await this.webAuthnService.authenticate();
      this.message = "Authentication successful!"; // Success message if authentication works
      this.isSuccess = true;
    } catch (err) {
      this.message = "Authentication failed. Please try again."; // Error message if something goes wrong
      this.isSuccess = false;
    }
  }
}
