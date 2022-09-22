import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
export interface gl_subgrp {
  code: string,
  id:number,
  name:string
}
export interface subgrp {
  code: string,
  id:number,
  name:string
}
@Component({
  selector: 'app-gl-subgroup',
  templateUrl: './gl-subgroup.component.html',
  styleUrls: ['./gl-subgroup.component.scss']
})
export class GlSubgroupComponent implements OnInit {
  isLoading: boolean;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number;
  gl_sub_groupsummary:FormGroup;
  pprglsubgrpsource:FormGroup;
  gl_subgrp_data: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('glsubgrpauto') matAutocompleteglsubgrpauto: MatAutocomplete;
  @ViewChild('gl_subgrpinput') gl_subgrpinput: any;
  @ViewChild('gl_subgrpauto') matAutocompletegl_subgrpauto: MatAutocomplete;
  @ViewChild('subgrpinput') subgrpinput: any;
  @ViewChild('subgrpauto') matAutocompletesubgrpauto: MatAutocomplete;
  @ViewChild('glsubgrpinput') glsubgrpinput: any;
  @ViewChild('closepop') closepop:any;
  @ViewChild('closepopedit') closepopedit:any
  gl_subgrp_summary: any;
  isSummaryPagination: boolean;
  presentpage: any;
  glsubgrp_id: any;
  glsubgrp_data: any;
  subgrp_data: any;
  
  constructor(private errorHandler: ErrorhandlingService,  private dataService: PprService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }


  ngOnInit(): void {
    this.gl_sub_groupsummary=this.formBuilder.group({
      gl_subgrp:[''],
      subgrp:['']
    })
    this.pprglsubgrpsource=this.formBuilder.group({
      glsubgrpgl_no:[''],
      glsubgrp:[''],
      description:['']
    })
    this.gl_subgrp_summary_search(this.gl_sub_groupsummary.value)
  }
  gl_subgrb_dropdown() {
    let prokeyvalue: String = "";
    this.get_gl_subgrb_dropdown(prokeyvalue);
    this.gl_sub_groupsummary.get('gl_subgrp').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_glsubgrp_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.gl_subgrp_data = datas;


      })
  }



  private get_gl_subgrb_dropdown(prokeyvalue) {
    this.dataService.get_glsubgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.gl_subgrp_data = datas;

      })
  }


  public displayfngl_subgrp(gl_subgrp ?: gl_subgrp): string | undefined {
    return gl_subgrp ? gl_subgrp.name : undefined;
  }

  autocompletegl_subgrpScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompleteglsubgrpauto &&
        this.autocompleteTrigger &&
        this.matAutocompleteglsubgrpauto.panel
      ) {
        fromEvent(this.matAutocompleteglsubgrpauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteglsubgrpauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteglsubgrpauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteglsubgrpauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteglsubgrpauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_glsubgrp_dropdown(this.gl_subgrpinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.gl_subgrp_data = this.gl_subgrp_data.concat(datas);
                    if (this.gl_subgrp_data.length >= 0) {
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

  subgrb_dropdown() {
    let prokeyvalue: String = "";
    this.getsubgrb_dropdown(prokeyvalue);
    this.gl_sub_groupsummary.get('subgrp').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_subgrp_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subgrp_data = datas;


      })
  }



  private getsubgrb_dropdown(prokeyvalue) {
    this.dataService.get_subgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subgrp_data = datas;

      })
  }


  public displayfnsubgrp(gl_subgrp ?: subgrp): string | undefined {
    return gl_subgrp ? gl_subgrp.name : undefined;
  }

  autocompletesubgrpScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompletesubgrpauto &&
        this.autocompleteTrigger &&
        this.matAutocompletesubgrpauto.panel
      ) {
        fromEvent(this.matAutocompletesubgrpauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletesubgrpauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletesubgrpauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletesubgrpauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletesubgrpauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_subgrp_dropdown(this.subgrpinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subgrp_data = this.subgrp_data.concat(datas);
                    if (this.subgrp_data.length >= 0) {
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


  gl_subgrp_summary_search(gl_subgrp_data,pageNumber=1){
    if((gl_subgrp_data.gl_subgrp=='')||(gl_subgrp_data.gl_subgrp==undefined)||(gl_subgrp_data.gl_subgrp==null)){
      gl_subgrp_data.head_group=''
  
    }else{
      gl_subgrp_data.head_group=gl_subgrp_data.gl_subgrp.id    
    }
    if((gl_subgrp_data.subgrp=='')||(gl_subgrp_data.subgrp==undefined)||(gl_subgrp_data.subgrp==null)){
      gl_subgrp_data.gl_no=''
  
    }else{
      gl_subgrp_data.gl_no=gl_subgrp_data.subgrp.id    
    }
   
    let gl_subgrp_pram={
      "head_group":gl_subgrp_data.head_group,
      "gl_no":gl_subgrp_data.gl_no,
       
    }
    this.SpinnerService.show()
    this.dataService.summary_glsubgrp_view(gl_subgrp_pram,pageNumber).subscribe((results:any)=>{
    this.SpinnerService.hide()

      this.gl_subgrp_summary=results['data']
      let dataPagination = results['pagination'];
      
      if (this.gl_subgrp_summary.length >= 0) {
        console.log("val")
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      } if (this.gl_subgrp_summary.length <= 0) {
        console.log("val1")

        this.isSummaryPagination = false;
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  previousClick(gl_sub_groupsummary){
    if (this.has_previous === true) {
         
      this.currentpage = this.presentpage + 1
      this.gl_subgrp_summary_search(gl_sub_groupsummary,this.presentpage - 1)
    }
  }
  nextClick(gl_sub_groupsummary){
    if (this.has_next === true) {
         
      this.currentpage = this.presentpage + 1
      this.gl_subgrp_summary_search(gl_sub_groupsummary,this.presentpage + 1)
    }
  }
  clearsource(){
    this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
    this.pprglsubgrpsource.controls['glsubgrp'].reset('')
    this.pprglsubgrpsource.controls['description'].reset('')
  }
  glsubgrbdropdown() {
    let prokeyvalue: String = "";
    this.getgl_subgrb_dropdown(prokeyvalue);
    this.pprglsubgrpsource.get('glsubgrp').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_subgrp_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.glsubgrp_data = datas;


      })
  }



  private getgl_subgrb_dropdown(prokeyvalue) {
    this.dataService.get_subgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.glsubgrp_data = datas;

      })
  }


  public displayfnglsubgrp(gl_subgrp ?: gl_subgrp): string | undefined {
    return gl_subgrp ? gl_subgrp.name : undefined;
  }

  autocompleteglsubgrpScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompletegl_subgrpauto &&
        this.autocompleteTrigger &&
        this.matAutocompletegl_subgrpauto.panel
      ) {
        fromEvent(this.matAutocompletegl_subgrpauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletegl_subgrpauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletegl_subgrpauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletegl_subgrpauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletegl_subgrpauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_subgrp_dropdown(this.glsubgrpinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.glsubgrp_data = this.glsubgrp_data.concat(datas);
                    if (this.glsubgrp_data.length >= 0) {
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
  save_glsubgrp(gl_subgrp,editview){
    if(gl_subgrp.glsubgrpgl_no==''){
      this.toastr.warning('', 'Please Fill The GL-Group Number', { timeOut: 1500 });
      return false;
    }
    if(gl_subgrp.glsubgrp==''){
      this.toastr.warning('', 'Please Select GL-Sub Group Group', { timeOut: 1500 });

      return false;
    }  
    if(gl_subgrp.description==''){
      this.toastr.warning('', 'Please Fill The Description', { timeOut: 1500 });

      return false;
    }
    let gl_subgrp_parm
    if(editview==1){
      gl_subgrp_parm={
        "gl_no":gl_subgrp.glsubgrpgl_no,
        "description":gl_subgrp.description,
        "head_group":gl_subgrp.glsubgrp.id,
        "code":0,
       
      }
    }
    if(editview==2){
      gl_subgrp_parm={
        "gl_no":gl_subgrp.glsubgrpgl_no,
        "description":gl_subgrp.description,
        "head_group":gl_subgrp.glsubgrp.id,
        "id":this.glsubgrp_id
      }
     }
        
    this.dataService.set_gl_subgroup(gl_subgrp_parm)
      .subscribe((results: any[]) => {

     this.SpinnerService.hide();

      if (results['status'] == 'success') {
        this.closepop.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.success("",results['message'],{timeOut:1500});
        this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
        this.pprglsubgrpsource.controls['glsubgrp'].reset('')
        this.pprglsubgrpsource.controls['description'].reset('')
   
    this.gl_subgrp_summary_search(this.gl_sub_groupsummary.value)



      }else{
        this.closepop.nativeElement.click();
        // this.closepopedit.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:1500}); 
        this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
        this.pprglsubgrpsource.controls['glsubgrp'].reset('')
        this.pprglsubgrpsource.controls['description'].reset('')
    this.gl_subgrp_summary_search(this.gl_sub_groupsummary.value)



      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  editviewgl_subgrp(glsubgrp_val){
    console.log(glsubgrp_val)
    this.glsubgrp_id=glsubgrp_val.id
    this.pprglsubgrpsource.patchValue({
      glsubgrpgl_no:glsubgrp_val.gl_no,
      glsubgrp:glsubgrp_val.glsubgrp,
      
      description:glsubgrp_val.description
    })
  }
}
