import { Routes } from '@angular/router';
import { LoginComponent } from './customer/login/login.component';
import { SignupComponent } from './customer/signup/signup.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { HomeComponent } from './customer/home/home.component';
import { ProductComponent } from './customer/product/product.component';
import { ProductDetailsComponent } from './customer/product-details/product-details.component';
import { CartComponent } from './customer/cart/cart.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { OrderstatusComponent } from './customer/orderstatus/orderstatus.component';
import { InvoiceComponent } from './customer/invoice/invoice.component';
import { OrderhistoryComponent } from './customer/orderhistory/orderhistory.component';
import { ChatComponent } from './customer/chat/chat.component';
import { ReviewComponent } from './customer/review/review.component';
import { ReviewpageComponent } from './customer/reviewpage/reviewpage.component';
import { CheckouttestComponent } from './customer/checkouttest/checkouttest.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'home', component: HomeComponent},
    {path: 'product/:vendorId', component: ProductComponent},
    {path: 'productDetails/:vendorId', component: ProductDetailsComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'cart', component: CheckoutComponent},
    {path: 'checkout', component: CartComponent},
    { path: 'checkout/:order_id', component: CartComponent },
    { path: 'orderstatus', component: OrderstatusComponent },
    { path: 'invoice', component: InvoiceComponent },
    { path: 'orderhistory', component: OrderhistoryComponent},
    { path: 'chat', component: ChatComponent},
    { path: 'review', component: ReviewComponent},
    { path: 'reviewpage', component: ReviewpageComponent},
    { path: 'checkouttest', component: CheckouttestComponent},
    { path: '**', component: LoginComponent } 
];
