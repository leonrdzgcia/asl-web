import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaDieselComponent } from './carga-diesel.component';

describe('CargaDieselComponent', () => {
  let component: CargaDieselComponent;
  let fixture: ComponentFixture<CargaDieselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaDieselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaDieselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
