import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import {
  CollectionReference,
  Firestore,
  QueryConstraint,
  collection,
  collectionData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  Subject,
  concatMap,
  from,
  map,
  of,
  scan,
  startWith,
  take,
  takeWhile,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-test-3',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div>TEST 3</div>
    <ng-container *ngIf="todos$ | async as todos">
      Loaded todos: {{ todos.length }}
      <button (click)="loadMore(todos)">LOAD MORE</button>
      <div *ngIf="noMoreAvailable">NO MORE AVAILABLE</div>
    </ng-container>
  `,
})
export default class Test3Component {
  destroyRef = inject(DestroyRef);
  scbWebFbFs = inject(Firestore);

  noMoreAvailable = false;
  reachedLastInViewSbj = new Subject<any>();
  todos$: Observable<any[]> = this.reachedLastInViewSbj.pipe(
    startWith(null),
    concatMap((offsetTodo) =>
      this.getTodosGetDocs(offsetTodo, 10).pipe(
        tap((todos) => (this.noMoreAvailable = todos.length === 0))
      )
    ),
    scan((acc, batch) => [...acc, ...batch], [] as any[]),
    takeWhile(() => !this.noMoreAvailable),
    takeUntilDestroyed(this.destroyRef)
  );

  getTodosGetDocs(startAfterTodo: any | null | undefined, batchSize: number) {
    const ref = collection(this.scbWebFbFs, `todos`);
    const qc: QueryConstraint[] = [orderBy('id', 'desc'), limit(batchSize)];
    if (startAfterTodo) {
      qc.push(startAfter(startAfterTodo.id));
    }

    return from(getDocs(query(ref, ...qc))).pipe(
      map((v) => {
        return v.docs.map((s) => s.data());
      }),
      take(1)
    );
  }

  loadMore(todos: any[] | null) {
    const lastInView = todos?.slice(-1)[0];
    if (!lastInView) return;
    this.reachedLastInViewSbj.next(lastInView);
  }
}
