import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { AnkiService } from '../../services/anki.service';

@Component({
  selector: 'app-anki-status',
  templateUrl: './anki-status.component.html',
  styleUrls: ['./anki-status.component.css']
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
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
