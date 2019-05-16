import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicLocaleService } from '../shared/services/dynamic-locale.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css'],
  providers: [DatePipe],
})
export class IndexPageComponent implements OnInit, OnDestroy {
  constructor(private dynamicLocaleService: DynamicLocaleService) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
