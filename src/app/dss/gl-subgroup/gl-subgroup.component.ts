import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DssService } from '../dss.service';
import { ErrorhandlingService } from '../errorhandling.service';

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
  identificationSize=10
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
  gl_subgroup:FormGroup;
  glsubgroups:FormArray
  gl_subgrp_pram: { head_group: any; gl_no: any; };
  
  constructor(private errorHandler: ErrorhandlingService,  private dataService: DssService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }


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
    this.gl_subgroup=this.formBuilder.group({
      glsubgroups:new FormArray([this.gl_subgroupadd()])
    })
    
    this.gl_subgrp_summary_search(this.gl_sub_groupsummary.value)
  }
  gl_subgroupadd(){
    let gl=new FormGroup({
      glstatus:new FormControl(2),
      glid:new FormControl(''),
      glcode:new FormControl(''),
      glname:new FormControl(''),
      isEditable: new FormControl(false),
      glsubgrp:new FormControl(''),
      gldescription:new FormControl('')
    }) 
    return gl;
  }
  gl_subgroupnewrowAdd(){
    const form = <FormArray> this.gl_subgroup.get('glsubgroups')
    for(let valsource of form.value){
      console.log("edit",valsource.isEditable)
      if(valsource.isEditable==false){
        console.log(valsource.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
    form.insert(0, this.gl_subgroupadd());
  
  
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

  gl_subgrp_summary_clear(){
    this.gl_sub_groupsummary.controls['gl_subgrp'].reset('')
    this.gl_sub_groupsummary.controls['subgrp'].reset('')
    
  }
  gl_subgrp_summary_search(gl_subgrp_data,pageNumber=1){
    if((gl_subgrp_data.subgrp=='')||(gl_subgrp_data.subgrp==undefined)||(gl_subgrp_data.subgrp==null)){
      gl_subgrp_data.head_group=''
  
    }else{
      gl_subgrp_data.head_group=gl_subgrp_data.subgrp.id    
    }
    if((gl_subgrp_data.gl_subgrp=='')||(gl_subgrp_data.gl_subgrp==undefined)||(gl_subgrp_data.gl_subgrp==null)){
      gl_subgrp_data.gl_no=''
  
    }else{
      gl_subgrp_data.gl_no=gl_subgrp_data.gl_subgrp.name    
    }
   
    this.gl_subgrp_pram={
      "head_group":gl_subgrp_data.head_group,
      "gl_no":gl_subgrp_data.gl_no,
       
    }
    this.SpinnerService.show()
    this.dataService.summary_glsubgrp_view(this.gl_subgrp_pram,pageNumber).subscribe((results:any)=>{
    this.SpinnerService.hide()

      this.gl_subgrp_summary=results['data']
      let dataPagination = results['pagination'];
      
      if (this.gl_subgrp_summary.length >= 0) {
        console.log("val")
        this.gl_subgroup = this.formBuilder.group({
          glsubgroups: this.formBuilder.array(
            this.gl_subgrp_summary.map(val =>
              this.formBuilder.group({
                glstatus:new FormControl(val.status),
                glid:new FormControl(val.id),
                glcode:new FormControl(''),
                glname:new FormControl(val.gl_no),
                isEditable: new FormControl(true),
                head:new FormControl(val.head_group_id.name),
                source:new FormControl(val.source_id.name),
                glsubgrp:new FormControl(val.sub_group_id),
                gldescription:new FormControl(val.description)
              })
            )
          ) 
        });
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
  previousClick(){
    if (this.has_previous === true) {
         
      this.currentpage = this.presentpage + 1
      this.gl_subgrp_summary_search(this.gl_subgrp_pram,this.presentpage - 1)
    }
  }
  nextClick(){
    if (this.has_next === true) {
         
      this.currentpage = this.presentpage + 1
      this.gl_subgrp_summary_search(this.gl_subgrp_pram,this.presentpage + 1)
    }
  }
  
  Cancelglsubgrp(dssform, i) {
    const control = <FormArray>dssform.controls['glsubgroups'];
    console.log(control)
    if(dssform.value.glsubgroups[i].sourcecode  != ""){
      console.log('true')
      dssform.get('glsubgroups')
      .at(i)
      .get('isEditable')
      .patchValue(true);
      console.log("dss 1=>",this.gl_subgroup.controls.glsubgroups['controls'])
  
    }  if(dssform.value.glsubgroups[i].sourcecode  == "" || dssform.value.glsubgroups[i].sourcecode == undefined  || dssform.value.glsubgroups[i].sourcecode ==null)
      {
      const control = <FormArray>dssform.controls['glsubgroups'];
      control.removeAt(i)   
      console.log('false')
  
    }
     
  }
  EditSource(gledit, i) {
    console.log("gledit=>",gledit)
    gledit.get('glsubgroups')
      .at(i)
      .get('isEditable')
      .patchValue(false);
  
     
  }
saveglsubgrp(gl_subgroup,i){
  
  let gl_subgrp=gl_subgroup.value.glsubgroups[i]

  if(gl_subgrp.glname=='' || (typeof gl_subgrp.glname!='number') ){
    this.toastr.warning('', 'Please Fill The GL-Group Number', { timeOut: 1500 });
    return false;
  }
  if(gl_subgrp.glsubgrp==''){
    this.toastr.warning('', 'Please Select Head Group', { timeOut: 1500 });

    return false;
  }  
  if(gl_subgrp.gldescription==''){
    this.toastr.warning('', 'Please Fill The Description', { timeOut: 1500 });

    return false;
  }
  let gl_subgrp_parm
  if(gl_subgrp.glid==''){
    gl_subgrp_parm={
      "gl_no":gl_subgrp.glname,
      "description":gl_subgrp.gldescription,
      "head_group":gl_subgrp.glsubgrp.id,
      "code":0,
     
    }
  }
  if(gl_subgrp.glid !=''){
    gl_subgrp_parm={
      "gl_no":gl_subgrp.glname,
      "description":gl_subgrp.gldescription,
      "head_group":gl_subgrp.glsubgrp.id,
      "id":gl_subgrp.glid
    }
   }
   var glsubgrpconfirm=window.confirm("Do You Want To Save And Continue?")
   console.log(glsubgrpconfirm)
   if(!glsubgrpconfirm){
     console.log("True")
     return false;
   }else{
   this.SpinnerService.show();
      
  this.dataService.set_gl_subgroup(gl_subgrp_parm)
    .subscribe((results: any[]) => {

   this.SpinnerService.hide();
   this.gl_subgrp_pram={
    head_group:'',
    gl_no:''
   }
    if (results['status'] == 'success') {
      this.toastr.success("",results['message'],{timeOut:1500});
      this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
      this.pprglsubgrpsource.controls['glsubgrp'].reset('')
      this.pprglsubgrpsource.controls['description'].reset('')
      gl_subgroup.get('glsubgroups')
      .at(i)
      .get('isEditable')
      .patchValue(true);
      this.gl_subgrp_summary_search(this.gl_subgrp_pram)



    }else{
      if(results['code']=='DUPLICATE ENTRY'){
      this.toastr.warning("",'GL-Sub Group already exist',{timeOut:1500}); 
      }else{
        this.toastr.warning("",results['description'],{timeOut:1500}); 
      }
      this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
      this.pprglsubgrpsource.controls['glsubgrp'].reset('')
      this.pprglsubgrpsource.controls['description'].reset('')
      this.gl_subgrp_summary_search(this.gl_subgrp_pram)



    }
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
}
deleteglsubgrp(deletegl,i){
  var glsubconfirm=window.confirm("Are You Sure Change The Status?")
  console.log(glsubconfirm)
  if(!glsubconfirm){
    return false;
  }else{
    
    let id=deletegl.value.glid
    let status=deletegl.value.glstatus
    let sourcestatus
    if(status==0){
      sourcestatus=1
    }else{
      sourcestatus=0
    }
    this.SpinnerService.show()
    this.gl_subgrp_pram={
      head_group:'',
      gl_no:''
     }
    this.dataService.deletegl(id,sourcestatus).subscribe((results) => {
      this.SpinnerService.hide()
      if(results.status=='success'){
        if(sourcestatus==1){
          this.toastr.success("","Source Active  Succesfully",{timeOut:1500})
          this.gl_subgrp_summary_search(this.gl_subgrp_pram)
        }else{
          this.toastr.success("","Source In-Active Source Succesfully",{timeOut:1500})
          this.gl_subgrp_summary_search(this.gl_subgrp_pram)
        }
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
}
  glsubgrbdropdown(i) {
    let prokeyvalue: String = "";
    this.getgl_subgrb_dropdown(prokeyvalue);
    var arrayControl = this.gl_subgroup.get('glsubgroups') as FormArray;
    let item = arrayControl.at(i);
   item.get('glsubgrp').valueChanges.pipe(
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
     this.gl_subgrp_pram={
      head_group:'',
      gl_no:''
     }
      if (results['status'] == 'success') {
        this.closepop.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.success("",results['message'],{timeOut:1500});
        this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
        this.pprglsubgrpsource.controls['glsubgrp'].reset('')
        this.pprglsubgrpsource.controls['description'].reset('')
   
    this.gl_subgrp_summary_search(this.gl_subgrp_pram)



      }else{
        this.closepop.nativeElement.click();
        // this.closepopedit.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:1500}); 
        this.pprglsubgrpsource.controls['glsubgrpgl_no'].reset('')
        this.pprglsubgrpsource.controls['glsubgrp'].reset('')
        this.pprglsubgrpsource.controls['description'].reset('')
    this.gl_subgrp_summary_search(this.gl_subgrp_pram)



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
