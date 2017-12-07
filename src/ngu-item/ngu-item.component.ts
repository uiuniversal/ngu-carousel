import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngu-item',
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
        display: inline-block;
        white-space: initial;
        vertical-align: top;
    }
  `]
})
export class NguItemComponent {
  @HostBinding('class.item') classes = true;
}
