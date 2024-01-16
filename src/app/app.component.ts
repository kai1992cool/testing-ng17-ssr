import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  styles: [
    `
      .btn {
        display: block;
        margin-top: 40px;
      }
    `,
  ],
  template: `
    <p>
      FOLLOW ONE OF THESE LINKS THEN RELOAD BROWSER PAGE AS IF NAVIGATIG
      DIRECTLY TO THE LINK
    </p>
    <p>
      App doesn't become stable and hydration doesn't happen, except after
      around 120secs
    </p>
    <div>
      <p style="color: blue; font-weight: bold;">
        APP is STABLE: {{ isStable$ | async }}
      </p>
    </div>

    <a class="btn" routerLink="test-1"
      >1) AF - COLLECTION DATA AFTER NEXT RENDER- HANGS CLIENT</a
    >

    <a class="btn" routerLink="test-2"
      >2) AF - COLLECTION DATA - HANGS CLIENT</a
    >

    <a class="btn" routerLink="test-3">3) AF - GET DOCS - WORKS</a>

    <a class="btn" routerLink="test-4"
      >4) AF - FIRST VALUE FROM COLLECTION DATA - HANGS CLIENT</a
    >
    <br />
    <hr />
    <br />
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  appRef = inject(ApplicationRef);
  cd = inject(ChangeDetectorRef);

  isStable$: Observable<boolean> = this.appRef.isStable.pipe(
    tap((v) => console.log('APP is STABLE: ', v)),
    tap(() => setTimeout(() => this.cd.detectChanges(), 0))
  );
}
