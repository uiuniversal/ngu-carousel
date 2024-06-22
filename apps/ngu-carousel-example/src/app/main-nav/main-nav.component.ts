import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  standalone: true,
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatToolbar,
    MatNavList,
    MatListItem,
    RouterLink,
    MatSidenavContent,
    MatIconButton,
    MatIcon,
    MatAnchor,
    RouterOutlet,
    AsyncPipe
  ]
})
export class MainNavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
