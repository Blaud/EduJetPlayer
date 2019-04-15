import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnkiService {
  constructor(private http: HttpClient) {}

  isOnline(): Observable<string> {
    return this.http.get('http://127.0.0.1:8765/', {
      responseType: 'text',
    });
  }
}
