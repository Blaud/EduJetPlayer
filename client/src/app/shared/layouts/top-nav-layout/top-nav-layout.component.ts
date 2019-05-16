import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MaterialService } from '../../classes/material.service';
import { DynamicLocaleService } from '../../services/dynamic-locale.service';

@Component({
  selector: 'app-top-nav-layout',
  templateUrl: './top-nav-layout.component.html',
  styleUrls: ['./top-nav-layout.component.css'],
})
export class TopNavLayoutComponent implements OnInit {
  @ViewChild('LocaleSelect') LocaleSelectref: ElementRef;
  constructor(
    private authService: AuthService,
    private dynamicLocaleService: DynamicLocaleService
  ) {}

  isAuthenticated = false;

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.LocaleSelectref.nativeElement.value = localStorage.getItem('locale');
    MaterialService.initializeSelect(this.LocaleSelectref);
    MaterialService.updateTextInputs();
  }

  onLocaleChanged(event) {
    this.dynamicLocaleService.setLocale(event.target.value);
  }
}
