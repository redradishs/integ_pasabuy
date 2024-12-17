import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-reviewhome',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './reviewhome.component.html',
  styleUrl: './reviewhome.component.css'
})
export class ReviewhomeComponent {stars: number[] = [1, 2, 3, 4, 5]; 
  rating: number = 0; 
  comment: string = ''; 
  userid: number = 0;
  vendor_id: any;
  reviews: any[] = [];
  name: string = '';
  reviewed: boolean = false;
  vendor_name: string = '';
  vendor_img: string = '';

  averageRating: number = 0;
  ratingDistribution: { [key: number]: number } = {}; 
  totalRatings: number = 0;
  prodReviews: any;

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.userid = user.id;
        this.profile(this.userid);
      } else {
        console.log("User not found");
      }
    });

    this.vendor_id = this.route.snapshot.paramMap.get('id');
    console.log('Vendor ID:', this.vendor_id);
    this.getVendorData(this.vendor_id);


    this.getRatings(this.vendor_id); 
    this.viewVendorProfile(this.vendor_id);
    
  }

  setRating(star: number) {
    this.rating = star;
  }

  submitReview() {
    const data = {
      vendor_id: this.vendor_id,
      rating: this.rating,
      comment: this.comment
    }
    this.api.addreview(this.userid, data).subscribe(
      (resp: any) => {
        if (resp) {
          console.log("Review submitted successfully");
          this.getVendorData(this.vendor_id);
          this.reviewed = true;
          this.comment = '';
        }
      },
      (error) => {
        console.error("Error submitting review", error);
        alert('There was an error submitting your review. Please try again.');
      }
    );
  }

  profile(id: number){
    this.api.getProfile(this.userid).subscribe((resp: any) => {
      if(resp) {
        console.log(resp.data[0]);
        this.name = resp.data[0].name;
      } else {
        console.log('No user details found');
      }
    })

  }

  home(){
    this.router.navigate(['/home']);
  }


  viewVendorProfile(vendorId: number): void {
    this.api.getVendorProfile(vendorId).subscribe((resp: any) => {
      if (resp){
        this.vendor_img = resp.data.vendor_profile_image;
        this.vendor_name = resp.data.vendor_name;
        console.log(resp.data);
      } else {
        console.error("Error no vendor")
      }
    })
  }


  getVendorData(vendor_id: number): void {
    let vendorReviews: any[] = [];
    let productReviews: any[] = [];
  
    this.api.getreview(vendor_id).subscribe(
      (resp: any) => {
        if (resp && resp.data) {
          vendorReviews = resp.data;
          this.mergeAndSortReviews(vendorReviews, productReviews);
        } else {
          console.error("Error fetching vendor reviews");
        }
      },
      (error) => console.error("Error during vendor reviews API call", error)
    );
  
    this.api.getVendorReviewProd(vendor_id).subscribe(
      (resp: any) => {
        if (resp && resp.data) {
          productReviews = resp.data;
          this.mergeAndSortReviews(vendorReviews, productReviews);
        } else {
          console.error("Error fetching product reviews");
        }
      },
      (error) => console.error("Error during product reviews API call", error)
    );
  }
  
  mergeAndSortReviews(vendorReviews: any[], productReviews: any[]): void {
    const combinedReviews = [...vendorReviews, ...productReviews];
  
    combinedReviews.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; 
    });
  
    this.reviews = combinedReviews;
    console.log("Combined and Sorted Reviews:", this.reviews);
  }
  




  getRatings(vendorId: number): void {
    this.api.getreview(vendorId).subscribe((resp: any) => {
      if (resp && resp.data) {
        this.calculateAverageRating(resp.data);
      } else {
        console.error('No rating data found');
      }
    }, error => {
      console.error('Error fetching ratings:', error);
    });
  }
  calculateAverageRating(reviews: any[]): void {
    const total = reviews.length;
    let sum = 0;

    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
        sum += review.rating; 
        this.ratingDistribution[review.rating] = (this.ratingDistribution[review.rating] || 0) + 1; 
    });

    this.averageRating = total > 0 ? (sum / total) : 0; 
    this.totalRatings = total; 
}

}