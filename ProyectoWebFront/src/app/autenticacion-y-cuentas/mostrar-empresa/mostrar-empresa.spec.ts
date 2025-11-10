import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarEmpresa } from './mostrar-empresa';

describe('MostrarEmpresa', () => {
  let component: MostrarEmpresa;
  let fixture: ComponentFixture<MostrarEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
