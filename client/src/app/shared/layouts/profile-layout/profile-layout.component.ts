import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.css'],
})
export class ProfileLayoutComponent implements AfterViewInit {
  @ViewChild('floating') floatingRef: ElementRef;

  links = [
    { url: '/profile/overview', name: 'Обзор' },
    { url: '/profile/analytics', name: 'Аналитика' },
    { url: '/profile/history', name: 'История' },
    { url: '/profile/order', name: 'Добавить заказ' },
    { url: '/profile/categories', name: 'Ассортимент' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['auth/login']);
  }
}
