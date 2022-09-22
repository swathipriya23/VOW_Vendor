import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
export interface sourceList {
  code: string,
  id:number,
  name:string
}
@Component({
  selector: 'app-ppr-sources',
  templateUrl: './ppr-sources.component.html',
  styleUrls: ['./ppr-sources.component.scss']
})
export class PprSourcesComponent implements OnInit {
  // closepop
  @ViewChild('closepop') closepop
  @ViewChild('closepopedit') closepopedit
 
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
  constructor(private errorHandler: ErrorhandlingService,  private dataService: PprService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  pprsource:FormGroup
  ngOnInit(): void {
    this.pprsource=this.formBuilder.group({
      sourcename:[''],
      // description:['']
    })
    this.source__summary_search(this.pprsource)
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
  source__summary_search(source,pageNumber=1, pageSize=10){
    console.log(source)
    let sourcesearch={ "name":source.name,
    "code":source.code};
    this.SpinnerService.show()
    this.dataService.summary_pprsources_view(sourcesearch,pageNumber,pageSize).subscribe((results: any[]) => {
    this.SpinnerService.hide()

      this.source_summary=results['data']
      let dataPagination = results['pagination'];
      console.log("sourcesearch=>",results['data'])
      if (this.source_summary.length >= 0) {
        console.log("val")
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      } if (this.source_summary.length <= 0) {
        console.log("val1")

        this.isSummaryPagination = false;
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
 
  previousClick(){
    if (this.has_next === true) {
         
      this.currentpage = this.presentpage + 1
      this.source__summary_search(this.presentpage - 1, 10)
    }
  }
  nextClick(){
    if (this.has_next === true) {
         
      this.currentpage = this.presentpage + 1
      this.source__summary_search(this.presentpage + 1, 10)
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

    this.dataService.set_pprsources(source_prams).subscribe((results: any[]) => {
      console.log(results)
      this.SpinnerService.hide();

      if (results['status'] == 'success') {
        this.closepopedit.nativeElement.click();
        this.toastr.success("",results['message'],{timeOut:1500});
        this.pprsource.controls['sourcename'].reset('')
        this.source_id=''
        this.source__summary_search(this.pprsource)

      }else{
        this.closepopedit.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:1500}); 
        this.pprsource.controls['sourcename'].reset('')
        this.source_code=''
       this.source__summary_search(this.pprsource)

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
    this.dataService.set_pprsources(source_prams).subscribe((results: any[]) => {
      this.SpinnerService.hide();

      if (results['status'] == 'success') {
        this.closepop.nativeElement.click();
        this.toastr.success("",results['message'],{timeOut:1500});
        this.pprsource.controls['sourcename'].reset('')
        this.source__summary_search(this.pprsource)


      }else{
        this.closepop.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:1500}); 
        this.pprsource.controls['sourcename'].reset('')
        this.source__summary_search(this.pprsource)


      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
      // if (results.code == 'CREATED SUCCESS') {
      // }
  
  }
}
