import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  
  ngOnInit(): void {
    initFlowbite();
  }

}
