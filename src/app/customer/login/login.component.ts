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
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { NgxSpinnerService } from 'ngx-spinner'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    NgxSpinnerModule
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
    private authService: AuthService,
    private spinner: NgxSpinnerService
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
    }
  }

  userLogin(): void {
    if (this.loginForm.valid) {
      this.clicked = true;
      this.spinner.show(); 
      this.loading = true;
  
      // Create a data object to pass to the service
      const { email, password, rememberMe } = this.loginForm.value;
  
      // Pass the data object to the authService
      const loginData = { email, password, rememberMe };
  
      this.authService.userLogin(loginData).subscribe({
        next: (response: any) => {
          // Login success: store the JWT token and navigate to home
          this.authService.setToken(response.jwt);
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
          }
          Swal.fire({
            title: 'Login Successful',
            text: 'You have successfully logged in!',
            icon: 'success',
            confirmButtonText: 'OK',
             confirmButtonColor: '#4CAF50'
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
            confirmButtonText: 'OK',
            confirmButtonColor: '#FF5733'
          });
          this.resetFormState();
          this.spinner.hide(); 
        },
        complete: () => {
          this.loading = false;
          this.spinner.hide(); 
          this.clicked = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields';
      Swal.fire({
        title: 'Error',
        text: this.errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF5733' 
      });
    }
  }
  

  private resetFormState(): void {
    this.loginForm.patchValue({ password: '' });
    this.loading = false;
    this.clicked = false;
  }
}
