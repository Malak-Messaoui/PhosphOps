import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilClientComponent } from './profil-client.component';

describe('ProfilClientComponent', () => {
  let component: ProfilClientComponent;
  let fixture: ComponentFixture<ProfilClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
