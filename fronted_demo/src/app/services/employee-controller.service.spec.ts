import { TestBed } from '@angular/core/testing';

import { EmployeeControllerService } from './employee-controller.service';

describe('EmployeeControllerService', () => {
  let service: EmployeeControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
