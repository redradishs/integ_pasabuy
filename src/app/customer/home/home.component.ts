import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { ApiService } from '../../service/api.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';


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
            BreadcrumbComponent
          ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vendors: any[] = [];
  vendorList: any[] = [];
   

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.vendor();

   
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
}
