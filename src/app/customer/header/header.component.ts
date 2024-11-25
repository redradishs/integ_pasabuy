import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
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
