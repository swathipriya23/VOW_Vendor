import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { PprService } from 'src/app/ppr/ppr.service';
import { DssService } from '../dss.service';
import { ErrorhandlingService } from '../errorhandling.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface sourceList {
  code: string,
  id:number,
  name:string
}

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {
 // closepop
 @ViewChild('closepop') closepop
 @ViewChild('closepopedit') closepopedit
 identificationSize:number=10
 dsssource:FormGroup
 newsource:FormArray
 source_summary: any;
 has_next: any;
 has_previous: any;
 presentpage: any;
 isSummaryPagination: boolean;
 currentpage: any;
 source_prams: { name: any; id: any; code: any; };
 source_id: any;
 source_code: any;
 source=new FormControl();
 isLoading: boolean;
 source_data: any;
  sourcesearch: { name: any; code: any; };
  has_next_page: any;
  has_previous_page: any;
 constructor(private errorHandler: ErrorhandlingService,  private dataService: DssService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
 pprsource:FormGroup
 ngOnInit(): void {
   this.pprsource=this.formBuilder.group({
     sourcename:[''],
     // description:['']
   })
   this.dsssource = this.formBuilder.group({
    newsource: new FormArray([this.createDssSource()])
  })
  this.sourcesearch={
    name:'',
    code:''
   }
   this.source__summary_search(this.sourcesearch)
   console.log("data=>",this.source_summary)

  

  console.log('dss=>',this.dsssource)
  // console.log('dss=>',this.dsssource.value.newsource)
 
  
 }
 createDssSource(){
  let dssSources=new FormGroup({
    sourcestatus:new FormControl(2),
    sourceid:new FormControl(''),
    sourcecode:new FormControl(''),
    sourcename:new FormControl(''),
    isEditable: new FormControl(false),
  }) 
  return dssSources;
 }
 sourcenewrowAdd(){
  const form = <FormArray> this.dsssource.get('newsource')
  for(let valsource of form.value){
    console.log("edit",valsource.isEditable)
    if(valsource.isEditable==false){
      console.log(valsource.isEditable)
      this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
      return false;
    }
  }
  form.insert(0, this.createDssSource());


 }
 source_dropdown() {
   let prokeyvalue: String = "";
   this.getsource_dropdown(prokeyvalue);
   this.source.valueChanges.pipe(
       debounceTime(100),
       distinctUntilChanged(),
       tap(() => {
         this.isLoading = true;
       }),
       switchMap(value => this.dataService.get_source_dropdown(value, 1)
         .pipe(
           finalize(() => {
             this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.source_data = datas;


     })
 }
@ViewChild('sourceauto') sourceauto:MatAutocomplete;
@ViewChild('sourceinput') sourceinput:any
@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
 autocompletesourceScroll(){
  this.has_next = true;
  this.has_previous = true;
  this.currentpage = 1

  setTimeout(() => {
    if (
      this.sourceauto &&
      this.autocompleteTrigger &&
      this.sourceauto.panel
    ) {
      fromEvent(this.sourceauto.panel.nativeElement, 'scroll')
        .pipe(
          map(() => this.sourceauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.sourceauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.sourceauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.sourceauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.dataService.get_source_dropdown(this.sourceinput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.source_data = this.source_data.concat(datas);
                  if (this.source_data.length >= 0) {
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

 private getsource_dropdown(prokeyvalue) {
   this.dataService.get_source_dropdown(prokeyvalue, 1)
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.source_data = datas;

     })
 }


 public displayfnsource(source?: sourceList): string | undefined {
   return source ? source.name : undefined;

 }
 source__summary_clear(){
  this.source.reset('')
 }
 source__summary_search(sourceval,pageNumber=1, pageSize=10){
   let source
   let source_code
   console.log(source)
if(sourceval==null || sourceval==undefined || sourceval==''){
  source=''
  source_code=''
}else{
  source=sourceval.name
  source_code=sourceval.code
}
   this.sourcesearch={ "name":source,
   "code":source_code};
   this.SpinnerService.show()
   this.dataService.summary_pprsources_view(this.sourcesearch,pageNumber,pageSize).subscribe((results: any[]) => {
   this.SpinnerService.hide()

     this.source_summary=results['data']
     let dataPagination = results['pagination'];
     
     console.log("sourcesearch=>",results['data'])
     if (this.source_summary.length >= 0) {
       console.log("val")
       
       this.has_next_page = dataPagination.has_next;
       this.has_previous_page = dataPagination.has_previous;
       this.presentpage = dataPagination.index;
       this.isSummaryPagination = true;
      
      // for(let index in this.source_summary){
      //   this.dsssource.controls.rows_value['controls'].at(index).patchValue({sourcecode:this.source_summary[index].code});
      //   this.dsssource.controls.rows_value['controls'].at(index).patchValue({sourcename:this.source_summary[index].name})
      //   this.dsssource.controls.rows_value['controls'].at(index).patchValue({isEditable:true})
      // }
    
       this.dsssource = this.formBuilder.group({
        newsource: this.formBuilder.array(
          this.source_summary.map(val =>
            this.formBuilder.group({
              sourcestatus:new FormControl(val.status),
              sourceid:new FormControl(val.id),
              sourcecode:new FormControl(val.code),
              sourcename:new FormControl(val.name),
              isEditable: new FormControl(true),
            })
          )
        ) 
      });
      console.log(this.dsssource)
     } if (this.source_summary.length <= 0) {
       console.log("val1")

       this.isSummaryPagination = false;
     }
   }, error => {
     this.errorHandler.handleError(error);
     this.SpinnerService.hide();
   })
 }
 deletesource(dssdelete,i){
  var sourceconfirm=window.confirm("Are You Sure Change The Status?")
  console.log(sourceconfirm)
  if(!sourceconfirm){
    return false;
  }else{
    let delsource=dssdelete.value.newsource[i]
    let id=delsource.sourceid
    let status=delsource.sourcestatus
    let sourcestatus
    if(status==0){
      sourcestatus=1
    }else{
      sourcestatus=0
    }
    let sourcepram={
        "name": "",
        "code": ""
    }
    
    this.SpinnerService.show()
    this.dataService.deletesource(id,sourcestatus).subscribe((results) => {
      this.SpinnerService.hide()
      if(results.status=='success'){
        if(sourcestatus==1){
          this.toastr.success("","Source Active  Succesfully",{timeOut:1500})
          this.source__summary_search(sourcepram)
  this.source.reset('')
          
        }else{
          this.toastr.success("","Source In-Active Source Succesfully",{timeOut:1500})
          this.source__summary_search(sourcepram)
  this.source.reset('')

        }
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  
 }
 Cancelsource(dssform, i) {
  console.log("dss=>",dssform)
  console.log("dss 2=>",dssform.value)
  console.log("dss 3=>",dssform.value.newsource)
  console.log("dss 4=>",dssform.value.newsource[i])
  console.log("dss 5=>",dssform.value.newsource[i].sourcecode)

  const control = <FormArray>dssform.controls['newsource'];
  console.log(control)
  if(dssform.value.newsource[i].sourcecode  != ""){
    console.log('true')
    dssform.get('newsource')
    .at(i)
    .get('isEditable')
    .patchValue(true);
    console.log("dss 1=>",this.dsssource.controls.newsource['controls'])

  }  if(dssform.value.newsource[i].sourcecode  == "" || dssform.value.newsource[i].sourcecode == undefined  || dssform.value.newsource[i].sourcecode ==null)
    {
    const control = <FormArray>dssform.controls['newsource'];
    control.removeAt(i)   
    console.log('false')

  }
   
}
EditSource(sourceedit, i) {
  for(let valsource of sourceedit.controls['newsource'].value){
    console.log("edit",valsource.isEditable)
    if(valsource.isEditable==false){
      console.log(valsource.isEditable)
      this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
      return false;
    }
  }
  sourceedit.get('newsource')
    .at(i)
    .get('isEditable')
    .patchValue(false);

   
}
savesource(source,i){
  let sourceeditval=source.value.newsource[i]
  if(sourceeditval.sourcename==''){
    this.toastr.warning('', 'Please Fill The Source Name', { timeOut: 1500 });
    return false;
  }
 console.log("sourceeditval=>",sourceeditval)
 let source_prams
 if(sourceeditval.sourcecode !=''){
  source_prams={
    "name":sourceeditval.sourcename,
    "id":sourceeditval.sourceid,
    "code":sourceeditval.sourcecode
  }
 }else{
  source_prams={
    "name":sourceeditval.sourcename,
    "code":0
  }
}
  var sourceconfirm=window.confirm("Do You Want To Save And Continue?")
  console.log(sourceconfirm)
  if(!sourceconfirm){
    console.log("True")
    return false;
  }else{
    console.log("False")
  this.SpinnerService.show();
  let sourcepram={
    "name": "",
    "code": ""
}
  this.dataService.set_pprsources(source_prams).subscribe((results: any[]) => {
    console.log(results)
    this.SpinnerService.hide();

    if (results['status'] == 'success') {
      
      if(sourceeditval.sourcecode !=''){
        this.toastr.success("",'Successfully Updated',{timeOut:1500});
      }else{
       this.toastr.warning("",results['message'],{timeOut:1500}); 
      }
      this.pprsource.controls['sourcename'].reset('')
      this.source_id=''
      this.source__summary_search(sourcepram)
  this.source.reset('')


    }else{
      this.closepopedit.nativeElement.click();
      this.toastr.warning("",results['message'],{timeOut:1500}); 
      this.pprsource.controls['sourcename'].reset('')
      this.source_code=''
      this.source__summary_search(sourcepram)
      this.source.reset('')

      // this.source_prams={}
    }
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
  }
}
 previousClick(){
   if (this.has_previous_page === true) {
        
     this.currentpage = this.presentpage + 1
     this.source__summary_search(this.sourcesearch,this.presentpage - 1, 10)
   }
 }
 nextClick(){
   if (this.has_next_page === true) {
        
     this.currentpage = this.presentpage + 1
     this.source__summary_search(this.sourcesearch,this.presentpage + 1, 10)
   }
 }
 clearsource(){
   this.pprsource.controls['sourcename'].reset('')
   // this.pprsource.controls['description'].reset('')
 }
 clearsource_edit(){
   this.pprsource.controls['sourcename'].reset('')

 }
 clearsource_view(){
   this.pprsource.controls['sourcename'].reset('')

 }
 editview_source(sourcesummary){
   this.source_id=sourcesummary.id
   this.source_code=sourcesummary.code
   this.pprsource.patchValue({
     sourcename:sourcesummary.name,

   })
   // this.dataService.set_pprsources(source_prams).subscribe((results: any[]) => {
   //   console.log(results['data'])
   // })

 }
 save_source_edit(source){
   if(source.sourcename==''){
     this.toastr.warning('', 'Please Fill The Source Name', { timeOut: 1500 });
     return false;
   }
  console.log(source)
  let source_prams={
   "name":source.sourcename,
   "id":this.source_id,
   "code":this.source_code
 }
   this.SpinnerService.show();
   this.sourcesearch={
    name:'',
    code:''
   }
   this.dataService.set_pprsources(source_prams).subscribe((results) => {
     console.log(results)
     this.SpinnerService.hide();

     if (results.status == 'success') {
       this.closepopedit.nativeElement.click();
       this.toastr.success("",'Successfully Updated',{timeOut:1500});
       this.source__summary_search(this.sourcesearch)
  this.source.reset('')

     }else{
       this.closepopedit.nativeElement.click();
       this.toastr.warning("",results['message'],{timeOut:1500}); 
       this.pprsource.controls['sourcename'].reset('')
       this.pprsource.controls['sourcename'].reset('')
       this.source_code=''
      this.source__summary_search(this.sourcesearch)
      this.source.reset('')

       // this.source_prams={}
     }
   }, error => {
     this.errorHandler.handleError(error);
     this.SpinnerService.hide();
   })
 }
 save_source(source){
   console.log("source=>",source)
   if(source.sourcename==''){
     this.toastr.warning('', 'Please Fill The Source Name', { timeOut: 1500 });
     return false;
   }
   if(source.description==''){
     this.toastr.warning('', 'Please Fill The Description', { timeOut: 1500 });
     return false;
   }
   let source_prams={
     "name":source.sourcename,
     "code":0
     }
     this.sourcesearch={
      name:'',
      code:''
     }
   this.dataService.set_pprsources(source_prams).subscribe((results: any[]) => {
     this.SpinnerService.hide();

     if (results['status'] == 'success') {
       this.closepop.nativeElement.click();
       this.toastr.success("",results['message'],{timeOut:1500});
       this.pprsource.controls['sourcename'].reset('')
       this.source__summary_search(this.sourcesearch)
       this.source.reset('')

     }else{
       this.closepop.nativeElement.click();
       this.toastr.warning("",results['message'],{timeOut:1500}); 
       this.pprsource.controls['sourcename'].reset('')
       this.source__summary_search(this.sourcesearch)
       this.source.reset('')

     }
   }, error => {
     this.errorHandler.handleError(error);
     this.SpinnerService.hide();
   })
     // if (results.code == 'CREATED SUCCESS') {
     // }
 
 }
}
