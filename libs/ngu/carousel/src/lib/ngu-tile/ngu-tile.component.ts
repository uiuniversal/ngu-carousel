import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngu-tile',
  templateUrl: 'ngu-tile.component.html',
  styleUrls: ['ngu-tile.component.scss'],
  standalone: true
})
export class NguTileComponent {
  @HostBinding('class.item') classes = true;
}
