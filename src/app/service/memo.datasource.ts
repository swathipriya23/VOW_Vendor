import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {MEMOLIST} from "../model/memointerface";
import {MemoService} from "./memo.service";
import {catchError, finalize} from "rxjs/operators";

export class MemoDataSource implements DataSource<MEMOLIST> {

    public MemoSubject = new BehaviorSubject<MEMOLIST[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private memoService: MemoService) {
    }

    loadMemoList(filter:string,
                sortDirection:string,
                pageIndex:number,
                pageSize:number) {

        this.loadingSubject.next(true);

        this.memoService.findMemoList( filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => this.MemoSubject.next(lessons));
        
    }

    
    connect(collectionViewer: CollectionViewer): Observable<MEMOLIST[]> {
        // console.log("Connecting data source");
        return this.MemoSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.MemoSubject.complete();
        this.loadingSubject.complete();
    }

}