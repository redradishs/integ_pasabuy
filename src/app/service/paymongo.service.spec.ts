import { TestBed } from '@angular/core/testing';

import { PaymongoService } from './paymongo.service';

describe('PaymongoService', () => {
  let service: PaymongoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymongoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
