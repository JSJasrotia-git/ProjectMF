import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Findfundnumber } from './findfundnumber';

describe('Findfundnumber', () => {
  let component: Findfundnumber;
  let fixture: ComponentFixture<Findfundnumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Findfundnumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Findfundnumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
