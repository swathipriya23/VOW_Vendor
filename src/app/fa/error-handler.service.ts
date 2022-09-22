import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../service/shared.service';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastr:ToastrService,private sharedService:SharedService,private router:Router) { }
  public errorHandler(error:HttpErrorResponse,type:any){
    {
      if (error instanceof HttpErrorResponse)
      {
        if (error.status == 401 || error.status == 403 || error.status == 400)
        {
          this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          localStorage.removeItem("sessionData");
          this.sharedService.isLoggedin=false;
          this.sharedService.Loginname='';
          this.router.navigateByUrl('/verify');
        }
        else if(error.status == 200 && error.statusText=="OK"){
          
          // console.log(JSON.parse((error.error)).toString().split('\n'));
          let d:any=(error.error.error).toString().split('\n');
          if(d[0] !=undefined){
            this.toastr.error(d[0],'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          }
          else{
            this.toastr.error('JSON Parse Error','',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          }
        }
        else if(error.status == 404){
          this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'})
        }
        else{
          this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          if(error.status !=0){
            if(type=='file'){
              try{
              error.error.text().then(text => {
                //console.log(text.split('\n'));
                let d:any=text.split('\n');
                if(d[0] !=undefined && d[1] !=undefined){
                  this.toastr.error(d[0].toString().split(' ')[0] +': '+d[1].toString().slice(0,100)+' ..','',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
                }
                else{
                  this.toastr.error(d[0]+' ..','',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
                }
              });
            }
            catch{
              let d:any=(error.error).toString('').split('\n');
              if(d[0] !=undefined && d[1] !=undefined){
                this.toastr.error(d[0].toString().split(' ')[0] +': '+d[1].toString().slice(0,100)+' ..','',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
              }
              else{
                this.toastr.error(d[0]+' ..','',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
              }
            }
              
            }
            else{
              // console.log()
              // console.log((error.error).toString().split('\n'));
              let d:any=(error.error).toString().split('\n');
                if(d[1] !=undefined){
                  this.toastr.error(d[1].toString().slice(0,100)+' ..',d[0].toString().slice(0,100) +' ..',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
                }
                else{
                  this.toastr.error(d[0].toString().slice(0,100)+' ..','',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
                }
            }
            
          }
          else{
            this.toastr.error(error.status+'-'+error.statusText,'Server Issues',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          }
          
        }
      }
    }
  }
}
