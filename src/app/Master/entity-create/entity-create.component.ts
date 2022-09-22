import { Component, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';

import {masterService} from '../master.service'
export interface expid{
  id:string;
  name:string;
  description:string;
}
@Component({
  selector: 'app-entity-create',
  templateUrl: './entity-create.component.html',
  styleUrls: ['./entity-create.component.scss']
})
export class EntityCreateComponent implements OnInit {

  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  @ViewChild('expinput') ExpInput:any;
  @ViewChild('expidref') matExp:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger:MatAutocompleteTrigger;
  expencecrateform:any=FormGroup;
  expenceform:any=FormGroup;
  expidlist: Array<any>=[];
  has_next:boolean;
  has_previous:boolean;
  page:number=1;
  isLoading:boolean;
  constructor(private fb:FormBuilder,private masterservice:masterService,private Notification:NotificationService) { }

  ngOnInit(): void {
    this.expencecrateform=this.fb.group({
      'name':['',Validators.required],
      'desc':['',Validators.required]
    });
    this.expenceform=this.fb.group({
      'expid':['',Validators.required],
      'head':['',Validators.required],
      'linedesc':['',Validators.required],
      'group':['',Validators.required],
      'scheme':['',Validators.required],
      'schemeas':['',Validators.required]
    });
    this.expenceform.get('expid').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;;
      }),
      switchMap(value=>this.masterservice.expenceidscrollget(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.expidlist=data['data'];
    });
  }
  public datainterfaceempid(data?:expid):string | undefined{
    return data?data.name:undefined;
  }
  getsubmitform(){
    console.log(this.expencecrateform.value);
    if(this.expencecrateform.get('name').value==undefined || this.expencecrateform.get('name').value=='' || this.expencecrateform.get('name').value==null){
      this.Notification.showError('please Enter the Entity Name');
      return false;
    }
    if(this.expencecrateform.get('desc').value==undefined || this.expencecrateform.get('desc').value=='' || this.expencecrateform.get('desc').value==null){
      this.Notification.showError('please Enter the Entity Description');
      return false;
    }
    let d:any={'name':this.expencecrateform.get('name').value,'namespace':this.expencecrateform.get('desc').value};
    console.log(d);
    this.masterservice.getentitycreate(d).subscribe(result=>{
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
  getexpencesubmit(){
    if(this.expenceform.get('expid').value.id==undefined || this.expenceform.get('expid').value=='' || this.expenceform.get('expid').value==null){
      this.Notification.showError('Please Enter The Name');
      return false;
    }
    if(this.expenceform.get('head').value==undefined || this.expenceform.get('head').value=='' || this.expenceform.get('head').value==null){
      this.Notification.showError('Please Enter The Description');
      return false;
    }
    if(this.expenceform.get('linedesc').value==undefined || this.expenceform.get('linedesc').value=='' || this.expenceform.get('linedesc').value==null){
      this.Notification.showError('Please Enter The LineDescription');
      return false;
    }
    if(this.expenceform.get('group').value==undefined || this.expenceform.get('group').value=='' || this.expenceform.get('group').value==null){
      this.Notification.showError('Please Enter The Group');
      return false;
    }
    if(this.expenceform.get('scheme').value==undefined || this.expenceform.get('scheme').value=='' || this.expenceform.get('scheme').value==null){
      this.Notification.showError('Please Enter The scheme');
      return false;
    }
    if(this.expenceform.get('schemeas').value==undefined || this.expenceform.get('schemeas').value=='' || this.expenceform.get('schemeas').value==null){
      this.Notification.showError('Please Enter The scheme Level');
      return false;
    }
    let d:any={
     
      "group":this.expenceform.get('expid').value.id,
      "head": this.expenceform.get('head').value,
      // "id": this.expenceform.get('expid').value.id,
      "linedesc": this.expenceform.get('linedesc').value,
      "sch16": this.expenceform.get('schemeas').value,
      "sch16desc":this.expenceform.get('scheme').value
  };
  this.masterservice.expencedatacreate(d).subscribe(result=>{
    if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
      this.Notification.showError("[INVALID_DATA! ...]")
    }
    else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
      this.Notification.showWarning("Duplicate Data! ...")
    } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
      this.Notification.showError("INVALID_DATA!...")
    }else {
      this.Notification.showSuccess("saved Successfully!...")
      
    }
  })

  }
  onclickcancel(){
    this.onCancel.emit();
  }
  autocompleteDeptScroll() {
    setTimeout(() => {
      if (
        this.matExp &&
        this.autocompleteTrigger &&
        this.matExp.panel
      ) {
        fromEvent(this.matExp.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matExp.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matExp.panel.nativeElement.scrollTop;
            const scrollHeight = this.matExp.panel.nativeElement.scrollHeight;
            const elementHeight = this.matExp.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.masterservice.expenceidscrollget(this.ExpInput.nativeElement.value, this.page+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.expidlist = this.expidlist.concat(datas);
                    if (this.expidlist.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.page = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

}
