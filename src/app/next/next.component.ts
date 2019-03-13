import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-next',
  templateUrl: './next.component.html',
  styleUrls: ['./next.component.scss']
})
export class NextComponent implements OnInit {
  items = of(
    Array(15)
      .fill('')
      .map((_, i) => i + 1)
  );

  constructor() {}

  ngOnInit() {}
}
