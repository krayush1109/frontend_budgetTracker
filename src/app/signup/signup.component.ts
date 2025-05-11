import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../component/navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
   imports: [CommonModule, ReactiveFormsModule,NavbarComponent], // Direct imports instead of app.module.ts
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  submitted = false;
  registerForm: FormGroup;

  // constructor(private fb: FormBuilder) {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    console.log("this.registerForm.invalid : " + this.registerForm.invalid);
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.valid) {
      console.log('Registration Successful!', this.registerForm.value);
      
      const userData = this.registerForm.value;

      this.authService.signup(userData).subscribe(
        response => {
          console.log("SignUp Successful", response);
          alert("SignUp Successful");
          this.router.navigateByUrl('/login')
        },
        error => {
          console.error("SignUp Failed: ", error);
          alert("SignUp Failed. Please try again.");
        }
      )

    }

  }  

}
