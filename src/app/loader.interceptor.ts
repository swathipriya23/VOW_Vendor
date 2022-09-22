import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import {DataService} from './service/data.service'

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public dataService: DataService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.dataService.show();
        return next.handle(req).pipe(
            finalize(() => this.dataService.hide())
        );
    }
}






















