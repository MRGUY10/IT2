import { TestBed } from '@angular/core/testing';

import { AccommodationService } from './accommodation-service.service';

describe('AccommodationServiceService', () => {
  let service: AccommodationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccommodationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
