import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { expid } from '../expence-create/expence-create.component';
import { masterService } from '../master.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  @ViewChild('expinput') ExpInput:any;
  @ViewChild('expidref') matExp:MatAutocomplete;
  @ViewChild('rm') matrmAutocomplete: MatAutocomplete;
  @ViewChild('rmidInput') rmidInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger:MatAutocompleteTrigger;
  clientform:any=FormGroup;
  expenceform:any=FormGroup;
  expidlist: Array<any>=[];
  has_next:boolean;
  has_previous:boolean;
  page:number=1;
  isLoading:boolean = false;
  has_nextcom_branch=true;
  currentpagecom_branch=1;
  has_previouscom=true;
  rmdata:Array<any> = [];
  rm_id: any;
  constructor(private fb:FormBuilder,private masterservice:masterService,private Notification:NotificationService,
    private SpinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.clientform=this.fb.group({
      // 'code':[''],
      'name':[''],
      'rm':[''],
      'entity':[''],
      'cin':[''],
      'nimbus':['']
    });

    this.masterservice.getrmSearch('',1).subscribe(data=>{
      this.rmdata=data['data'];
    })
    this.clientform.get('rm').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
  
      }),
      switchMap(value => this.masterservice.getrmSearch(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
    .subscribe((results: any[]) => {
      this.rmdata = results["data"];
    })
  
  }

  public datainterfaceempid(data?:expid):string | undefined{
    return data?data.name:undefined;
  }

  autocompleteScroll_rm() {
    setTimeout(() => {
      if (
        this.matrmAutocomplete &&
        this.autocompleteTrigger &&
        this.matrmAutocomplete.panel
      ) {
        fromEvent(this.matrmAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrmAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrmAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrmAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrmAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.masterservice.getrmSearch( this.rmidInput.nativeElement.value, this.currentpagecom_branch+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('rm=',results)
                    let datapagination = results["pagination"];
                    this.rmdata = this.rmdata.concat(datas);
                    if (this.rmdata.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  rmd(d){
    this.rm_id = d.id;
  }
  
  getsubmitform(){
   
    // if(this.clientform.get('code').value==undefined || this.clientform.get('code').value=='' || this.clientform.get('code').value==null){
    //   this.Notification.showError('please Enter Client Code');
    //   return false;
    // }
    if(this.clientform.get('name').value==undefined || this.clientform.get('name').value=='' || this.clientform.get('name').value==null){
      this.Notification.showError('please Enter Client Name');
      return false;
    }
    if(this.clientform.get('rm').value==undefined || this.clientform.get('rm').value=='' || this.clientform.get('rm').value==null){
      this.Notification.showError('please Enter RM Name');
      return false;
    }
    if(this.clientform.get('cin').value==undefined || this.clientform.get('cin').value=='' || this.clientform.get('cin').value==null){
      this.Notification.showError('please Enter The CIN ');
      return false;
    }
    // if(this.clientform.get('nimbus').value==undefined || this.clientform.get('nimbus').value=='' || this.clientform.get('nimbus').value==null){
    //   this.Notification.showError('please Enter The CIN ');
    //   return false;
    // }
    if(this.clientform.get('cin').value.toString().length==21 ){
      console.log('1');
    }
    else{
      this.Notification.showWarning('Please Enter The CIN Number 21 ');
      return false;
    }
    if(this.clientform.get('nimbus').value != undefined && this.clientform.get('nimbus').value !=null && this.clientform.get('nimbus').value !=''){
      if(this.clientform.get('nimbus').value.toString().length==16){
        console.log('1');
      }
      else{
        this.Notification.showWarning('Please Enter The Nimbus Number 16 Digits');
        return false;
      }
    }
    
    let d:any={
              // 'client_code':this.clientform.get('code').value,
              'client_name':this.clientform.get('name').value,
              'rm_name':this.rm_id,
              'entity':this.clientform.get('entity').value,
              'nimbus_ref_number':this.clientform.get('nimbus').value ? this.clientform.get('nimbus').value:'' ,
              'cin':this.clientform.get('cin').value
            };
    console.log(d);
    this.SpinnerService.show();
    this.masterservice.getclientcreate(d).subscribe(result=>{
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
        this.SpinnerService.hide();
      }
      else if (result.code === "INVALID_DATA" && result.description === "Duplicate Name") {
        this.Notification.showError("[DUPLICATE DATA! ...]")
        this.SpinnerService.hide();
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
        this.SpinnerService.hide();
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
        this.SpinnerService.hide();
      }else {
        this.Notification.showSuccess("Saved Successfully!...")
        this.SpinnerService.hide();
        this.onSubmit.emit();
      }
    },
    (error)=>{
      this.SpinnerService.hide();
    }
    )
  }

  onclickcancel(){
    this.onCancel.emit();
  }
  keypressd(event){
    let k = event.charCode; 
    if( (k>=48 && k<=57) || (k>=65 && k<=90) || (k>=97 && k<=122)){
      return true;
    }
    return false;
  }

}
