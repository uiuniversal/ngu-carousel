import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngu-tile',
  templateUrl: 'ngu-tile.component.html',
  styleUrls: ['ngu-tile.component.scss'],
  host: {
    class: 'item'
  }
})
export class NguTileComponent {}
