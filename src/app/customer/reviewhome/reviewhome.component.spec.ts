import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewhomeComponent } from './reviewhome.component';

describe('ReviewhomeComponent', () => {
  let component: ReviewhomeComponent;
  let fixture: ComponentFixture<ReviewhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewhomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
