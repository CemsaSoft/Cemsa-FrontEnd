import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCentralComponent } from './registrar-central.component';

describe('RegistrarCentralComponent', () => {
  let component: RegistrarCentralComponent;
  let fixture: ComponentFixture<RegistrarCentralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarCentralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
