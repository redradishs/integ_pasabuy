import { Routes } from '@angular/router';
import { LoginComponent } from './customer/login/login.component';
import { SignupComponent } from './customer/signup/signup.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { HomeComponent } from './customer/home/home.component';
import { ProductComponent } from './customer/product/product.component';
import { CartComponent } from './customer/cart/cart.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'home', component: HomeComponent},
    {path: 'product', component: ProductComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'cart', component: CartComponent},
    { path: '**', component: LoginComponent } 
];
