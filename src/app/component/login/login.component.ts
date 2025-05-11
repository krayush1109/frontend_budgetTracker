import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe(
        response => {
          console.log('Login successful:', response);
          alert('Login Successful! 🎉');
          // this.authService.saveToken(response.token); // Save JWT token for future requests
          this.authService.saveToken(response.token, response.userId, response.username);
          this.router.navigateByUrl('/dashboard')
          
        },
        error => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials, please try again.';
          alert(this.errorMessage);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}