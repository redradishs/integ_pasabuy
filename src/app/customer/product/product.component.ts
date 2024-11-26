import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

interface Product {
  id: number;
  vendor_id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  ratings: number;
  reviewsCount: number;
}
interface Vendor {
  id: number;
  name: string;
  image: string;
  storeHours: string;
  ratings: number;
  reviewsCount: number;
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
  vendors: Vendor | null = null;


  // Static product list
  allProducts: Product[] = [
    {
      id: 1,
      vendor_id: 1,
      name: 'Mister Donut',
      price: 999,
      image: 'misterDonut.png',
      description: 'Latest',
      category: 'Food',
      ratings: 4.8,
      reviewsCount: 125
    },
    {
      id: 2,
      vendor_id: 1,
      name: 'Pizza',
      price: 899,
      image: 'pizza.jpg',
      description: 'Flagship Pizza.',
      category: 'Food',
      ratings: 4.7,
      reviewsCount: 125
    },
    {
      id: 3,
      vendor_id: 1,
      name: 'Ang De',
      price: 399,
      image: 'AngDe.jpg',
      description: 'Noise-cancelling Drinks with superior water quality.',
      category: 'Food',
      ratings: 4.9,
      reviewsCount: 125
    },
    {
      id: 4,
      vendor_id: 1,
      name: 'Classic Burger',
      price: 1499,
      image: 'ClassicBurger.jpg',
      description: 'High-performance Burger for professionals.',
      category: 'Food',
      ratings: 4.6,
      reviewsCount: 125
    },
    {
      id: 5,
      vendor_id: 1,
      name: 'Sushi',
      price: 399,
      image: 'sushi.jpeg',
      description: 'Sushi love',
      category: 'Food',
      ratings: 4.5,
      reviewsCount: 125
    }
  ];
  
  allVendors: Vendor[] = [
    {
      id: 1,
      name: 'Kusina ni Kalbo',
      image: 'kkb.jpg',
      storeHours: '9:00am-5:00pm',
      ratings: 4.5,
      reviewsCount: 120
    },
    {
      id: 2,
      name: 'SugarCafe',
      image: 'sugarcafe.jpeg',
      storeHours: '9:00am-5:00pm',
      ratings: 4.2,
      reviewsCount: 120
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.setupBreadcrumbs();

    // Capture the vendorId from the route
    this.vendorId = Number(this.route.snapshot.paramMap.get('vendorId'));

    // Load products based on vendorId
    this.loadProductsForVendor(this.vendorId);

    this.loadVendorDetails(this.vendorId);
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

  loadProductsForVendor(vendorId: number | null): void {
    if (vendorId !== null) {
      // Filter the static list of products based on vendorId
      this.products = this.allProducts.filter(product => product.vendor_id === vendorId);
    }
  }

  loadVendorDetails(vendorId: number | null): void {
    if (vendorId !== null) {
      this.vendors = this.allVendors.find(vendor => vendor.id === vendorId) || null;
    }
}
}
