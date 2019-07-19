import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces';
import { MaterialService } from '../classes/material.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    if (!this.currentUser) {
      this.currentUser = this.defaultUser;
    }
  }

  currentUser: User;
  defaultUser: User = {
    email: '',
    password: 'secured',
    lastfromlang: 'en',
    lastlang: 'ru',
    lastDeckName: 'Default',
    lastModelName: 'Basic',
  };

  fetch(user: User): Observable<User> {
    return this.http.get<User>(`/api/user/${user._id}`);
  }

  setUser(user: User) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  updateSettings(user: User): Observable<User> {
    this.currentUser.lastDeckName = user.lastDeckName;
    this.currentUser.lastModelName = user.lastModelName;
    this.currentUser.lastlang = user.lastlang;
    this.currentUser.lastfromlang = user.lastfromlang;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    return this.http.patch<User>(`/api/user/updatesettings/${user._id}`, user);
  }

  refreshUserData() {
    this.fetch(this.currentUser).subscribe(
      res => {
        this.setUser(res);
      },
      error => {
        MaterialService.toast(error.message);
      }
    );
  }
}
