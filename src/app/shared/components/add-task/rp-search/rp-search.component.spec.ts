import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpSearchComponent } from './rp-search.component';

describe('RpSearchComponent', () => {
  let component: RpSearchComponent;
  let fixture: ComponentFixture<RpSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
