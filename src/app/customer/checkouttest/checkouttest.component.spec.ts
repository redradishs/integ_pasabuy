import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckouttestComponent } from './checkouttest.component';

describe('CheckouttestComponent', () => {
  let component: CheckouttestComponent;
  let fixture: ComponentFixture<CheckouttestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckouttestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckouttestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
