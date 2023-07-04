import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngu-item',
  templateUrl: 'ngu-item.component.html',
  standalone: true
})
export class NguItemComponent {
  @HostBinding('class.item') classes = true;
}
