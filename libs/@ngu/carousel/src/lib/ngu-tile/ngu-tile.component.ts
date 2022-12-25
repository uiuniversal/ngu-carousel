import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngu-tile',
  templateUrl: 'ngu-tile.component.html',
  styleUrls: ['ngu-tile.component.scss']
})
export class NguTileComponent {
  @HostBinding('class.item') classes = true;
}
