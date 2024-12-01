import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {

  userProfile: any;
  cartItems: any;
  order_id = 55;
  carts: any;


  constructor(private api: ApiService, private auth: AuthService, private router: Router){

  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((user) => {
      if (user) {
        this.getDetailsProf(user.id);
      } else {
        console.log("User not found");
      }
    });

    this.getCart(this.order_id);
    this.getCheckout(this.order_id);
    
  }


  getDetailsProf(id: number){
    this.api.getProfile(id).subscribe((response:any) => {
      if(response) {
        this.userProfile = response.data[0];
        console.log(this.userProfile)
      } else {
        console.log('No user details found');
      }
    })
  }

  
  getCart(id: number): void {
    this.api.getCart(this.order_id).subscribe((resp: any) => {
      try {
        this.carts = resp.data;
        console.log("cart res", this.carts);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    })
  }


    
  getCheckout(order_id: number): void {
    this.api.getCheckout(this.order_id).subscribe((resp: any) => {
      try {
        this.cartItems = resp.data;
        console.log('Checkout Response:', resp);
      } catch (error) {
        console.error("Error fetching checkout", error);
      }
    }
  )
  }


  downloadPDF() {
    const invoiceElement = document.getElementById('invoice');

    if (invoiceElement) {
      html2canvas(invoiceElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 190;
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('invoice.pdf');
      });
    } else {
      console.error('Invoice element not found!');
    }
  }
}