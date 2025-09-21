import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comparefunds } from './comparefunds';

describe('Comparefunds', () => {
  let component: Comparefunds;
  let fixture: ComponentFixture<Comparefunds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comparefunds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comparefunds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
