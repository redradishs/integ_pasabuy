import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviewpage',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './reviewpage.component.html',
  styleUrl: './reviewpage.component.css'
})
export class ReviewpageComponent {
 stars: number[] = [1, 2, 3, 4, 5]; 
  rating: number = 0; 
  comment: string = ''; 
  userid: number = 0;
  vendor_id: number = 0;
  reviews: any[] = [];
  name: string = '';
  reviewed: boolean = false;
  vendor_name: string = '';
  vendor_img: string = '';

  averageRating: number = 0;
  ratingDistribution: { [key: number]: number } = {}; 
  totalRatings: number = 0;

  constructor(private api: ApiService, private auth: AuthService, private router: Router){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.vendor_id = navigation.extras.state['vendor_id'];
      console.log(this.vendor_id)
    }
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

    this.getreview(this.vendor_id);
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
          this.getreview(this.vendor_id);
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


  getreview(vendor_id: number){
    this.api.getreview(this.vendor_id).subscribe((resp: any) => {
      try {
        this.reviews = resp.data;
        console.log("review res", this.reviews);
      } catch (error) {
        console.error("Error fetching review data", error);
      }
    })
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