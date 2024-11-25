import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { BannerComponent } from "../banner/banner.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,
            HeaderComponent,
            RouterModule, 
            BannerComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  breadcrumbs: Array<{ label: string; link: string; iconViewBox: string }> = [];

  constructor() {} 

  ngOnInit(): void {

    this.setupBreadcrumbs();
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
      ]
    };
  }