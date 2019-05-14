import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-top-nav-layout',
  templateUrl: './top-nav-layout.component.html',
  styleUrls: ['./top-nav-layout.component.css'],
})
export class TopNavLayoutComponent implements OnInit {
  constructor(private authService: AuthService) {}

  isAuthenticated = false;

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
