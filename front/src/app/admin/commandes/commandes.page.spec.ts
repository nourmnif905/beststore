import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandesPage } from './commandes.page';

describe('CommandesPage', () => {
  let component: CommandesPage;
  let fixture: ComponentFixture<CommandesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
