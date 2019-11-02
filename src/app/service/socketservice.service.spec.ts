import { TestBed } from '@angular/core/testing';

import { SocketserviceService } from './socketservice.service';

describe('SocketserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketserviceService = TestBed.get(SocketserviceService);
    expect(service).toBeTruthy();
  });
});
