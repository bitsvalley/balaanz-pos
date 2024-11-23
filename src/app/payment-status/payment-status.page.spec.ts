import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentStatusPage } from './payment-status.page';

describe('PaymentStatusPage', () => {
  let component: PaymentStatusPage;
  let fixture: ComponentFixture<PaymentStatusPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
