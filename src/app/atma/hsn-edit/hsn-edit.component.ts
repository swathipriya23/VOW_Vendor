import { Component, OnInit, Output,EventEmitter, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { AtmaService } from '../atma.service';
import {ShareService} from '../share.service'
export interface sgst{
  id:string;
  name:string;
  rate:string
}
@Component({
  selector: 'app-hsn-edit',
  templateUrl: './hsn-edit.component.html',
  styleUrls: ['./hsn-edit.component.scss']
})
export class HsnEditComponent implements OnInit {

  @ViewChild('rateinput') rateInput:any;
  @ViewChild('rateref') matRate:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigget:MatAutocompleteTrigger;
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  hsnform:any=FormGroup;
  ratelist: Array<any>=[];
  isLoading:boolean;
  has_next:boolean=true;
  has_previous:boolean=false;
  currentpage:number=1;
  rateid:any;
  constructor(private shateservice:ShareService,private fb:FormBuilder,private Notification:NotificationService,private atmaservice:AtmaService) { }

  ngOnInit(): void {
    this.hsnform=this.fb.group({
      'code':['',Validators.required],
      'cgst':['',Validators.required],
      'sgst':['',Validators.required],
      'igst':['',Validators.required],
      'desc':['',Validators.required]
    });
   
    this.hsnform.get('cgst').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getsgstdropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ratelist=data['data'];
    });
    this.hsnform.get('sgst').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getsgstdropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ratelist=data['data'];
    });
    this.hsnform.get('igst').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getsgstdropdown(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.ratelist=data['data'];
    });
    let data:any=this.shateservice.hsnedit.value;
    this.rateid=data.id;
    this.atmaservice.gethsnid_data(this.rateid).subscribe(dta=>{
      let iddata:any=dta['data'][0];
      this.hsnform.patchValue({'code':iddata.code,'cgst':{'id':iddata.cgstrate_id,'name':iddata.cgstname,'rate':iddata.cgstrate},
      'sgst':{'id':iddata.sgstrate_id,'name':iddata.sgstname,'rate':iddata.sgstrate},
      'igst':{'id':iddata.igstrate_id,'name':iddata.igstname,'rate':iddata.igstrate},
      'desc':iddata.description })
    },
    (error)=>{
      this.Notification.showError(error.status+error.statusText);
    }
    );
    // this.hsnform.patchValue({})
    this.atmaservice.getsgstdropdown('',1).subscribe(data=>{
      this.ratelist=data['data'];
    },
    (error)=>{
      this.Notification.showError(error.status+error.statusText)
    }
    );
    
  }
  public getdisplaysgstinterface(data?:sgst):string | undefined{
    return data?data.name:undefined;
  }
  submitform(){
    console.log(this.hsnform.value)
    if(this.hsnform.get('code').value==undefined || this.hsnform.get('code').value=='' || this.hsnform.get('code').value==null){
      this.Notification.showError('Please Enter The Valid HSN Code');
      return false;
    }
    if(this.hsnform.get('cgst').value==undefined || this.hsnform.get('cgst').value=='' || this.hsnform.get('cgst').value==null){
      this.Notification.showError('Please Enter The Valid CGST');
      return false;
    }
    if(this.hsnform.get('sgst').value==undefined || this.hsnform.get('sgst').value=='' || this.hsnform.get('sgst').value==null){
      this.Notification.showError('Please Enter The Valid SGST');
      return false;
    }
    if(this.hsnform.get('igst').value==undefined || this.hsnform.get('igst').value=='' || this.hsnform.get('igst').value==null){
      this.Notification.showError('Please Enter The Valid IGST');
      return false;
    }
    if(this.hsnform.get('desc').value==undefined || this.hsnform.get('desc').value=='' || this.hsnform.get('desc').value==null){
      this.Notification.showError('Please Enter The Valid HSN Description');
      return false;
    }
    let createdata:any={
      'id':this.rateid,
      'code':this.hsnform.get('code').value,
      "description":this.hsnform.get('desc').value.toString().trim(),
      "cgstrate":this.hsnform.get('cgst').value.rate,
      "sgstrate":this.hsnform.get('sgst').value.rate,
      "igstrate":this.hsnform.get('igst').value.rate,
      "cgstrate_id":this.hsnform.get('cgst').value.id,
      "sgstrate_id":this.hsnform.get('sgst').value.id,
      "igstrate_id":this.hsnform.get('igst').value.id
    };
    this.atmaservice.gethsncreate(createdata).subscribe((result:any)=>{
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
      }else {
        this.Notification.showSuccess("saved Successfully!...")
        this.onSubmit.emit();
      }
    })
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
      return false;
    }
    return true;
  }
  autocompletecatScroll() {
    setTimeout(() => {
      if (
        this.matRate &&
        this.autocompleteTrigget &&
        this.matRate.panel
      ) {
        fromEvent(this.matRate.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matRate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigget.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matRate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matRate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matRate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaservice.getsgstdropdown(this.rateInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ratelist = this.ratelist.concat(datas);
                    // console.log("emp", datas)
                    if (this.ratelist.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  onclickcancel(){
    this.onCancel.emit();
  }

}
