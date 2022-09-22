import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray,FormGroup,FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap,map, takeUntil } from 'rxjs/operators';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
export interface Data{
  id:number,
  name:string
};
@Component({
  selector: 'app-bucket-summary',
  templateUrl: './bucket-summary.component.html',
  styleUrls: ['./bucket-summary.component.scss']
})


export class BucketSummaryComponent implements OnInit {
  @ViewChild('assetidvalue') matassetid:MatAutocomplete;
  @ViewChild('assetidinputvalue') assetinput:ElementRef;
  @ViewChild(MatAutocompleteTrigger) autoTrigger:MatAutocompleteTrigger;
  searchForm:any=FormGroup;
  isLoading:boolean=true;
  currentPage:number=1;
  has_next:boolean=false;
  has_previous:boolean=false;
  bucketdata:Array<any>=[];
  assetIddata:Array<any>=[];
  pageSize:number=10;
  has_assetprevious:boolean=false;
  has_assetnext:boolean=false;
  has_assetpage:number=1;
  constructor(private errorHandler:ErrorHandlerService,private formBuild:FormBuilder,private router:Router,private Faservice:faservice,private service:faShareService,private notification:NotificationService,private spinner:NgxSpinnerService) { }

  ngOnInit(){
    this.searchForm=this.formBuild.group({
      'assetid':new FormControl('')
    });
    this.getsummarydata();
  }
  getsummarydata(){
    let search:any='&page='+this.currentPage;
    if(this.searchForm.get('assetid').value !=null && this.searchForm.get('assetid').value !='' && this.searchForm.get('assetid').value !=""){
      search=search+this.searchForm.get('assetid').value;
    }  ;
    this.spinner.show();
    this.Faservice.getbucketsummary('').subscribe(data=>{
      this.spinner.hide();
      this.bucketdata=data['data'];
      let pagination=data['pagination'];
      if(this.bucketdata.length>0){
        this.has_next=pagination.has_next;
        this.has_previous=pagination.has_previous;
        this.currentPage=pagination.index;
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
     
  }
  assetiddisplay(data?:Data):number | undefined{
    return data?data.id:undefined;
  }
  viewofpage(){
    this.service.bucket_id.next(1);
    this.router.navigate(['fa/bucketsummaryview'],{skipLocationChange:true});
  }
  clickoff(){
    this.isLoading=true;
    console.log(this.searchForm.value);
    this.Faservice.getbucketsummarysearch(this.searchForm.get('assetid').value,1).subscribe(data=>{
      this.isLoading=false;
      this.assetIddata=data['data'];
    });
  };
  autocompleteassetid(){
    console.log('hi')
    setTimeout(()=>{
      if(this.matassetid && this.autoTrigger && this.matassetid.panel){
        fromEvent(this.matassetid.panel.nativeElement,'scroll').pipe(
          map(()=>this.matassetid.panel.nativeElement.scrollTop),
          takeUntil(this.autoTrigger.panelClosingActions)
        ).subscribe(()=>{
          const scrollTop=this.matassetid.panel.nativeElement.scrollTop;
          const scrollHeight=this.matassetid.panel.nativeElement.scrollHeight;
          const elementHeight=this.matassetid.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if(atBottom){
            console.log('h');
            if(this.has_assetnext){
              this.Faservice.getbucketsummarysearch(this.assetinput.nativeElement.value,this.has_assetpage+1).subscribe(data=>{
                this.isLoading=false;
                this.assetIddata=this.assetIddata.concat(data['data']);
                let pagination=data['pagination'];
                if(this.assetIddata.length>0){
                  this.has_assetnext=pagination.has_next;
                  this.has_assetprevious=pagination.has_assetprevious;
                  this.has_assetpage=pagination.index;
                }
                
              });
             
            }
          }
        }
        )
      }
    })
  }
}
