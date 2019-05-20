import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { ICuePoint, TextToTranslate } from 'src/app/shared/interfaces';
import { TranslatorService } from 'src/app/shared/services/translator.service';
import { AnkiService } from 'src/app/shared/services/anki.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { UserService } from 'src/app/shared/services/user.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-subtitles',
  templateUrl: './subtitles.component.html',
  styleUrls: ['./subtitles.component.css'],
})
export class SubtitlesComponent implements OnInit {
  @Input('api') api: VgAPI;
  @ViewChild('langselector') langselectorref: ElementRef;
  activeCuePoints: ICuePoint[] = [];
  stopedOnSubtitle = false;
  currentTranslation = '';
  stopedOnTranslation = false;
  // TODO: translate from sub lang(get lang from track element)
  textToTranslate: TextToTranslate = {
    // TODO: load from language
    to: this.userService.currentUser.lastlang,
    text: '',
  };

  constructor(
    private translatorService: TranslatorService,
    private ankiService: AnkiService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  onEnterCuePoint(event) {
    this.activeCuePoints.push({
      id: event.id,
      title: event.text,
      description: event.text,
      href: event.text,
      src: event.text,
    });
  }

  onExitCuePoint(event) {
    this.activeCuePoints = this.activeCuePoints.filter(c => c.id !== event.id);
    this.stopedOnTranslation = false;
    this.stopedOnSubtitle = false;
    this.currentTranslation = '';
  }

  showSelectedText() {
    // TODO: show translation box with loader immediately
    this.textToTranslate.text = '';
    this.textToTranslate.to = this.userService.currentUser.lastlang;
    if (window.getSelection) {
      this.textToTranslate.text = window.getSelection().toString();
    } else if (
      document.getSelection() &&
      document.getSelection().type !== 'Control'
    ) {
      this.textToTranslate.text = document.getSelection().toString();
    }

    if (!this.textToTranslate.text) {
      this.textToTranslate.text = this.activeCuePoints[0].title;
    }

    this.translatorService.translate(this.textToTranslate).subscribe(
      translatedText => {
        this.currentTranslation = translatedText.text;

        timer(1).subscribe(val => {
          try {
            this.langselectorref.nativeElement.value = this.userService.currentUser.lastlang;
          } catch (e) {
            console.log(e);
          }
        });
      },
      error => {
        this.currentTranslation = error.error.message;
        console.log(error.error.message);
      }
    );
    this.stopedOnTranslation = true;
  }

  onMouseEnter(event) {
    this.api.pause();
    this.stopedOnSubtitle = true;
  }
  onMouseLeave(event) {
    // if user translated text, player wount start after mouse leave
    if (!this.stopedOnTranslation) {
      this.api.play();
      this.stopedOnSubtitle = false;
      this.currentTranslation = '';
    } else {
      this.stopedOnTranslation = false;
    }
  }

  newVideoSource() {
    this.activeCuePoints = [];
    this.currentTranslation = '';
    this.stopedOnSubtitle = false;
    this.stopedOnTranslation = false;
  }

  saveCard() {
    // TODO: change saving btn color to green(for 1 sec), if success, red if rejected
    // TODO: deck, template, tags selection in user settings
    // TODO: redirect to user page if deck or model error
    // TODO: redirect to tutorial page if anki disconnected
    const test = {
      action: 'addNote',
      version: 6,
      params: {
        note: {
          deckName: this.userService.currentUser.lastDeckName,
          modelName: this.userService.currentUser.lastModelName,
          fields: {
            Front: this.textToTranslate.text,
            Back: this.currentTranslation,
          },
          options: {
            allowDuplicate: false,
          },
          tags: ['testNote'],
        },
      },
    };

    this.ankiService
      .ankiConnectRequest(test.action, test.version, test.params)
      .subscribe(
        res => {
          MaterialService.toast('Card added');
          this.ankiService.cardsChanged();
        },
        error => {
          MaterialService.toast(error);
        }
      );
  }

  onLangChanged(event) {
    this.userService.currentUser.lastlang = this.langselectorref.nativeElement.value;
    this.userService.updateSettings(this.userService.currentUser);
    this.showSelectedText();
  }
}
