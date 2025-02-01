import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaymongoService } from '../../service/paymongo.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';


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

interface issue {
  additional_details: string,
  issue_type: string,
  order_id: number,
  user_id: number,
  resolved_date: string,
  report_date: string,
  status: string
}


@Component({
  selector: 'app-orderstatus',
  standalone: true,
  imports: [HeaderComponent, NgIf, CommonModule, NgClass, FormsModule],
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
  linkData: any;

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
  
  paymentStatus: string = '';
  vendor_id: number = 0;
  linkId: string = '';
  orderReceived: boolean = false;

  isIssueReported: boolean = false;
  issueDescription: string = '';
  issueType: string = '';
  description: string = '';
  hasFiledissue: boolean = false;
  issueReps: issue[] = []; 


  isModalOpen: boolean = false;
  selectedItem: any = null;
  reviewText: string = '';
  selectedRating: number = 0;


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
    this.getIssueReport(this.order_id);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private datePipe: DatePipe, private paymongo: PaymongoService){
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
        this.vendor_id = resp.data.vendor_id;
        this.linkId = resp.data.payment_id;
        console.log("this is the link id", this.linkId)
        this.retrieveLink(this.linkId);
        


        console.log("cart res", this.carts);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    })
  }

  paymentSuccess(orderId: number) {
    this.api.paymentSuccess(orderId).subscribe((resp: any) => {
      console.log('Payment Success Response:', resp);
    }, (error) => {
      console.error('Error in payment success API:', error);
    });
  }

  paymentRevert(orderId: number) {
    this.api.paymentRevert(orderId).subscribe((resp: any) => {
      console.log('Payment Revert Response:', resp);
    }, (error) => {
      console.error('Error in payment revert API:', error);
    });
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


markOrderAsReceived() {
  this.api.complete_confirm(this.order_id).subscribe((resp: any) => {
    if (resp){
      console.log('Order Received Successfully');
      this.orderStatus = "received";
      this.orderReceived = true;
      this.getSpecificStatus(this.order_id);
    } else {
      console.error('Failed to mark order as received');
    }
  })
}

openModal() {
  this.isIssueReported = true;
}

closeModal() {
  this.isIssueReported = false;
}

setRating(star: number): void {
  this.selectedRating = star; 
}



submitProdReview(prod_id: number) {
  const reviewData = {
    user_id: this.userId,
    vendor_id: this.vendor_id,
    rating: this.selectedRating,
    review: this.reviewText
  };

  try {
    this.api.prod_review(this.selectedItem.product_id, this.order_id, reviewData).subscribe((resp: any) => {
      console.log('Product Review Submitted Successfully');
      this.offModal();
      this.reviewText = '';
      this.selectedRating = 0;
      this.getCart(this.order_id);
      this.getCheckout(this.order_id);
      this.getSpecificStatus(this.order_id);
  
    })
  } catch (error) {
    console.error('Error submitting product review:', error);
  }


}

toggleModal(item: any): void {
  this.selectedItem = item;
  console.log("This is the content of selected item", item)
  this.isModalOpen = !this.isModalOpen;
}

offModal(): void {
  this.isModalOpen = false;
  this.selectedItem = null;
}







showIssueReport() {
  this.isIssueReported = true;
}

cancelIssueReport() {
  this.isIssueReported = false;
  this.issueDescription = ''; 
}

submitIssue() {
  const issueData = {
    user_id: this.userId,
    issue_type: this.issueType,
    additional_details: this.description,
  };

  this.api.submitan_issue(this.order_id, issueData).subscribe((resp: any) => {
    if (resp) {
      console.log('Issue Reported Successfully');
      this.isIssueReported = false;
      this.issueDescription = '';
      this.hasFiledissue = true;
      this.closeModal();
    } else {
      console.error('Failed to report issue');
    }
  }, error => {
    console.error('Error submitting issue report:', error);
  })
}

getIssueReport(orderId: number): void {
  this.api.get_reports(orderId).subscribe((resp: any) => {
    if (resp && resp.data) {
      this.issueReps = resp.data;  
      console.log('Issue Reports:', this.issueReps);
      this.hasFiledissue = true;
    } else {
      console.log('No issue reports found');
      this.issueReps = []; 
      this.hasFiledissue = false;
    }
  });
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
                ? `${item.product_prod_img}`
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
      if (this.orderStatus.length > 0) {
        this.currentstatus = this.orderStatus[this.orderStatus.length - 1].status;
    }
    console.log("Current order status:", this.currentstatus);
      console.log("Order status length:", this.statusLength);
    }, error => {
      console.error("Error fetching order status", error);
    })
  }

  startPolling(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.getSpecificStatus(this.order_id);
      }, 5000); 
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

  review(){
    this.router.navigate(['/review'], {
      state: { vendor_id: this.vendor_id }
    });
  }


  async retrieveLink(linkId: string): Promise<void> {
    try {
      this.linkData = await this.paymongo.getLinkById(linkId);
      console.log('Link Data:', this.linkData);

      this.paymentStatus = this.linkData.data.attributes.status;
      console.log('Payment Status:', this.paymentStatus);

      if (this.paymentStatus === 'paid') {
        this.paymentSuccess(this.order_id); 
      }  else if (this.paymentStatus === 'unpaid') {
        this.paymentRevert(this.order_id); 
      }

    } catch (error) {
      console.log("Not paid by Paymongo");
    }
  }
}