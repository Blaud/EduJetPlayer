import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TextToTranslate } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  constructor(private http: HttpClient) {}

  translate(texttotranslate: TextToTranslate): Observable<TextToTranslate> {
    return this.http.post<TextToTranslate>('/api/translate', texttotranslate);
  }
}
