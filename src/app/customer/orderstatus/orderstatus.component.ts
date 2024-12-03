import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface cartsSS {
  mode_of_payment: String,
  order_date: string,
  order_id: number,
  order_status: String,
  pickup_time: String,
  request_status: String,
  special_instruction: String,
  total_amount: String,
  user_id: number,
  vendor_id: number
}


@Component({
  selector: 'app-orderstatus',
  standalone: true,
  imports: [HeaderComponent, NgIf, CommonModule, NgClass],
  templateUrl: './orderstatus.component.html',
  styleUrl: './orderstatus.component.css',
  providers: [DatePipe]
})
export class OrderstatusComponent {

  orderData = {
    pickupTime: '',
    specialInstruction: '',
    modeOfPayment: ''
  }

  order_status = "placed"
  intervalId: any;

  order_id: number = 0;
  carts: any;
  cartItems: any[] = [];
  userId: number = 0;
  prifiledata: any;
  voucherAmount: number = 0; 
  orderStatus: any;
  currentstatus = "placed"
  statusLength: number = 0;
  userProfile: any;

  ngOnInit(): void {
    this.getCart(this.order_id);
    this.getCheckout(this.order_id);
    this.getSpecificStatus(this.order_id);

    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.getProfile();
      } else {
        console.log("User not found");
      }
    })
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private datePipe: DatePipe){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order_id = navigation.extras.state['orderId'];
      console.log(this.order_id)
    }
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

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy h:mm a') || '';
  }

  getProfile(){
    this.api.getProfile(this.userId).subscribe((resp: any) => {
      if(resp) {
        this.userProfile = resp.data[0];
        console.log(this.userProfile)
      } else {
        console.log('No user details found');
      }
    })
  }

  

  
  getCheckout(order_id: number): void {
    this.api.getCheckout(order_id).subscribe(
      (resp: any) => {
        try {
          console.log('Checkout Response:', resp);
  
          if (resp && Array.isArray(resp.data)) {
            this.cartItems = resp.data.map((item: any) => ({
              ...item,
              fullImageUrl: item.product_prod_img
                ? `http://localhost/tindahub_backend/api/${item.product_prod_img}`
                : 'assets/unimartLogi.png',
            
            }));
            console.log('Full API response:', resp);
            console.log('Response data:', resp.data);
            
          } else {
            console.error('Response data is not an array or is missing');
            this.carts = [];
          }
        } catch (error) {
          console.error('Error processing checkout response', error);
          this.cartItems = [];
        }
      },
      (error) => {
        console.error('Error fetching checkout data:', error);
      }
    );
  }


  getSpecificStatus(order_id: number){
    this.api.getOrderStatus(this.order_id).subscribe((resp: any) => {
      this.orderStatus = resp.data;
      console.log("status", this.orderStatus);
      this.statusLength = this.orderStatus.length;
      console.log("Order status length:", this.statusLength);
    }, error => {
      console.error("Error fetching order status", error);
    })
  }

  startPolling(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.getSpecificStatus(this.order_id);
      }, 5000); // Poll every 5 seconds
    }
  }

  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }


  cancelOrder(order_id: number){
    this.api.cancelorder(this.order_id).subscribe((resp: any) => {
      console.log('Order has been canceled')
      this.router.navigate(['/home']);
    }, error => {
      console.error("Error cancelling order", error);
    })
  }

  downloadPDF() {
    const invoiceElement = document.getElementById('invoice');
    
    if (!invoiceElement) {
      console.error('Invoice element not found!');
      return;
    }
  
    // Ensure the element is visible before rendering
    const wasHidden = invoiceElement.classList.contains('hidden');
    invoiceElement.classList.remove('hidden');
  
    html2canvas(invoiceElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190; // Adjust the image width to fit within the PDF
      const pageHeight = 297; // Standard A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add the first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // Add remaining pages, if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Adjust position for the next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // Save the PDF file
      pdf.save('invoice.pdf');
    }).finally(() => {
      // Restore hidden class if it was originally hidden
      if (wasHidden) {
        invoiceElement.classList.add('hidden');
      }
    });
  }

  goHomeHehe(){
    this.router.navigate(['/home']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value);
  }


  





}
