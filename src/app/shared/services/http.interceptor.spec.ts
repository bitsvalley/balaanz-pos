import { TestBed } from '@angular/core/testing';

import { HttpInterceptorClass } from './http.interceptor';

describe('HttpInterceptorClass', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpInterceptorClass
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpInterceptorClass = TestBed.inject(HttpInterceptorClass);
    expect(interceptor).toBeTruthy();
  });
});
