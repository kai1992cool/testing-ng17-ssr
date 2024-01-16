import { bootstrapApplication } from '@angular/platform-browser';
import { filter, take } from 'rxjs';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () =>
  bootstrapApplication(AppComponent, config).then((app) => {
    console.log('APP in SERVER');

    app.isStable.subscribe((isStable: boolean) =>
      console.log('SERVER is STABLE', isStable)
    );

    return app;
  });

export default bootstrap;
