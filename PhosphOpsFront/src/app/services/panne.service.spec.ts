import { TestBed } from '@angular/core/testing';

import { PanneService } from './panne.service';

describe('PanneService', () => {
  let service: PanneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
