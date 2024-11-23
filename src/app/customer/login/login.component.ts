/*import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 
  loading: boolean = false; 
  
  constructor(private authService: AuthService, private router: Router) {}
  
  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    
    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.userLogin(data).subscribe(
      (response: any) => {
        console.log('Login Successful.', response);
        this.authService.setToken(response.jwt);
        this.router.navigate(['/home']);
        this.loading = false;
      },
      (error: any) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }
}*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../service/auth.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatIconModule,
            MatCheckboxModule,
            MatInputModule,
            MatFormFieldModule,
            MatButtonModule,
            RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false; 
  clicked = false;
  rememberMe: boolean = false;

  constructor(
              private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]),
      rememberMe: new FormControl(false)
    });
  }

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      this.loginForm.patchValue({ email: storedEmail });
      //this.loginForm.patchValue({ rememberMe: true });
    }
  }

  userLogin(): void {
    if (this.loginForm.valid) {
      this.clicked = true; 
      this.loading = true;
  
      const { email, password, rememberMe } = this.loginForm.value;
  
      this.authService.login(email, password, rememberMe).subscribe({
        next: (response: any) => {
          // Login success: store the JWT token and navigate to home
          this.authService.setToken(response.jwt, rememberMe);
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email); // Store email if Remember Me is checked
          }
          Swal.fire({
            title: 'Login Successful',
            text: 'You have successfully logged in!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          // Handle errors: show message, reset loading and clicked states
          this.errorMessage = 'Invalid Email or Password';
          Swal.fire({
            title: 'Error',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.resetFormState();
        },
        complete: () => {
          // Ensure states are reset after any response
          this.loading = false;
          this.clicked = false;
        }
      });
    } else {
      // If form is invalid, display an error message
      this.errorMessage = 'Please fill in all fields';
      Swal.fire({
        title: 'Error',
        text: this.errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  private resetFormState(): void {
    this.loginForm.patchValue({ password: '' });
    this.loading = false;
    this.clicked = false;
  
  }
}