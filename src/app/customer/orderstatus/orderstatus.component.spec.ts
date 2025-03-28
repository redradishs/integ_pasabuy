import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderstatusComponent } from './orderstatus.component';

describe('OrderstatusComponent', () => {
  let component: OrderstatusComponent;
  let fixture: ComponentFixture<OrderstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
