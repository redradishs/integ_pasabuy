import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';

interface Vendor {
  id: number;
  name: string;
  image: string;
  storeHours: string;
  ratings: number;
  reviewsCount: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  breadcrumbs: Array<{ label: string; link: string; iconViewBox: string }> = [];
  vendors: any[] = [];
  vendorList: any[] = [];
   

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.setupBreadcrumbs();
    this.vendor();

    this.vendors = [
      {
        id: 1,
        name: 'Kusina ni Kalbo',
        image: 'kkb.jpg',
        location: 'East TApinac,Olongapo City',
        description: 'Best Food for Students',
        storeHours: '9:00am-5:00pm',
        ratings: 4.5,
        reviewsCount: 120, 
      },
      {
        id: 2,
        name: 'SugarCafe',
        image: 'sugarcafe.jpeg',
        location: 'East TApinac,Olongapo City',
        description: 'The best Milktea in vicinity.',
        storeHours: '9:00am-5:00pm',
        ratings: 4.2,
        reviewsCount: 120, 
      },
      {
        id: 3,
        name: 'StarBucks',
        image: 'starbucks.jpeg',
        location: 'East TApinac,Olongapo City',
        description: 'Coffee',
        storeHours: '9:00am-5:00pm',
        ratings: 4.8,
        reviewsCount: 455
      },
      {
        id: 4,
        name: 'Dunkin Donut',
        image: 'dunkin.jpg',
        location: 'East TApinac,Olongapo City',
        description: 'Donuts',
        storeHours: '9:00am-5:00pm',
        ratings: 3.5,
        reviewsCount: 1200 
      },
      {
        id: 5,
        name: 'Mister Donut',
        image: 'misterDonut.png',
        location: 'East TApinac,Olongapo City',
        description: 'Donuts',
        storeHours: '9:00am-5:00pm',
        ratings: 4.0,
        reviewsCount: 497 
      },
      {
        id: 6,
        name: 'Krispy Kreme',
        image: 'Krispy.png',
        location: 'East TApinac,Olongapo City',
        description: 'Donuts',
        storeHours: '9:00am-5:00pm',
        ratings: 4.2,
        reviewsCount: 3455 
      },
      {
        id: 7,
        name: 'Kusina ni Kalbo',
        image: 'kkb.jpg',
        location: 'East TApinac,Olongapo City',
        description: 'Best Food for Students',
        storeHours: '9:00am-5:00pm',
        ratings: 4.5,
        reviewsCount: 120, 
      },
      {
        id: 8,
        name: 'SugarCafe',
        image: 'sugarcafe.jpeg',
        location: 'East TApinac,Olongapo City',
        description: 'The best Milktea in vicinity.',
        storeHours: '9:00am-5:00pm',
        ratings: 4.2,
        reviewsCount: 120, 
      },
      {
        id: 9,
        name: 'StarBucks',
        image: 'starbucks.jpeg',
        location: 'East TApinac,Olongapo City',
        description: 'Coffee',
        storeHours: '9:00am-5:00pm',
        ratings: 4.8,
        reviewsCount: 455
      },
      {
        id: 10,
        name: 'Dunkin Donut',
        image: 'dunkin.jpg',
        location: 'East TApinac,Olongapo City',
        description: 'Donuts',
        storeHours: '9:00am-5:00pm',
        ratings: 3.5,
        reviewsCount: 1200 
      },
    ];
  }


  vendor(): void {
    this.api.getVendors().subscribe((resp:any) => {
      if(resp){
        this.vendorList = resp.data;
        console.log(this.vendorList);
      } else {
        console.error("Error fetching")
      }
    })

  }
  
  setupBreadcrumbs(): void {
    this.breadcrumbs = [
      {
        label: 'Home',
        link: '/home',
        iconViewBox: '0 0 20 20',
      },
    ];
  }
}
