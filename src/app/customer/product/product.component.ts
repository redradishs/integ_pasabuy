import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';

interface Product {
  product_id: number;
  vendor_id: number;
  product_name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviewsCount: number;
  quantity: number;
}
interface Vendor {
  id: number;
  name: string;
  image: string;
  storeHours: string;
  ratings: number;
  reviewsCount: number;
}


interface VendorProfile {
  vendor_id: number;
  vendor_name: string;
  image?: string;
  location: string;
  operating_hours: string;
  rating: number;
  description: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  breadcrumbs: Array<{ label: string; link: string; iconViewBox: string }> = [];
  products: Product[] = [];
  vendorId: number | null = null;


  vendorProfile: VendorProfile | null = null;
  constructor(private route: ActivatedRoute, private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.setupBreadcrumbs();
    this.vendorId = Number(this.route.snapshot.paramMap.get('vendorId'));
    this.viewVendorProfile(this.vendorId)
    this.viewproducts(this.vendorId);
  }

  setupBreadcrumbs(): void {
    this.breadcrumbs = [
      {
        label: 'Home',
        link: '/home',
        iconViewBox: '0 0 20 20',
      },
      {
        label: 'Product',
        link: '/product',
        iconViewBox: ''
      }
    ];
  }


  viewVendorProfile(vendorId: number): void {
    this.api.getVendorProfile(vendorId).subscribe((resp: any) => {
      if (resp){
        this.vendorProfile = resp.data;
        console.log(this.vendorProfile);
      } else {
        console.error("Error no vendor")
      }
    })
  }

  viewproducts(vendorId: number): void {
    this.api.getVendorProducts(vendorId).subscribe((resp: any) => {
      if(resp){
        this.products = resp.data;
        console.log(this.products);
      } else {
        console.error("Error no products")
      }
    })
  }





}
