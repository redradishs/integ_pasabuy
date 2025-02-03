import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [HeaderComponent, NgFor, NgIf, RouterLink, FormsModule, NgxSpinnerModule],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css'
})
export class FeedbacksComponent {
  vendors: any[] = [];
  vendorList: any[] = [];
  searchQuery: string = '';

  constructor(private api: ApiService, private auth: AuthService, private spinner: NgxSpinnerService, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Feedbacks - PasaBuy');
    this.getVendors();
    this.isStoreOpen();
  }


  
  isStoreOpen(): boolean {
    const currentTime = new Date().getHours() * 100 + new Date().getMinutes(); 
    
    const storeOpenTime = 900; 
    const storeCloseTime = 1800; 
  
    return currentTime >= storeOpenTime && currentTime <= storeCloseTime;
  }
  

  getVendors(): void {
    this.spinner.show();
    this.api.getVendors().subscribe((resp: any) => {
      if (resp && resp.data) {
        this.vendors = resp.data; // Save original list
        this.vendorList = [...this.vendors]; // Copy it for display
        this.spinner.hide();
      } else {
        console.error("Error fetching vendors");
      }
    });
  }  
  searchStore(): void {
    if (!this.searchQuery.trim()) {
      this.vendorList = [...this.vendors];
      return;
    }

    this.vendorList = this.vendors.filter(vendor =>
      vendor.vendor_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Clear search and reset the list
  clearSearch(): void {
    this.searchQuery = '';
    this.vendorList = [...this.vendors];
  }
}