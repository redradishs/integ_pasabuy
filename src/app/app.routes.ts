import { Routes } from '@angular/router';
import { HomeComponent } from './customer/home/home.component';
import { LoginComponent } from './customer/login/login.component';
import { SignupComponent } from './customer/signup/signup.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { CartComponent } from './customer/cart/cart.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'home', component: HomeComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'cart', component: CartComponent},
    { path: '**', component: LoginComponent } 
];
