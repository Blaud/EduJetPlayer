import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { AnkiService } from '../../services/anki.service';

@Component({
  selector: 'app-anki-status',
  templateUrl: './anki-status.component.html',
  styleUrls: ['./anki-status.component.css'],
})
export class AnkiStatusComponent implements OnInit, AfterViewChecked {
  constructor(
    private ankiService: AnkiService,
    private cdRef: ChangeDetectorRef
  ) {}

  isConnected = false;

  ngOnInit() {
    this.ankiService.isOnline().subscribe(
      res => {
        this.isConnected = true;
      },
      error => {
        this.isConnected = false;
      }
    );

    const test = {
      'action': 'addNote',
      'version': 6,
      'params': {
          'note': {
              'deckName': 'English',
              'modelName': 'Basic',
              'fields': {
                  'Front': 'front content',
                  'Back': 'back content'
              },
              'options': {
                  'allowDuplicate': false
              },
              'tags': [
                  'yomichan'
              ],
              'audio': {
                  'url': 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=猫&kana=ねこ',
                  'filename': 'yomichan_ねこ_猫.mp3',
                  'skipHash': '7e2c2f954ef6051373ba916f000168dc',
                  'fields': [
                      'Front'
                  ]
              }
          }
      }
  };

  this.ankiService.ankiConnectRequest(test.action, test.version, test.params).subscribe(
    res => {
      console.log(res);
    },
    error => {
      console.log(error);
    }
  );

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
