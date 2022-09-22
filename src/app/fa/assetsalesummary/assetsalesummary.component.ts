import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
const isSkipLocationChange = environment.isSkipLocationChange

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface Branch {
  id: string;
  name: string;
  code:number;
}
export interface Asset{
  id:string;
  subcatname:string;
}
export interface AssetDetails{
  id:string;
  barcode:string
}
@Component({
  selector: 'app-assetsalesummary',
  templateUrl: './assetsalesummary.component.html',
  styleUrls: ['./assetsalesummary.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class AssetsalesummaryComponent implements OnInit {
  searchData: any={};
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;
  @ViewChild('closebutton2') closebutton;
  salesSummarySearch: FormGroup;
  employeeList: Array<Branch>;
  category:Array<Asset>
  assetDetails:Array<AssetDetails>
  isLoading: boolean=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  isPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  identificationData:any
  assetsalesValue: any;
  data: any;
  newAssetSalesValue: any=[];
  pdfSrc: any;
  id: any='';
  reassons:any;
  downloadUrl: string;

  constructor(private errorHandler:ErrorHandlerService,private faService:Fa3Service,private formBuilder:FormBuilder,private datePipe:DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
   
    this.salesSummarySearch = this.formBuilder.group({
      category:[''],
      // ,[RequireMatch]
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:['']
    });
    this.assetsalesapprove(1,5);
    
  }
  assetsalesapprove(pageNumber=1, pageSize=5){
    this.searchData={};
// if(this.salesSummarySearch){
  let assetsalesummarysearch=this.salesSummarySearch.value;
  if((this.salesSummarySearch.get('capdate_Value').value != null && this.salesSummarySearch.get('capdate_Value').value!= '')  ){
    var tranferdate=this.datePipe.transform(this.salesSummarySearch.get('capdate_Value').value, 'yyyy-MM-dd')
    this.searchData['capdate']=tranferdate
  }
  if(this.salesSummarySearch.get('asset_value').value!=null && this.salesSummarySearch.get('asset_value').value !=''){
      this.searchData['assetdetails_value'] = this.salesSummarySearch.get('asset_value').value;

  }
  if(this.salesSummarySearch.get('category').value !=null && this.salesSummarySearch.get('category').value!='' ){
    this.searchData['assetcat_id'] = this.salesSummarySearch.get('category').value.id;
  }
  if(this.salesSummarySearch.get('barcode').value !=null && this.salesSummarySearch.get('barcode').value!=''){
    this.searchData['barcode'] = this.salesSummarySearch.get('barcode').value;
  }
  if(this.salesSummarySearch.get('branch_name').value !=null && this.salesSummarySearch.get('branch_name').value!=''){
    this.searchData['branch_id'] = this.salesSummarySearch.get('branch_name').value.id;
  }
 
  // if(assetsalesummarysearch.barcode.barcode){
  //   console.log("true")
  //   this.searchData.barcode = assetsalesummarysearch.barcode.barcode;
  // }else{
  //   console.log("false")
  //   this.searchData.barcode = assetsalesummarysearch.barcode;

  // }
  console.log(this.salesSummarySearch.value);
// for (let i in this.searchData) {
//       if (this.searchData[i] === null || this.searchData[i] === "") {
//         delete this.searchData[i];
//       }
//     }
 
  
// }


// else{
//   this.searchData={}
// }
this.spinner.show();
    this.faService.getassetsale(pageNumber, pageSize,this.searchData)
    .subscribe(result => {
      this.spinner.hide();
      this.assetsalesValue = result['data']
      let dataPagination = result['pagination'];
      if (this.assetsalesValue.length >= 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isPagination = true;
      } if (this.assetsalesValue <= 0) {
        this.isPagination = false;
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
}
nextClick() {
  if (this.has_next === true) {

    // this.currentpage = this.presentpage + 1
    this.assetsalesapprove(this.presentpage + 1, 10)
  }

}

previousClick() {
  if (this.has_previous === true) {

    // this.currentpage = this.presentpage - 1
    this.assetsalesapprove(this.presentpage - 1, 10)
  }
}
private getasset_category(keyvalue) {
  this.faService.getAssetSearchFilter(keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.category = datas;
     console.log("datas",keyvalue)
    })
}

public displayFnAssest(Asset?: Asset): string | undefined {
  return Asset ? Asset.subcatname : undefined;
}
  asset_category(){
    let keyvalue: String = "";
      this.getasset_category(keyvalue);
      this.salesSummarySearch.get('category').valueChanges
        .pipe(
          startWith(""),
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
           
  
          }),
         
          switchMap(value => this.faService.getAssetSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.category = datas;
  
        })
  
  }


  autocompleteScrollcategory() {
    setTimeout(() => {
      if (
        this.categoryAutoComplete &&
        this.autocompleteTrigger &&
        this.categoryAutoComplete.panel
      ) {
        fromEvent(this.categoryAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.categoryAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.categoryAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.categoryAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.categoryAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.faService.getEmployeeBranchSearchFilter(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
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

// end asset _category



// branch

onFocusOutEvent(event){
  console.log(event.target.value);

}
  Branch(){
    let keyvalue: String = "";
      this.getEmployee(keyvalue);
      
      this.salesSummarySearch.get('branch_name').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
           
  
          }),
          switchMap(value => this.faService.getEmployeeBranchSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.employeeList = datas;
  
        })
  
      }
    
      private getEmployee(keyvalue) {
        this.faService.getEmployeeBranchSearchFilter(keyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.employeeList = datas;
          })
      }

      public displayFn(branch?: Branch): string | undefined {
        return branch ? branch.name : undefined;
      }
    
      
      autocompleteScroll() {
        setTimeout(() => {
          if (
            this.matAutocomplete &&
            this.autocompleteTrigger &&
            this.matAutocomplete.panel
          ) {
            fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.faService.getEmployeeBranchSearchFilter(this.BranchInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.employeeList = this.employeeList.concat(datas);
                        if (this.employeeList.length >= 0) {
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

// end branch

// assest barcode

public displayFnAssestId(AssetDetails?: AssetDetails): string | undefined {
  return AssetDetails ? AssetDetails.barcode : undefined;
}

private getassetbarcode(keyvalue) {
  this.faService.getAssetIdSearchFilter(keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.assetDetails = datas;
      // assetDetails:Array<AssetDetails>
    })
}

Assetbarcode(){
  let keyvalue: String = "";
      this.getassetbarcode(keyvalue);
      
      this.salesSummarySearch.get('barcode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            
  
          }),
          switchMap(value => this.faService.getAssetIdSearchFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.assetDetails = datas;
  
        })
  
      }

      autocompleteScrollAssetId(){
        setTimeout(() => {
          if (
            this.AssetAutoComplete &&
            this.autocompleteTrigger &&
            this.AssetAutoComplete.panel
          ) {
            fromEvent(this.AssetAutoComplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.AssetAutoComplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.AssetAutoComplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.AssetAutoComplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.AssetAutoComplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.faService.getAssetIdSearchFilter(this.AssetInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.assetDetails = this.assetDetails.concat(datas);
                        if (this.assetDetails.length >= 0) {
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


      decimalFilter(event: any) {
        const reg = /^-?\d*(\.\d{0,2})?$/;
        let input = event.target.value + String.fromCharCode(event.charCode);
     
        if (!reg.test(input)) {
            event.preventDefault();
        }
     }

     binaryData:any[]=[]
    pdfpup(pdf_id) {

     
     
     
    this.id = pdf_id.assetsaleheader_id
  
      
      this.faService.getpdfPO(this.id)
        .subscribe((data) => {      
        this.binaryData = [];
      console.log(this.binaryData)
        
        this.binaryData.push(data)
        console.log("data",data)
        console.log("binaryData",this.binaryData)
        this.downloadUrl = window.URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
        let link = document.createElement('a');
        console.log(link)
        link.href = this.downloadUrl;
        this.pdfSrc = this.downloadUrl;
        console.log("url",this.pdfSrc)
      },
      (error:HttpErrorResponse)=>{
        this.pdfSrc=undefined;
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'file');
      }
      );
      this.pdfSrc=undefined
    }

    PDfDownload(data) {
      // let id = this.getMemoIdValue(this.idValue)
      let id = data.assetsaleheader_id
      let name =  'Karur Vysya Bank'
      this.faService.fileDownloadpo(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = name + ".pdf";
          link.click();
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
          this.errorHandler.errorHandler(error,'');
        }
        );
    }

    clearSearch(){
     
      this.salesSummarySearch.controls['capdate_Value'].reset('')
      this.salesSummarySearch.controls['category'].reset('')
      this.salesSummarySearch.controls['asset_value'].reset('')
      this.salesSummarySearch.controls['barcode'].reset('')
      this.salesSummarySearch.controls['branch_name'].reset('')
      this.assetsalesapprove(1,5);
    }
    clickreason(data){
      this.reassons=data.reason;
    }
}
