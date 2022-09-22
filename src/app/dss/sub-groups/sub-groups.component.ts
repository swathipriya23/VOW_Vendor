import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PprService } from 'src/app/ppr/ppr.service';
import { DssService } from '../dss.service';
import { ErrorhandlingService } from '../errorhandling.service';

export interface headgrpname {
  code: string,
  id:number,
  name:string
}
export interface subgrpname {
  code: string,
  id:number,
  name:string
}
@Component({
  selector: 'app-sub-groups',
  templateUrl: './sub-groups.component.html',
  styleUrls: ['./sub-groups.component.scss']
})
export class SubGroupsComponent implements OnInit {
  sub_groupsummary:FormGroup
  pprsubgrpsource:FormGroup
  isLoading: boolean;
  headgrp_data: any;
  subgrp_data: any;
  subgrp_summary: any;
  has_next: any;
  has_previous: any;
  presentpage: any;
  isSummaryPagination: boolean;
  currentpage: any;
  identificationSize=10
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('subgrpauto') matAutocompletesubgrp: MatAutocomplete;
  @ViewChild('subgrpinput') subgrpinput: any;
  @ViewChild('headauto') matAutocompleteheadauto: MatAutocomplete;
  @ViewChild('headaddauto') matAutocompleteheadtoauto: MatAutocomplete;
  @ViewChild('headgrpinput') headgrpinput: any;
  @ViewChild('closepop') closepopadd:any;
  @ViewChild('closepopedit') closepopedit:any
  headgrpdata: any;
  code: any;
  gl_no: any;
  subgroup:FormGroup
  subgroups:FormArray
  subgrp_pram: { name: any; code: any; head_group: any; gl_no: string; };
  constructor(private errorHandler: ErrorhandlingService,  private dataService: DssService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }


  ngOnInit(): void {
    this.sub_groupsummary=this.formBuilder.group({
      subgrp:[''],
      headgrp:['']
    })
    this.pprsubgrpsource=this.formBuilder.group({
      subgrpname:[''],
      headgrp_add:[''],
      description:['']
    })
    this.subgroup=this.formBuilder.group({
      subgroups:new FormArray([this.subgrpcreated()])
    })
    this.subgrp_pram={
      "name":'',
      "code":'',
      "head_group":'',
      "gl_no":''
    }
    
    this.subgrp_summary_search(this.subgrp_pram)
  }
  subgrpcreated(){
    let subgrp=new FormGroup({
      subgrpstatus:new FormControl(2),
      subgrpid:new FormControl(''),
      subgrpcode:new FormControl(''),
      subgrpname:new FormControl(''),
      isEditable: new FormControl(false),
      headgrp:new FormControl(''),
      source:new FormControl(''),
      gl_no:new FormControl(''),
      subgrpdescription:new FormControl('')
    }) 
    return subgrp;
  }
  subgrp_dropdown() {
    let prokeyvalue: String = "";
    this.getsubgrp_dropdown(prokeyvalue);
    this.sub_groupsummary.get('subgrp').valueChanges.pipe(
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



  private getsubgrp_dropdown(prokeyvalue) {
    this.dataService.get_subgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subgrp_data = datas;

      })
  }


  public displayfnsubgrp(head?: subgrpname): string | undefined {
    return head ? head.name : undefined;
  }
  
  autocompletesubgrpScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompletesubgrp &&
        this.autocompleteTrigger &&
        this.matAutocompletesubgrp.panel
      ) {
        fromEvent(this.matAutocompletesubgrp.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletesubgrp.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletesubgrp.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletesubgrp.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletesubgrp.panel.nativeElement.clientHeight;
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

  headgrp_dropdown() {
    let prokeyvalue: String = "";
    this.getheadgrp_dropdown(prokeyvalue);
    this.sub_groupsummary.get('headgrp').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_headgrp_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.headgrp_data = datas;


      })
  }



  private getheadgrp_dropdown(prokeyvalue) {
    this.dataService.get_headgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.headgrp_data = datas;

      })
  }


  public displayfnheadgrp(head?: headgrpname): string | undefined {
    return head ? head.name : undefined;
  }

  autocompleteheadgrpScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompleteheadauto &&
        this.autocompleteTrigger &&
        this.matAutocompleteheadauto.panel
      ) {
        fromEvent(this.matAutocompleteheadauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteheadauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteheadauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteheadauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteheadauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_headgrp_dropdown(this.headgrpinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.headgrp_data = this.headgrp_data.concat(datas);
                    if (this.headgrp_data.length >= 0) {
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
  subgrp_summary_clear(){
    this.sub_groupsummary.controls['subgrp'].reset('');
    this.sub_groupsummary.controls['headgrp'].reset('');
  }
  subgrp_summary_search(subgrp_data,pageNumber=1){
    if((subgrp_data.subgrp=='')||(subgrp_data.subgrp==undefined)||(subgrp_data.subgrp==null)){
      subgrp_data.name=''
      subgrp_data.code=''
    }else{
      subgrp_data.name=subgrp_data.subgrp.name
      subgrp_data.code=subgrp_data.subgrp.code
    }
    if((subgrp_data.headgrp=='')||(subgrp_data.headgrp==undefined)||(subgrp_data.headgrp==null)){
      subgrp_data.id=''
    }else{
      subgrp_data.id=subgrp_data.headgrp.id
    }
    this.subgrp_pram={
      "name":subgrp_data.name,
      "code":subgrp_data.code,
      "head_group":subgrp_data.id,
      "gl_no":''
    }
    this.SpinnerService.show()
    this.dataService.summary_subgrp_view(this.subgrp_pram,pageNumber).subscribe((results:any)=>{
    this.SpinnerService.hide()

      this.subgrp_summary=results['data']
      let dataPagination = results['pagination'];
      
      if (this.subgrp_summary.length >= 0) {
        console.log("val")
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
        this.subgroup = this.formBuilder.group({
          subgroups: this.formBuilder.array(
            this.subgrp_summary.map(val =>
              this.formBuilder.group({
                subgrpstatus:new FormControl(val.status),
                subgrpid:new FormControl(val.id),
                subgrpcode:new FormControl(val.code),
                subgrpname:new FormControl(val.name),
                isEditable: new FormControl(true),
                source:new FormControl(val.source_id),
                headgrp:new FormControl(val.head_group_id),
                subgrpdescription:new FormControl(val.description),
                gl_no:new FormControl(val.gl_no)
              })
            )
          ) 
        });
      } if (this.subgrp_summary.length <= 0) {
        console.log("val1")

        this.isSummaryPagination = false;
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  previousClick(){
    if (this.has_previous === true) {
         
      this.currentpage = this.presentpage + 1
      this.subgrp_summary_search(this.subgrp_pram,this.presentpage - 1)
    }
  }
  nextClick(){
    if (this.has_next === true) {
         
      this.currentpage = this.presentpage + 1
      this.subgrp_summary_search(this.subgrp_pram,this.presentpage + 1)
    }
  }
  subgroupnewrowAdd(){
    
    const form = <FormArray> this.subgroup.get('subgroups')
    for(let valsource of form.value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:2000})
        return false;
      }
    }
    form.insert(0, this.subgrpcreated());
  }
  savesubgrp(subgrp,i){
  let subgrp_val=subgrp.value.subgroups[i]
    if(subgrp_val.headgrp=='' || (typeof subgrp_val.headgrp!='object')){
      this.toastr.warning('', 'Please Select The Head Group', { timeOut: 2000 });
      return false;
    }
    if(subgrp_val.subgrpname=='' || (typeof subgrp_val.subgrpname!='string')){
      this.toastr.warning('', 'Please Fill The Sup Group Name', { timeOut: 2000 });
      return false;
    }
    console.log(subgrp_val)
    if(subgrp_val.subgrpdescription=='' ){
      this.toastr.warning('', 'Please Fill The Description', { timeOut: 2000 });
      return false;
    }  
    
    let headval
    if(subgrp_val.subgrpcode==''){
      headval={
        "name":subgrp_val.subgrpname,
        "description":subgrp_val.subgrpdescription,
        "head_group":subgrp_val.headgrp.id,
        "code":0,
        "gl_no":123
      }
    }
    if(subgrp_val.subgrpcode!=''){
      headval={
        "name":subgrp_val.subgrpname,
        "description":subgrp_val.subgrpdescription,
        "head_group":subgrp_val.headgrp.id,
        "id":subgrp_val.subgrpid,
        "gl_no":subgrp_val.gl_no
      }
     }
     var sourceconfirm=window.confirm("Do You Want To Save And Continue?")
     console.log(sourceconfirm)
     if(!sourceconfirm){
       console.log("True")
       return false;
     }else{ 
      this.SpinnerService.show()
    this.dataService.set_subgrp(headval)
      .subscribe((results: any[]) => {

     this.SpinnerService.hide();
     this.subgrp_pram={
      "name":'',
      "code":'',
      "head_group":'',
      "gl_no":''
    }
      if (results['status'] == 'success') {
        // if(subgrp_val.subgrpcode !=''){
        //   this.toastr.success("",'Successfully Updated',{timeOut:1500});
        // }else{
        //  this.toastr.warning("",results['message'],{timeOut:1500}); 
        // }
        this.toastr.success("",'Successfully Updated',{timeOut:2000});
        this.pprsubgrpsource.controls['subgrpname'].reset('')
        this.pprsubgrpsource.controls['headgrp_add'].reset('')
        this.pprsubgrpsource.controls['description'].reset('')
        this.code='',
        this.gl_no=''
        this.subgrp_summary_clear()
        this.subgrp_summary_search(this.subgrp_pram)
      }else{
        
        this.toastr.warning("",results['message'],{timeOut:2000}); 
        this.pprsubgrpsource.controls['subgrpname'].reset('')
        this.pprsubgrpsource.controls['headgrp_add'].reset('')
        this.pprsubgrpsource.controls['description'].reset('')
        this.code='',
        this.gl_no=''
        this.subgrp_summary_clear()
        this.subgrp_summary_search(this.subgrp_pram)
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  deletesubgroup(dssdelete,i){
    var sourceconfirm=window.confirm("Are You Sure Change The Status?")
    console.log(sourceconfirm)
    if(!sourceconfirm){
      return false;
    }else{
      
      let id=dssdelete.value.subgrpid
      let status=dssdelete.value.subgrpstatus
      let sourcestatus
      if(status==0){
        sourcestatus=1
      }else{
        sourcestatus=0
      }
      this.SpinnerService.show()
      this.dataService.deletesubgrp(id,sourcestatus).subscribe((results) => {
        this.SpinnerService.hide()
        this.subgrp_pram={
          "name":'',
          "code":'',
          "head_group":'',
          "gl_no":''
        }
        if(results.status=='success'){
          if(sourcestatus==1){
            this.toastr.success("","Source Active  Succesfully",{timeOut:1500})
            this.subgrp_summary_clear()
            this.subgrp_summary_search(this.subgrp_pram)
          }else{
            this.toastr.success("","Source In-Active Source Succesfully",{timeOut:1500})
            this.subgrp_summary_clear()
            this.subgrp_summary_search(this.subgrp_pram)
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
   }
  Cancelsubgrp(subgrpcancel,i){
    // const control = <FormArray>subgrpcancel.controls['subgroups'];
    // console.log(control)
    if(subgrpcancel.value.subgroups[i].subgrpcode  != ""){
      console.log('true')
      subgrpcancel.get('subgroups')
      .at(i)
      .get('isEditable')
      .patchValue(true);
      
  
    } else 
      {
      const control = <FormArray>subgrpcancel.controls['subgroups'];
      control.removeAt(i)   
      console.log('false')
  
    }
  }
  Editsubgrp(subgepedit,i){
    for(let valsource of subgepedit.get('subgroups').value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:2000})
        return false;
      }
    }
    subgepedit.get('subgroups')
    .at(i)
    .get('isEditable')
    .patchValue(false);
}


  clearsource(){
    this.pprsubgrpsource.controls['subgrpname'].reset('')
    this.pprsubgrpsource.controls['headgrp_add'].reset('')
    this.pprsubgrpsource.controls['description'].reset('')
  }


  headgrpadd_dropdown(ind) {
    let prokeyvalue: String = "";
    this.get_headgrp_dropdown(prokeyvalue);
    var arrayControl = this.subgroup.get('subgroups') as FormArray;
    let item = arrayControl.at(ind);
    item.get('headgrp').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_headgrp_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.headgrpdata = datas;


      })
  }



  private get_headgrp_dropdown(prokeyvalue) {
    this.dataService.get_headgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.headgrpdata = datas;

      })
  }


  public displayfnheadgrpadd(head?: headgrpname): string | undefined {
    return head ? head.name : undefined;
  }

  autocompleteheadgrpScrolladd() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1

    setTimeout(() => {
      if (
        this.matAutocompleteheadtoauto &&
        this.autocompleteTrigger &&
        this.matAutocompleteheadtoauto.panel
      ) {
        fromEvent(this.matAutocompleteheadtoauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteheadtoauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteheadtoauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteheadtoauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteheadtoauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_headgrp_dropdown(this.headgrpinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.headgrpdata = this.headgrpdata.concat(datas);
                    if (this.headgrpdata.length >= 0) {
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
  // this.pprsubgrpsource=this.formBuilder.group({
  //   sourcename:[''],
  //   headgrp_add:[''],
  //   description:['']
  // })
  save_subgrp(subgrp_val,subgrouppram){
    if(subgrp_val.subgrpname==''){
      this.toastr.warning('', 'Please Fill The Sup Group Name', { timeOut: 2000 });
      return false;
    }
    if(subgrp_val.description==''){
      this.toastr.warning('', 'Please Fill The Description', { timeOut: 2000 });
      return false;
    }  
    if(subgrp_val.headgrp_add==''){
      this.toastr.warning('', 'Please Select The Head Group', { timeOut: 2000 });
      return false;
    }
    let headval
    if(subgrouppram==1){
      headval={
        "name":subgrp_val.subgrpname,
        "description":subgrp_val.description,
        "head_group":subgrp_val.headgrp_add.id,
        "code":0,
        "gl_no":123
      }
    }
    if(subgrouppram==2){
      headval={
        "name":subgrp_val.subgrpname,
        "description":subgrp_val.description,
        "head_group":subgrp_val.headgrp_add.id,
        "id":this.code,
        "gl_no":this.gl_no
      }
     }
     var subgroupconfirm=window.confirm("Do You Want To Save And Continue?")
     console.log(subgroupconfirm)
     if(!subgroupconfirm){
       console.log("True")
       return false;
     }else{
    this.dataService.set_subgrp(headval)
      .subscribe((results: any[]) => {

     this.SpinnerService.hide();
     this.subgrp_pram={
      "name":'',
      "code":'',
      "head_group":'',
      "gl_no":''
    }
      if (results['status'] == 'success') {
        if(subgrp_val.sourcecode !=''){
          this.toastr.success("",'Successfully Updated',{timeOut:1500});
        }else{
         this.toastr.warning("",results['message'],{timeOut:1500}); 
        }
        this.toastr.success("",results['message'],{timeOut:2000});
        this.pprsubgrpsource.controls['subgrpname'].reset('')
        this.pprsubgrpsource.controls['headgrp_add'].reset('')
        this.pprsubgrpsource.controls['description'].reset('')
        this.code='',
        this.gl_no='',
        this.subgrp_summary_clear()
        this.subgrp_summary_search(this.subgrp_pram)



      }else{
        this.closepopadd.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:2000}); 
        this.pprsubgrpsource.controls['subgrpname'].reset('')
    this.pprsubgrpsource.controls['headgrp_add'].reset('')
    this.pprsubgrpsource.controls['description'].reset('')
    this.code='',
    this.gl_no='',
    this.subgrp_summary_clear()
    this.subgrp_summary_search(this.subgrp_pram)


      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  }
  editview_subgrp(subgrpsummary){
    console.log(subgrpsummary)
    this.code=subgrpsummary.id
    this.gl_no=subgrpsummary.gl_no
    this.pprsubgrpsource.patchValue({
      subgrpname:subgrpsummary.name,
      description:subgrpsummary.description,
      // source:headgrpsummary.
    })
  }
}
