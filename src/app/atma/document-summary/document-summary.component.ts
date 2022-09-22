import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';
import {AtmaService} from '../atma.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-document-summary',
  templateUrl: './document-summary.component.html',
  styleUrls: ['./document-summary.component.scss']
})
export class DocumentSummaryComponent implements OnInit {
  documentList:Array<any>
  has_next = false;
  has_previous = false;
  vendorId:number;
  documentpage: number = 1;
  presentpage:number = 1;
  currentpage:number =1;
  pageSize = 10;

  constructor( private notification:NotificationService,private router:Router
    ,private atmaservice:AtmaService,private shareservice:ShareService) { }

  ngOnInit(): void {
    let data: any = this.shareservice.vendorView.value;
    this.vendorId = data.id
    this.getdocumentsummary(); 
  }
  getdocumentsummary(pageNumber = 1,pageSize=10){
    this.atmaservice.getdocumentsummaryy (this.vendorId,pageNumber,pageSize)
    .subscribe((result)=> {
      console.log("document",result)
      let datass =result['data'];
      let datapagination = result["pagination"];
      this.documentList =datass;
      console.log("document",this.documentList)
      if (this.documentList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.documentpage = datapagination.index;
      }
      
    })
   
    }

    deletedocument(data){
      let value = data.id
      console.log("deletelanlord", value)
      this.atmaservice.deletedocumentform(value,this.vendorId)
      .subscribe(result =>  {
       this.notification.showSuccess("Successfully deleted....")
       this.getdocumentsummary();
       return true
  
      })
    
    }

nextClick () {
    
  if (this.has_next === true) {
    this.getdocumentsummary(this.documentpage + 1,10)
  
  }
  }
  
previousClick() {

  if (this.has_previous === true) {
    this.getdocumentsummary(this.documentpage - 1,10)
    
  }
  }
  
  documentEdit(data:any){

   

      console.log("doc",data)
      this.shareservice.documentEdit.next(data)
      this.router.navigateByUrl('/atma/documentedit',data)
      return data;
  }

}

  


