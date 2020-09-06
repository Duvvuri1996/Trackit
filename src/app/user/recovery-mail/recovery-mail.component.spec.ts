import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryMailComponent } from './recovery-mail.component';

describe('RecoveryMailComponent', () => {
  let component: RecoveryMailComponent;
  let fixture: ComponentFixture<RecoveryMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
