import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticComponent } from './diagnostic.component';

describe('DiagnosticComponent', () => {
  let component: DiagnosticComponent;
  let fixture: ComponentFixture<DiagnosticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
