import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';


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
  imports: [CommonModule,
            HeaderComponent,
            RouterModule, 
            BreadcrumbComponent,
            NgxSpinnerModule
          ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vendors: any[] = [];
  vendorList: any[] = [];
   

  constructor(private api: ApiService, private spinner: NgxSpinnerService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Home - PasaBuy');
    this.vendor();
    this.isStoreOpen();

   
  }

  isStoreOpen(): boolean {
    const currentTime = new Date().getHours() * 100 + new Date().getMinutes(); 
    
    const storeOpenTime = 700; 
    const storeCloseTime = 1800; 
  
    return currentTime >= storeOpenTime && currentTime <= storeCloseTime;
  }
  

  vendor(): void {
    this.spinner.show();
    this.api.getVendors().subscribe((resp:any) => {
      if(resp){
        this.vendorList = resp.data;
        console.log(this.vendorList);
        this.spinner.hide();
      } else {
        console.error("Error fetching")
        this.spinner.hide();
      }
    })

  }  
}
