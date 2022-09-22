import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ExceptionHandlingService {
  public errorMessage: string = '';
  constructor(private router: Router,private toastService: ToastrService) { }
  public handleError = (error: HttpErrorResponse) => {
    if(error.status === 500){
      this.handle500Error(error);
    }
    else if(error.status === 404){
      this.handle404Error(error)
    }
    else if(error.status === 0){
      this.handle404Error(error)
    }
    else{
      console.log("log")
    }
  }
 
  private handle500Error = (error: HttpErrorResponse) => {
    this.toastService.warning("INTERNAL SERVER ERROR")
  }
 
  private handle404Error = (error: HttpErrorResponse) => {
    this.toastService.warning("PAGE NOT FOUND")
  }
}
