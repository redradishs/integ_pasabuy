import { Component } from '@angular/core';
import { PaymongoService } from '../../service/paymongo.service';

@Component({
  selector: 'app-checkouttest',
  standalone: true,
  imports: [],
  templateUrl: './checkouttest.component.html',
  styleUrl: './checkouttest.component.css'
})
export class CheckouttestComponent {
  amount: number = 909999; 
  description: string = 'Payment for Order #12345'; 

  constructor(private paymongoService: PaymongoService) {}

  async proceedToCheckout() {
    try {
      const paymentLink = await this.paymongoService.createPaymentLink(this.amount, this.description);
      console.log('Payment Link:', paymentLink);

      if (paymentLink.data.attributes.checkout_url) {
        window.location.href = paymentLink.data.attributes.checkout_url; 
      } else {
        console.error('Checkout URL not found in response.');
      }
    } catch (error) {
      console.error('Payment link creation failed:', error);
    }
  }
}