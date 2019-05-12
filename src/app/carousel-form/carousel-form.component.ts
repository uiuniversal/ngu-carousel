import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-carousel-form',
  templateUrl: './carousel-form.component.html',
  styleUrls: ['./carousel-form.component.scss']
})
export class CarouselFormComponent implements OnInit {
  form: FormGroup;
  @Output() toggleTouch = new EventEmitter();

  @Output() toggleInterval = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      grid: this.fb.group({
        size: 5,
        offset: 0,
        type: 'responsive',
        slide: 2
      }),
      touch: false,
      interval: false
    });
    this.form.get('touch').valueChanges.subscribe(e => this.toggleTouch.emit(e));
    this.form.get('interval').valueChanges.subscribe(e => this.toggleInterval.emit(e));
  }

  ngOnInit() {}
}
