import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MaterialInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { VgAPI } from 'videogular2/core';
import { ITrack, TextToTranslate } from 'src/app/shared/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';
import { YoutubeService } from 'src/app/shared/services/youtube.service';
import { SubtitleService } from 'src/app/shared/services/subtitle.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AnkiService } from 'src/app/shared/services/anki.service';
import VTTConverter from 'srt-webvtt';
import { TranslatorService } from 'src/app/shared/services/translator.service';
declare const require;
const Subtitle = require('subtitle');
@Component({
  selector: 'app-subtitles-selection-form',
  templateUrl: './subtitles-selection-form.component.html',
  styleUrls: ['./subtitles-selection-form.component.css'],
})
export class SubtitlesSelectionFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;
  @Input('api') api: VgAPI;
  @Output() newSubtitlesSourceEvent = new EventEmitter<ITrack>();
  @ViewChild('subtitlesselect') subtitlesselectref: ElementRef;

  form: FormGroup;
  modal: MaterialInstance;
  youtubeLink: string;
  loadedSubtitles: string[] = [];
  isLoading = false;
  isSubtitleSelected = false;
  unknownWords = undefined;
  subtitleFile: File;

  constructor(
    private sanitizer: DomSanitizer,
    private youtubeService: YoutubeService,
    private subtitleService: SubtitleService,
    private userService: UserService,
    private ankiService: AnkiService,
    private translatorService: TranslatorService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
    MaterialService.updateTextInputs();
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onSubmit() {}

  activateModal() {
    // TODO: add current subtitles to list if opened by lang selector(player ui right bottom btn).
    // TODO: modal looks bad after loadin subs selector.
    if (this.subtitleFile) {
      this.isSubtitleSelected = true;
    }
    this.modal.open();
    MaterialService.updateTextInputs();
    this.unknownWords = undefined;
    this.api.pause();
    if (this.youtubeLink) {
      this.isLoading = true;

      this.youtubeService.getSubtitles(this.youtubeLink).subscribe(
        res => {
          this.loadedSubtitles = res;
          this.isLoading = false;
          setTimeout(() => {
            MaterialService.initializeSelect(this.subtitlesselectref);
            MaterialService.updateTextInputs();
          }, 1);
        },
        error => {
          MaterialService.toast(error);
          this.isLoading = false;
        }
      );
    }
  }

  onModalClose() {
    this.modal.close();
  }

  async onFileSelect(event: any) {
    // TODO: fields for label and srclang.
    // TODO: fix for firefox (chrome says "Resource interpreted as TextTrack but transferred with MIME type text/plain" and works fine).
    this.isSubtitleSelected = true;
    this.unknownWords = undefined;
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    const track: ITrack = {
      kind: 'subtitles',
      label: 'English',
      src: URL.createObjectURL(file),
      srclang: 'en',
    };
    if (file.name.split('.').pop() === 'srt') {
      const vttConverter = new VTTConverter(file);
      vttConverter
        .getURL()
        .then(function(url) {
          // Its a valid url that can be used further
          // Set the converted URL to track's source
          track.src = url;
        })
        .catch(function(err) {
          MaterialService.toast(err);
        });
      this.subtitleFile = await this.createFileFromURL(track.src);
    } else {
      this.subtitleFile = await this.createFileFromURL(
        URL.createObjectURL(file)
      );
    }

    track.src = <string>(
      this.sanitizer.bypassSecurityTrustResourceUrl(track.src)
    );

    this.newSubtitlesSourceEvent.emit(track);
  }

  isURL(str: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return pattern.test(str);
  }

  onInputChanged(event: any) {
    if (this.isURL(event.target.value)) {
      this.unknownWords = undefined;
      this.isSubtitleSelected = true;
      const track: ITrack = {
        kind: 'subtitles',
        label: 'English',
        src: event.target.value,
        srclang: 'en',
      };

      this.api.pause();
      this.newSubtitlesSourceEvent.emit(track);
    }
  }

  async onSubtitlesSelectChange(event) {
    this.isSubtitleSelected = true;
    this.unknownWords = undefined;
    const track: ITrack = {
      kind: 'subtitles',
      label: 'English',
      src: window.location.protocol + '//' + event.target.value,
      srclang: event.target.value.split('.').reverse()[1],
    };
    this.api.pause();
    this.newSubtitlesSourceEvent.emit(track);
    this.subtitleFile = await this.createFileFromURL(track.src);
  }

  onShowUnknownBtnClick() {
    const reader = new FileReader();
    reader.onload = async () => {
      this.unknownWords = await this.subtitleService.getUnknownWords(
        Subtitle.parse(<string>reader.result)
      );
      if (this.unknownWords.length !== 0) {
        this.isSubtitleSelected = false;
      }
    };

    reader.readAsText(this.subtitleFile);
  }

  onSaveUnknownWordsBtnClick() {
    this.isLoading = true;
    let chunkedUnknownWords = this.chuncArray(this.unknownWords, 900);
    let i = 0;
    while (i < chunkedUnknownWords.length) {
      const stringifyedChunk = JSON.stringify(chunkedUnknownWords[i])
        .replace(/,/g, ' || ')
        .replace(/"/g, '')
        .slice(1, -1);
      if (stringifyedChunk.length > 5000) {
        chunkedUnknownWords = chunkedUnknownWords.concat(
          this.chuncArray(chunkedUnknownWords[i], 450)
        );
      } else {
        const processChunc = iter => {
          const notes = [];
          let unknownWordsTranslations = [];
          const textToTranslate: TextToTranslate = {
            from: this.userService.currentUser.lastfromlang,
            to: this.userService.currentUser.lastlang,
            text: stringifyedChunk,
          };
          // TODO: check if anki connected first.
          this.translatorService
            .translate(textToTranslate)
            .pipe(delay(iter * 100))
            .subscribe(
              translatedText => {
                unknownWordsTranslations = translatedText.text
                  .replace(/[ ]/g, '')
                  .split('||');
                if (
                  chunkedUnknownWords[iter].length ===
                  unknownWordsTranslations.length
                ) {
                  chunkedUnknownWords[iter].forEach((unknownWord, index) => {
                    notes.push({
                      deckName: this.userService.currentUser.lastDeckName,
                      modelName: this.userService.currentUser.lastModelName,
                      fields: {
                        Front: unknownWord,
                        Back: unknownWordsTranslations[index],
                      },
                      options: {
                        allowDuplicate: false,
                      },
                      tags: ['testNote'],
                    });
                  });
                  const saveCardRequest = {
                    action: 'addNotes',
                    version: 6,
                    params: {
                      notes: notes,
                    },
                  };

                  this.ankiService
                    .ankiConnectRequest(
                      saveCardRequest.action,
                      saveCardRequest.version,
                      saveCardRequest.params
                    )
                    .subscribe(
                      res => {
                        if (chunkedUnknownWords.length - 1 === iter) {
                          this.unknownWords = undefined;
                          this.isSubtitleSelected = true;
                          this.isLoading = false;
                        }
                        MaterialService.toast(
                          `${chunkedUnknownWords[iter].length} words added`
                        );
                        this.ankiService.cardsChanged();
                      },
                      err2 => {
                        this.isLoading = false;
                        MaterialService.toast(err2);
                      }
                    );
                } else {
                  console.log(chunkedUnknownWords[iter]);
                  console.log(unknownWordsTranslations);
                  console.log(translatedText.text);
                  MaterialService.toast('Error in translations');
                }
              },
              err1 => {
                MaterialService.toast(err1.message);
              }
            );
        };
        // bypass arrow function rest parameters and default parameters limit
        // this timeout for saving i parameter at current state
        // @ts-ignore
        setTimeout(processChunc(i), 0);
      }
      i++;
    }
  }

  // returns file from url
  async createFileFromURL(URL: string): Promise<File> {
    const response = await fetch(URL);
    const data = await response.blob();
    const metadata = {
      type: 'image/jpeg',
    };
    const file = new File([data], 'test.jpg', metadata);
    return file;
  }

  // separates array to chunks
  chuncArray(array: Array<any>, chunkSize): Array<any> {
    array = array.reduce((all, one, i) => {
      const ch = Math.floor(i / chunkSize);
      all[ch] = [].concat(all[ch] || [], one);
      return all;
    }, []);
    return array;
  }
}
