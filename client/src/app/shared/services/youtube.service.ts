import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  constructor(private http: HttpClient) {}

  getDirectLink(ytUrl$: string): Observable<any> {
    return this.http.post<any>('/api/video/getyoutubedirecturl', {
      ytUrl: ytUrl$,
    });
  }
  getPlayList() {}
  getSubtitles() {}
}
