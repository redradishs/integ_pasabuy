import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarstateService {
  private cartDropdownState = new BehaviorSubject<boolean>(false);
  cartDropdownState$ = this.cartDropdownState.asObservable();

  toggleCartDropdown() {
    this.cartDropdownState.next(!this.cartDropdownState.getValue());
  }
}