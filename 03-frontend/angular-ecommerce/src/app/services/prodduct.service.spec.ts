import { TestBed } from '@angular/core/testing';

import { ProdductService } from './prodduct.service';

describe('ProdductService', () => {
  let service: ProdductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
