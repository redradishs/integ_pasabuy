import { Routes } from '@angular/router';
import { LoginComponent } from './customer/login/login.component';
import { SignupComponent } from './customer/signup/signup.component';
import { ForgotPasswordComponent } from './customer/forgot-password/forgot-password.component';
import { TermsComponent } from './customer/terms/terms.component';
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
import { StoreComponent } from './customer/store/store.component';
import { FeedbacksComponent } from './customer/feedbacks/feedbacks.component';
import { ReviewhomeComponent } from './customer/reviewhome/reviewhome.component';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'terms', component: TermsComponent, canActivate: [authGuard]},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},
    {path: 'product/:vendorId', component: ProductComponent, canActivate: [authGuard]},
    {path: 'productDetails/:vendorId', component: ProductDetailsComponent, canActivate: [authGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'cart', component: CheckoutComponent, canActivate: [authGuard]},
    {path: 'checkout', component: CartComponent, canActivate: [authGuard]},
    {path: 'checkout/:order_id', component: CartComponent, canActivate: [authGuard]},
    {path: 'orderstatus', component: OrderstatusComponent, canActivate: [authGuard]},
    {path: 'invoice', component: InvoiceComponent , canActivate: [authGuard]},
    {path: 'orderhistory', component: OrderhistoryComponent, canActivate: [authGuard]},
    {path: 'chat', component: ChatComponent, canActivate: [authGuard]},
    {path: 'review', component: ReviewComponent, canActivate: [authGuard]},
    {path: 'reviewpage', component: ReviewpageComponent, canActivate: [authGuard]},
    {path: 'checkouttest', component: CheckouttestComponent, canActivate: [authGuard]},
    {path: 'store/:vendorId', component: StoreComponent, canActivate: [authGuard]},
    {path: 'feedbacks', component: FeedbacksComponent, canActivate: [authGuard]},
    {path: 'reviewvendor/:id', component: ReviewhomeComponent, canActivate: [authGuard]},
    {path: '**', component: LoginComponent } 
];
