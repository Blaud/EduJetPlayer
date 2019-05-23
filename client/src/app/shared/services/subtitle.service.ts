import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  async getUnknownWords(subtitle: Array<any>): Promise<Array<string[]>> {
    // this is good example how to make a lot of convolutional subscribe and return it as a promice (last subsctibe should resolve it)
    return new Promise<Array<string[]>>(resolve => {
      const GetCardIDsByDeck = {
        action: 'findCards',
        version: 6,
        params: {
          query: `deck:${this.userService.currentUser.lastDeckName}`,
        },
      };
      let unknownWords;

      // load cards ids
      this.ankiService
        .ankiConnectRequest(
          GetCardIDsByDeck.action,
          GetCardIDsByDeck.version,
          GetCardIDsByDeck.params
        )
        .subscribe(
          async res => {
            const GetCardInfoByIDs = {
              action: 'cardsInfo',
              version: 6,
              params: {
                cards: <Array<any>>res,
              },
            };
            // load card infos
            await this.ankiService
              .ankiConnectRequest(
                GetCardInfoByIDs.action,
                GetCardInfoByIDs.version,
                GetCardInfoByIDs.params
              )
              .subscribe(
                async res2 => {
                  let separatedSubtitleWords = [];
                  let separatedAnkiWords = [];

                  // get separated subtitle words
                  subtitle.forEach(function(caption) {
                    separatedSubtitleWords = separatedSubtitleWords.concat(
                      caption.text
                        .toLowerCase()
                        .replace(/"/g, ' ')
                        .match(/.[^\W\d](\w|[-']{1,2}(?=\w))*/g)
                    );
                  });

                  // get separated anki words
                  (<Array<any>>res2).forEach(function(ankiCard) {
                    // TODO: detect if word learned or not(anki card property).
                    separatedAnkiWords = separatedAnkiWords.concat(
                      // TODO: better card template parse.
                      ankiCard.fields.Front.value
                        .replace(/<br>/g, '')
                        .toLowerCase()
                        .match(/.[^\W\d](\w|[-']{1,2}(?=\w))*/g)
                    );
                  });

                  // delete spaces in separatedSubtitleWords
                  separatedSubtitleWords = separatedSubtitleWords.map(el =>
                    el.trim()
                  );

                  // delete same words in separatedSubtitleWords
                  separatedSubtitleWords = Array.from(
                    new Set(separatedSubtitleWords)
                  );
                  // delete same words in separatedAnkiWords
                  separatedAnkiWords = Array.from(new Set(separatedAnkiWords));

                  try {
                    // delete spaces in separatedAnkiWords
                    separatedAnkiWords = separatedAnkiWords.map(el =>
                      el.trim()
                    );
                  } catch (e) {
                    console.log(e);
                    resolve([]);
                  }

                  unknownWords = separatedSubtitleWords.filter(
                    el => !separatedAnkiWords.includes(el)
                  );
                  resolve(unknownWords);
                },
                err => {
                  MaterialService.toast(err);
                  resolve([]);
                }
              );
          },
          error => {
            MaterialService.toast(error);
            resolve([]);
          }
        );
    });
  }
}
