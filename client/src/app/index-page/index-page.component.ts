import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css'],
})
export class IndexPageComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
