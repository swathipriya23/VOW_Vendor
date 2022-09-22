import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { ReportService } from '../report.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-queryscreen',
  templateUrl: './queryscreen.component.html',
  styleUrls: ['./queryscreen.component.scss']
})
export class QueryscreenComponent implements OnInit {
  @ViewChild('tablefinaldata') tabledta:ElementRef;
  queryForm:any=FormGroup;
  isLoading:boolean=false;
  shhemaList:Array<any>=[];
  TableList:Array<any>=[];
  columnList:Array<any>=[];
  wherecolumnList:Array<any>=[];
  conwherecolumnList:Array<any>=[];
  schemavalue:any;
  tablevalue:any;
  columnvalue:any;
  tablecolumnlist:Array<any>=[];
  tabledata:Array<any>=[];
  constructor(private fb:FormBuilder,private reportservice:ReportService,private spinner:NgxSpinnerService,private notifications:NotificationService) { }

  ngOnInit(): void {
    this.queryForm=this.fb.group({
      'schema':new FormControl(''),
      'table':new FormControl(''),
      'columns':new FormControl(''),
      'wherevalue':new FormControl(''),
      'wherevalues':new FormControl(''),
      'condition':new FormControl(''),
      'columnwhere':new FormControl(''),
      'columnvalue':new FormControl(''),
      'selectquery':new FormControl('select *')
    });
    this.queryForm.get('schema').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.reportservice.getschemalist(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    ).subscribe((results: any[]) => {
      this.shhemaList = results["data"];
    });
    // this.queryForm.get('table').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;

    //   }),
    //   switchMap(value => this.reportservice.gettablelist(value)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // ).subscribe((results: any[]) => {
    //   this.TableList = results["data"];
    // });
    // this.queryForm.get('columns').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;

    //   }),
    //   switchMap(value => this.reportservice.getcolumnList('',value)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // ).subscribe((results: any[]) => {
    //   this.columnList = results["data"];
    // });
  }
  gettablelistdata(){
    if(this.schemavalue ==undefined || this.schemavalue=='' || this.schemavalue==null ){
      this.notifications.showWarning('Please Select The Schema;');
      return false;
    }
    this.queryForm.get('table').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.reportservice.gettablelist(this.schemavalue,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    ).subscribe((results: any[]) => {
      this.TableList = results["data"];
    });
  }
  getcolumnslistdata(){
    if(this.schemavalue ==undefined || this.schemavalue=='' || this.schemavalue==null ){
      this.notifications.showWarning('Please Select The Schema Name;');
      return false;
    }
    if(this.tablevalue ==undefined || this.tablevalue=='' || this.tablevalue==null ){
      this.notifications.showWarning('Please Select The Table Name;');
      return false;
    }
    this.queryForm.get('columns').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.reportservice.getcolumnList(this.schemavalue,this.tablevalue,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    ).subscribe((results: any[]) => {
      this.columnList = results["data"];
    });
  }
  getcolumnslistdata_con(){
    if(this.schemavalue ==undefined || this.schemavalue=='' || this.schemavalue==null ){
      this.notifications.showWarning('Please Select The Schema Name;');
      return false;
    }
    if(this.tablevalue ==undefined || this.tablevalue=='' || this.tablevalue==null ){
      this.notifications.showWarning('Please Select The Table Name;');
      return false;
    }
    this.queryForm.get('columnwhere').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.reportservice.getcolumnList(this.schemavalue,this.tablevalue,value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    ).subscribe((results: any[]) => {
      this.conwherecolumnList = results["data"];
    });
  }
  schemaselect(d:any){
    this.schemavalue=d['db'];
    let strdata:any='select * from '+d['db'];
    this.queryForm.get('selectquery').patchValue(strdata);
  }
  tableselect(d:any){
    this.tablevalue=d['table'];
    let strdata:any='select * from '+ this.schemavalue+'.'+d['table'];
    this.queryForm.get('selectquery').patchValue(strdata);
  }
  columnselect(d:any){
    this.columnvalue=d['columns'];
    let strdata:any='select * from '+ this.schemavalue+'.'+this.tablevalue+' where '+d['columns'];
    this.queryForm.get('selectquery').patchValue(strdata);
  }
  executequerydata(){

  }
  wherecolumnselect(data:any){
    if(this.queryForm.get('wherevalue').value ==undefined || this.queryForm.get('wherevalue').value ==null || this.queryForm.get('wherevalue').value=='None'){
      this.notifications.showWarning('Please Select The Condition:');
      return false;
    }
    // let strdata:any='select * from '+ this.schemavalue+'.'+this.tablevalue+' where '+this.columnvalue;
    let strdata:any=this.queryForm.get('selectquery').value +" " + this.queryForm.get('wherevalue').value + " "+data['columns'];
    this.queryForm.get('selectquery').patchValue(strdata);
  }
  queryexecutedata(){
    this.tablecolumnlist=[];
    this.tabledata=[];
    const array = ["create", "update", "alter", "trigger","procedure","function","delete"];
    // if(this.schemavalue ==undefined || this.schemavalue=='' || this.schemavalue==null){
    //   this.notifications.showWarning('Please Select The Schema;');
    //   return false;
    // }
    // if(this.tablevalue ==undefined || this.tablevalue=='' || this.tablevalue==null){
    //   this.notifications.showWarning('Please Select The Table Value;');
    //   return false;
    // }
    let strinddata:string=this.queryForm.get('selectquery').value;
    for(let i of array){
      if(strinddata.includes(i)){
        this.notifications.showWarning(i+':Keyword Not Aloowed');
        return false;
      };
    };
    console.log(this.queryForm.get('selectquery').value);
    let data:any={
      "query":String(this.queryForm.get('selectquery').value),
      // "action":"select",
      //   "database_name":this.schemavalue,
      //   "table_name":this.tablevalue,
      //   "column_name":this.columnvalue,"column_value":this.queryForm.get('wherevalue').value?this.queryForm.get('wherevalue').value:''
    };
    this.spinner.show();
    this.reportservice.getquerydata(data).subscribe(result=>{
      this.spinner.hide();
      if(result['code'] !=undefined && result['code']!=null){
        this.tablecolumnlist=[];
        this.tabledata=[];
        this.notifications.showError(result['code']);
        this.notifications.showError(result['description']);
      }
      else{
        for(let [i,j] of Object.entries(result[0])){
          this.tablecolumnlist.push(i);
         }
         this.tablecolumnlist.sort();
          this.tabledata=result;
      }
      // this.tablecolumnlist=result[0];
     
    },
    (error)=>{
      this.spinner.hide();
      this.tablecolumnlist=[];
        this.tabledata=[];
    }
    );
    
  }
  downloadJson(){
    var sJson = JSON.stringify(this.tabledata);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', "data.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
}
  downloadasexcel(){
    if(this.tabledata.length==0){
      this.notifications.showWarning('No Records in Tables;');
      return false;
    }
    this.spinner.show();
    let element = document.getElementById('datatable') as HTMLTableElement;
    element.insertRow(0);
    element.insertRow(0);
    // let myNewData:string[][] = [['','','',' Daily Statement Of Sources And Uses (DSS) Report','',''],['','','','','','','','','Amount In Corose']];
    let myNewData:string[][] = [['','','',' Query Data of Excel','',''],['','','','','','','','']];

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    XLSX.utils.sheet_add_aoa(ws, myNewData);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // const newworkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb,'Queydata.xlsx');
    this.spinner.hide();
  }
  schemavalidate(event:any){
    this.queryForm.get('table').reset('');
    this.queryForm.get('columns').reset('');
    this.queryForm.get('selectquery').reset('');
    this.tablevalue='';
    this.columnvalue='';
  }
  tablevalidate(event:any){
    if(this.queryForm.get('schema').value==undefined ||this.queryForm.get('schema').value=='' ||  this.queryForm.get('schema').value==null ||this.schemavalue==undefined || this.schemavalue=='' || this.schemavalue==null){
      this.notifications.showWarning('Please Select The Schema');
      return false;
    }
    this.tablevalue='';
    this.columnvalue='';
  }
  columnvalidate(event:any){
    if(this.queryForm.get('schema').value==undefined || this.queryForm.get('schema').value=='' || this.queryForm.get('schema').value==null ||this.schemavalue==undefined || this.schemavalue=='' || this.schemavalue==null){
      this.notifications.showWarning('Please Select The Schema');
      return false;
    }
    if(this.queryForm.get('table').value==undefined || this.queryForm.get('table').value=='' || this.queryForm.get('table').value==null || this.tablevalue==undefined || this.tablevalue=='' || this.tablevalue==null){
      this.notifications.showWarning('Please Select The Table');
      this.tablevalue='';
      return false;
    }
    this.columnvalue='';
  }
  columnvaluevalidate(event:any){
    if(this.queryForm.get('schema').value==undefined || this.queryForm.get('schema').value=='' || this.queryForm.get('schema').value==null ||this.schemavalue==undefined || this.schemavalue=='' || this.schemavalue==null){
      this.notifications.showWarning('Please Select The Schema');
      return false;
    }
    if(this.queryForm.get('table').value==undefined || this.queryForm.get('table').value=='' || this.queryForm.get('table').value==null || this.tablevalue==undefined || this.tablevalue=='' || this.tablevalue==null){
      this.notifications.showWarning('Please Select The Table');
      this.tablevalue='';
      return false;
    }
    if(this.queryForm.get('columns').value==undefined || this.queryForm.get('columns').value=='' || this.queryForm.get('columns').value==null || this.columnvalue==undefined || this.columnvalue=='' || this.columnvalue==null){
      this.notifications.showWarning('Please Select The Columns');
      this.columnvalue='';
      return false;
    }
    let strdata:any='select * from '+ this.schemavalue+'.'+this.tablevalue+' where '+this.columnvalue+' '+'like '+"'%"+this.queryForm.get('wherevalue').value+"%'";
    this.queryForm.get('selectquery').patchValue(strdata);
  }
  columnvaluevalidate_con(){
    if(this.queryForm.get('schema').value==undefined || this.queryForm.get('schema').value=='' || this.queryForm.get('schema').value==null ||this.schemavalue==undefined || this.schemavalue=='' || this.schemavalue==null){
      this.notifications.showWarning('Please Select The Schema');
      return false;
    }
    if(this.queryForm.get('table').value==undefined || this.queryForm.get('table').value=='' || this.queryForm.get('table').value==null || this.tablevalue==undefined || this.tablevalue=='' || this.tablevalue==null){
      this.notifications.showWarning('Please Select The Table');
      this.tablevalue='';
      return false;
    }
    if(this.queryForm.get('columns').value==undefined || this.queryForm.get('columns').value=='' || this.queryForm.get('columns').value==null || this.columnvalue==undefined || this.columnvalue=='' || this.columnvalue==null){
      this.notifications.showWarning('Please Select The Columns');
      this.columnvalue='';
      return false;
    }
    if(this.queryForm.get('wherevalue').value==undefined || this.queryForm.get('wherevalue').value =='None' || this.queryForm.get('wherevalue').value=='' || this.queryForm.get('wherevalue').value==null || this.columnvalue==undefined || this.columnvalue=='' || this.columnvalue==null){
      this.notifications.showWarning('Please Select The Condition');
      this.columnvalue='';
      return false;
    }
    // let strdata:any='select * from '+ this.schemavalue+'.'+this.tablevalue+' where '+this.columnvalue+' '+'like '+"'%"+this.queryForm.get('wherevalue').value+"%'";
    // this.queryForm.get('selectquery').patchValue(strdata);
  }
  wherevalueget(){
    if(this.queryForm.get('schema').value==undefined || this.queryForm.get('schema').value=='' || this.queryForm.get('schema').value==null ||this.schemavalue==undefined || this.schemavalue=='' || this.schemavalue==null){
      this.notifications.showWarning('Please Select The Schema');
      return false;
    }
    if(this.queryForm.get('table').value==undefined || this.queryForm.get('table').value=='' || this.queryForm.get('table').value==null || this.tablevalue==undefined || this.tablevalue=='' || this.tablevalue==null){
      this.notifications.showWarning('Please Select The Table');
      this.tablevalue='';
      return false;
    }
    if(this.queryForm.get('columns').value==undefined || this.queryForm.get('columns').value=='' || this.queryForm.get('columns').value==null || this.columnvalue==undefined || this.columnvalue=='' || this.columnvalue==null){
      this.notifications.showWarning('Please Select The Columns');
      this.columnvalue='';
      return false;
    }
    if(this.queryForm.get('wherevalue').value==undefined || this.queryForm.get('wherevalue').value =='None' || this.queryForm.get('wherevalue').value=='' || this.queryForm.get('wherevalue').value==null || this.columnvalue==undefined || this.columnvalue=='' || this.columnvalue==null){
      this.notifications.showWarning('Please Select The Condition');
      this.columnvalue='';
      return false;
    }
    if(this.queryForm.get('columnwhere').value==undefined || this.queryForm.get('columnwhere').value=='' || this.queryForm.get('columnwhere').value==null || this.columnvalue==undefined || this.columnvalue=='' || this.columnvalue==null){
      this.notifications.showWarning('Please Select The Condition');
      this.columnvalue='';
      return false;
    }
    let data='select * from '+ this.schemavalue+'.'+this.tablevalue+' where '+this.columnvalue;
    // let strdata:any=this.queryForm.get('selectquery').value+' '+ ' like '+"'%"+this.queryForm.get('columnvalue').value +"%'";
    let strdata:any='select * from '+ this.schemavalue+'.'+this.tablevalue+' where '+this.columnvalue+' '+'like '+"'%"+this.queryForm.get('wherevalue').value+"%' "+this.queryForm.get('wherevalues').value+" "+this.queryForm.get('columnwhere').value+" like "+ "'%"+this.queryForm.get('columnvalue').value+"%'";
    this.queryForm.get('selectquery').patchValue(strdata);
  }
  resetdata(){
    this.queryForm.reset('');
    this.tablecolumnlist=[];
    this.tabledata=[];
  }
}
