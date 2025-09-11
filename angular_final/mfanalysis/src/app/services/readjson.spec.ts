import { TestBed } from '@angular/core/testing';

import { Readjson } from './readjson';

describe('Readjson', () => {
  let service: Readjson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Readjson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
