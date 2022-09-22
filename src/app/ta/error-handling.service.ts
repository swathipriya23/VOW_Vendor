import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})


export class ErrorHandlingService {
  public errorMessage: string = '';
  public handleError = (error: HttpErrorResponse) => {
    console.log(error.message);
    if(error.status === 500){
      this.handle500Error(error);
    }
    else if(error.status === 404){
      this.handle404Error(error)
      // this.checking(error);
    }
    else{
      console.log("log")
    }
  }
 
  private handle500Error = (error: HttpErrorResponse) => {
    // this.createErrorMessage(error);
    // this.router.navigate(['/500']);
    this.toastService.warning("INTERNAL SERVER ERROR")
  }
 
  private handle404Error = (error: HttpErrorResponse) => {
    // this.createErrorMessage(error);
    // this.router.navigate(['/404']);
    this.toastService.warning(`Page Not Found ${error.url}`)
  }
  constructor(private router: Router,private toastService: ToastrService) { }
  
  // checking(error){
  //   this.toastService.warning(`Page Not Found ${error.url}`)
  // }
}
