import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
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
} from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import {
  Observable,
  Subject,
  concatMap,
  firstValueFrom,
  from,
  scan,
  startWith,
  take,
  takeWhile,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-test-4',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div>TEST 4</div>
    <ng-container *ngIf="todos$ | async as todos">
      Loaded todos: {{ todos.length }}
      <button (click)="loadMore(todos)">LOAD MORE</button>
      <div *ngIf="noMoreAvailable">NO MORE AVAILABLE</div>
    </ng-container>
  `,
})
export default class Test4Component {
  destroyRef = inject(DestroyRef);
  scbWebFbFs = inject(Firestore);

  noMoreAvailable = false;
  reachedLastInViewSbj = new Subject<any>();
  todos$: Observable<any[]> = this.reachedLastInViewSbj.pipe(
    startWith(null),
    concatMap((offsetTodo) =>
      from(this.getTodosColletionData(offsetTodo, 10)).pipe(
        tap((todos) => (this.noMoreAvailable = todos.length === 0))
      )
    ),
    scan((acc, batch) => [...acc, ...batch], [] as any[]),
    takeWhile(() => !this.noMoreAvailable),
    takeUntilDestroyed(this.destroyRef)
  );

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

    return collectionData(query(ref, ...qc));
  }

  loadMore(todos: any[] | null) {
    const lastInView = todos?.slice(-1)[0];
    if (!lastInView) return;
    this.reachedLastInViewSbj.next(lastInView);
  }
}
