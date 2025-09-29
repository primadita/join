import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactLabelComponent } from './contact-label.component';

describe('ContactLabelComponent', () => {
  let component: ContactLabelComponent;
  let fixture: ComponentFixture<ContactLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
