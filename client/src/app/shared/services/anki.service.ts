import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnkiService {
  constructor(private http: HttpClient) {}
  cardsChangedEvent: EventEmitter<boolean> = new EventEmitter();

  cardsChanged() {
    this.cardsChangedEvent.next(true);
  }

  // TODO: make online status changed event(auto reload data in components on connected).
  isOnline(): Observable<string> {
    return this.http.get('http://127.0.0.1:8765/', {
      responseType: 'text',
    });
  }

  ankiConnectRequest(action, version, params = {}): Observable<Object> {
    return from(
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () =>
          reject('failed to connect to AnkiConnect')
        );
        xhr.addEventListener('load', () => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.error) {
              throw response.error;
            } else {
              if (response.hasOwnProperty('result')) {
                if (response.result) {
                  if (
                    action !== 'addNote' &&
                    action !== 'sync' &&
                    action !== 'version'
                  ) {
                    // TODO: handle other actions.
                    // saveChanges(action + "Saved", response.result);
                  }

                  resolve(response.result);
                } else {
                  throw response.error;
                }
              } else {
                reject('failed to get results from AnkiConnect');
              }
            }
          } catch (e) {
            reject(e);
          }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        const sendData = JSON.stringify({
          action,
          version,
          params,
        });

        xhr.send(sendData);
        // debugLog(sendData);
      })
    );
  }
}
