import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { map } from 'rxjs';

@Component({
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
    RouterOutlet
  ]
})
export class MainNavComponent {
  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches))
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
