import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AnkiService } from './anki.service';
import { UserService } from './user.service';
import { MaterialService } from '../classes/material.service';

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  constructor(
    private http: HttpClient,
    private ankiService: AnkiService,
    private userService: UserService
  ) {}

  getUnknownWords(subtitle: Array<any>) {
    const GetCardIDsByDeck = {
      action: 'findCards',
      version: 6,
      params: {
        query: `deck:${this.userService.currentUser.lastDeckName}`,
      },
    };
    this.ankiService
      .ankiConnectRequest(
        GetCardIDsByDeck.action,
        GetCardIDsByDeck.version,
        GetCardIDsByDeck.params
      )
      .subscribe(
        res => {
          const GetCardInfoByIDs = {
            action: 'cardsInfo',
            version: 6,
            params: {
              cards: <Array<any>>res,
            },
          };

          this.ankiService
            .ankiConnectRequest(
              GetCardInfoByIDs.action,
              GetCardInfoByIDs.version,
              GetCardInfoByIDs.params
            )
            .subscribe(
              res2 => {
                let separatedSubtitleWords = [];
                let separatedAnkiWords = [];

                subtitle.forEach(function(caption) {
                  separatedSubtitleWords = separatedSubtitleWords.concat(
                    caption.text.match(/.*?[\.\s]+?/g)
                  );
                });

                (<Array<any>>res2).forEach(function(ankiCard) {
                  separatedAnkiWords = separatedAnkiWords.concat(
                    // TODO: better regexp for matching words
                    ankiCard.fields.Front.value.split(' ')
                  );
                });

                separatedSubtitleWords = Array.from(
                  new Set(separatedSubtitleWords)
                );
                separatedAnkiWords = Array.from(new Set(separatedAnkiWords));

                const unknownWords = separatedSubtitleWords.filter(
                  el => !separatedAnkiWords.includes(el)
                );
                console.log(unknownWords);
              },
              err => {}
            );
        },
        error => {
          MaterialService.toast(error);
        }
      );
  }
}
