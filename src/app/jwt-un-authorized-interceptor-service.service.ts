import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from './service/data.service';
import { SharedService } from './service/shared.service';


@Injectable({
  providedIn: 'root'
})
export class JwtUnAuthorizedInterceptorServiceService implements HttpInterceptor {

  constructor(private router: Router, public sharedService: SharedService) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(

      (event: HttpEvent<any>) =>
      {
        if (event instanceof HttpResponse)
        {
          //do something with response
        }
      },

      (error: any) =>
      {
        if (error instanceof HttpErrorResponse)
        {
          // console.log('errorssss:',error);
          if (error.status == 401 || error.status == 403 || error.status == 400)
          {
            // console.log('error:',error);
            let errorValue = error.error;
            // console.log('error1:',errorValue.error);
            if(errorValue.error){ alert(errorValue.error);}
            if(errorValue.detail){
               alert(errorValue.detail);
               if(errorValue.detail==='Invalid token.'){
                localStorage.removeItem("sessionData");
               }
            }
            this.sharedService.isLoggedin=false;
            this.sharedService.Loginname='';
            this.router.navigateByUrl('/verify');
          }else{
            alert(error.status + '.Message:'+error.statusText)
            // console.log('jwterror',error.status + '.Message:'+error.statusText)
          }
        }
      }

    ));

    // throw new Error("Method not implemented.");
  }
}