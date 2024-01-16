import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CollectionReference,
  Firestore,
  QueryConstraint,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  concatMap,
  distinctUntilChanged,
  scan,
  startWith,
  take,
  takeWhile,
  tap,
  throttleTime,
} from 'rxjs';

@Component({
  selector: 'app-test-1',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div>TEST 1</div>

    <ng-container *ngIf="todos$ | async as todos">
      Loaded todos: {{ todos.length }}
      <button (click)="loadMore(todos)">LOAD MORE</button>
      <div *ngIf="noMoreAvailable">NO MORE AVAILABLE</div>
    </ng-container>
  `,
})
export default class Test1Component {
  destroyRef = inject(DestroyRef);
  scbWebFbFs = inject(Firestore);

  noMoreAvailable = false;
  reachedLastInViewSbj = new Subject<any>();
  todos$: Observable<any[]> | undefined;

  constructor() {
    afterNextRender(() => {
      this.todos$ = this.reachedLastInViewSbj.pipe(
        takeWhile(() => !this.noMoreAvailable),
        throttleTime(500),
        distinctUntilChanged((a, b) => a?.id === b?.id),
        startWith(null),
        concatMap((offsetItem) => this.getTodosColletionData(offsetItem, 10)),
        tap((acts) => (this.noMoreAvailable = acts.length === 0)),
        scan((acc, batch) => [...acc, ...batch], [] as any[]),
        takeUntilDestroyed(this.destroyRef)
      );
    });
  }

  getTodosColletionData(
    startAfterTodo: any | null | undefined,
    batchSize: number
  ) {
    const ref = collection(
      this.scbWebFbFs,
      `todos`
    ) as CollectionReference<any>;
    const qc: QueryConstraint[] = [orderBy('id', 'desc'), limit(batchSize)];
    if (startAfterTodo) {
      qc.push(startAfter(startAfterTodo.id));
    }

    return collectionData(query(ref, ...qc)).pipe(take(1));
  }

  loadMore(todos: any[] | null) {
    const lastInView = todos?.slice(-1)[0];
    if (!lastInView) return;
    this.reachedLastInViewSbj.next(lastInView);
  }
}
