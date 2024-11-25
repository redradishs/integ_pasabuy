import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', function () {
      const cartButton = document.getElementById('myCartDropdownButton1');
      if (cartButton) {
        cartButton.click();
      }
    });
  }
}
