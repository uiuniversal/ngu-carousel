import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainNavComponent } from './main-nav/main-nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MainNavComponent]
})
export class AppComponent {}
