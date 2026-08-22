import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture:   ComponentFixture<NotFoundComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Creation ───────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── goHome ─────────────────────────────────────────────────

  describe('goHomeTest', () => {
    it('should navigate to /admin when role is ROLE_ADMIN', () => {
      localStorage.setItem('RoleUserConnect', 'ROLE_ADMIN');
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/admin');
    });

    it('should navigate to /coach when role is ROLE_COACH', () => {
      localStorage.setItem('RoleUserConnect', 'ROLE_COACH');
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/coach');
    });

    it('should navigate to /client when role is ROLE_PLAYER', () => {
      localStorage.setItem('RoleUserConnect', 'ROLE_PLAYER');
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/client');
    });

    it('should navigate to /login when role is null', () => {
      localStorage.removeItem('RoleUserConnect');
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should navigate to /login when role is unknown', () => {
      localStorage.setItem('RoleUserConnect', 'ROLE_UNKNOWN');
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should navigate to /login when localStorage is empty', () => {
      localStorage.clear();
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should call navigateByUrl exactly once per goHome call', () => {
      localStorage.setItem('RoleUserConnect', 'ROLE_ADMIN');
      component.goHome();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
    });
  });
});