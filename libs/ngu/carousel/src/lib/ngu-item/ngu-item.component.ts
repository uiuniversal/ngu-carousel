import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngu-item',
  templateUrl: 'ngu-item.component.html',
  host: {
    class: 'item'
  }
})
export class NguItemComponent {}
