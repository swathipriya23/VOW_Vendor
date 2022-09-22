import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { NotificationService } from 'src/app/service/notification.service';
import { ErrorHandlerService } from '../error-handler.service';
import { faservice } from '../fa.service';

@Component({
  selector: 'app-fa-fileupload',
  templateUrl: './fa-fileupload.component.html',
  styleUrls: ['./fa-fileupload.component.scss']
})
export class FaFileuploadComponent implements OnInit {
  @ViewChild('fileInput') frmdata:FormData;
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;
  
  images: any;
  empupload: Array<any>=[];
  fauploadform:any=FormGroup;
  frmData :any= new FormData();

  constructor(private errorHandler:ErrorHandlerService,private datepipe:DatePipe,private router: Router, private notification: NotificationService, private faserv: faservice,
   private SpinnerService:NgxSpinnerService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    console.log('form=')
    this.fauploadform=this.formBuilder.group({
      'images': new FormControl(),
    });

  }

  imagess(e:any){
    this.images=e;
  }
  
  files: any
  myFiles: Array<any> = [];
  getFileDetails(e:any,data:any) {
    this.empupload.pop()
    console.log('q=',data);
    const d:any=new FormData();
    this.empupload[0] = [{'files':[],'images':[],'image':[]}]
    console.log(this.empupload)
    for (var i = 0; i < e.target.files.length; i++) {
      this.empupload[0].files = []
      this.empupload[0].images = [];
      this.empupload[0].image = []

      this.empupload[0].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
      this.empupload[0].images.push(reader.result);
      }
      this.frmData.append('file',e.target.files[i])
    }
    console.log('form=',this.frmData)
    this.empupload[0].image.push(d);
    console.log(this.empupload[0])
  }
  deleteRow(listIndex: number, fileIndex: number) {
    console.log("files", this.empupload[listIndex].files);
    this.empupload[listIndex].files.splice(fileIndex, 1);
    this.empupload[listIndex].images.splice(fileIndex, 1);

  }

  empupload_Save(){
    this.SpinnerService.show();
    console.log('Hello');
    this.faserv.getfaupload(this.frmData).subscribe(result=>{
      console.log(result);
      this.SpinnerService.hide();
      let data = result['data'];
      if(data.code !=undefined && data.code !=''){
        this.notification.showError(data.description);
        this.notification.showError(data.code);
      }
      else{
            this.notification.showSuccess('success');
          }
        },
        (error:HttpErrorResponse)=>{
          this.SpinnerService.hide();
          this.errorHandler.errorHandler(error,'');
        }
        )
      }
    }
