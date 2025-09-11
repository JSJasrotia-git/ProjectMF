import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Midleft } from './midleft';

describe('Midleft', () => {
  let component: Midleft;
  let fixture: ComponentFixture<Midleft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Midleft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Midleft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
