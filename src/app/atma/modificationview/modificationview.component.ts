import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { Router } from '@angular/router'
import { Observable, Observer } from 'rxjs';
export interface ExampleTab {
  tab_name: string;
  tab_id: string;
}

@Component({
  selector: 'app-modificationview',
  templateUrl: './modificationview.component.html',
  styleUrls: ['./modificationview.component.scss']
})
export class ModificationviewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  asyncTabs: Observable<ExampleTab[]>;

  vendor_flag = false;
  client_flag = false;
  contractor_flag = false;
  branch_flag = false
  payment_flag = false;
  document_flag = false;
  branchtax_flag = false;
  catalouge_flag = false;
  activitydetails_flag=false;
  risk_flag = false;
  kyc_flag = false;
  activity_flag=false;
  product_flag=false;
  contract_data = [];
  document_data = [];
  risk_data = [];
  kyc_data = [];
  payment_data = [];
  branchtax_data = [];
  catalouge_data = [];
  activity_detail = [];
  activity_data = [];
  bcp_data = [];
  due_data = [];
  document_modify = false;
  vendor_data = [];
  client_data = [];
  product_data = [];
  branch_data = [];
  modificationdata: any
  contract_modify = false;
  client_modify = false;
  product_modify = false;
  branch_modify = false;
  vendorId: any
  modify_changestatus: any;

  constructor(private shareService: ShareService, private router: Router, private atmaService: AtmaService) {
    let datalist = this.shareService.vendorDATA.value
    let flag_for_RelationshipCategory = datalist.compliance_flag
    console.log("relationship category", flag_for_RelationshipCategory)
    // if(flag_for_RelationshipCategory == true){
    //   this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
    //     setTimeout(() => {
    //       observer.next([
    //         { "tab_name": "VENDOR", "tab_id": "1" },
    //         // { "tab_name": "CLIENT", "tab_id": "7" },
    //         { "tab_name": "BRANCH DETAILS", "tab_id": "6" },
    //         // { "tab_name": "CONTRACTOR", "tab_id": "8" },
    //         // { "tab_name": "PRODUCT", "tab_id": "9" },
    //         { "tab_name": "DOCUMENT", "tab_id": "10" },
    //         { "tab_name": "RISK", "tab_id":"19"},
    //         { "tab_name": "KYC", "tab_id": "20" },
    //         { "tab_name": "ACTIVITY", "tab_id": "13" },
    //         { "tab_name": "ACTIVITYDETAIL", "tab_id": "14" },
    //         { "tab_name": "CATALOG", "tab_id": "15" },
    //         { "tab_name": "PAYMENT", "tab_id": "12" },
    //         { "tab_name": "SUPPLIERTAX", "tab_id": "11" },
    //         { "tab_name": "BCP QUESTIONAIRE", "tab_id": "21" },
    //         { "tab_name": "DUE DILIGENCE", "tab_id": "22" },
            
    //       ]);
    //     }, 1000);
    //   });

    // }else {
    //   this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
    //     setTimeout(() => {
    //       observer.next([
    //         { "tab_name": "VENDOR", "tab_id": "1" },
    //         // { "tab_name": "CLIENT", "tab_id": "7" },
    //         { "tab_name": "BRANCH DETAILS", "tab_id": "6" },
    //         // { "tab_name": "CONTRACTOR", "tab_id": "8" },
    //         // { "tab_name": "PRODUCT", "tab_id": "9" },
    //         { "tab_name": "DOCUMENT", "tab_id": "10" },
    //         { "tab_name": "RISK", "tab_id":"19"},
    //         { "tab_name": "ACTIVITY", "tab_id": "13" },
    //         { "tab_name": "ACTIVITYDETAIL", "tab_id": "14" },
    //         { "tab_name": "CATALOG", "tab_id": "15" },
    //         { "tab_name": "PAYMENT", "tab_id": "12" },
    //         { "tab_name": "SUPPLIERTAX", "tab_id": "11" },
            
    //       ]);
    //     }, 1000);
    //   });

    // }

  }
  ngOnInit(): void {
    this.gettabList();
    this.getmodification_vender();
    this.modify_changestatus = 'modify_changestatus'
  }
  modify_vendor(j) {
    console.log("modify_vendor",j)
    this.vendor_flag = true;
    this.shareService.modification_data.next(j);
  }
  modify_client(j) {
    this.client_flag = true;
    this.shareService.modification_data.next(j);
  }
  modify_contract(j) {

    this.contractor_flag = true;
    this.shareService.modification_data.next(j);
  }

  modify_branch(data) {
    this.branch_flag = true;
    this.shareService.modification_data.next(data);
  }

  modify_payment(data) {
    this.payment_flag = true;
    this.shareService.modification_data.next(data);
  }
  modify_doc(data) {
    this.document_flag = true;
    this.shareService.modification_data.next(data);
  }
  modify_tax(data) {
    this.branchtax_flag = true;
    this.shareService.modification_data.next(data);
  }
  modify_cat(data){
    this.catalouge_flag = true;
    this.shareService.modification_data.next(data); 
  }
  modify_activity(data){
    this.activity_flag=true;
    this.shareService.modification_data.next(data); 
  }
  modify_activityddl(data){
    this.activitydetails_flag=true;
    this.shareService.modification_data.next(data); 
  }
  modify_risk(data){
    this.risk_flag=true;
    this.shareService.modification_data.next(data); 
  }
  modify_kyc(data){
    this.kyc_flag=true;
    this.shareService.modification_data.next(data); 
  }
  modify_product(data){
    this.product_flag=true;
    this.shareService.modification_data.next(data); 
  }
  clientCancel() {
    this.vendor_flag = false;
    this.product_flag=false;
    this.activitydetails_flag=false;
    this.risk_flag = false;
    this.client_flag = false;
    this.contractor_flag = false;
    this.branch_flag = false;
    this.payment_flag = false;
    this.document_flag = false;
    this.branchtax_flag = false;
    this.catalouge_flag = false;
    this.activity_flag=false;
    this.kyc_flag=false;

    this.onCancel.emit()
  }
  // 
  getmodification_vender() {
    this.vendor_data = [];
    this.contract_data = [];
    this.client_data = [];
    this.product_data = [];
    this.branch_data = [];
    this.document_data = [];
    this.risk_data = [];
    this.kyc_data = [];
    this.payment_data = [];
    this.branchtax_data = [];
    this.catalouge_data = [];
    this.activity_detail = [];
    this.activity_data = [];
    this.bcp_data = [];
    this.due_data = [];
    this.vendorId = this.shareService.vendorID.value

    this.atmaService.getmodification(this.vendorId)
      .subscribe(result => {
        this.modificationdata = result['data']
        this.modificationdata.forEach(element => {
          if (element.action == 2)//edit
          {
            if (element.type_name == 1) {
              this.vendor_data.push(element)
            }
            if (element.type_name == 11) {
              this.branchtax_data.push(element)
            }
            if (element.type_name == 15) {
              this.catalouge_data.push(element)
            }

            if (element.type_name == 8) {
              this.contract_data.push(element)
            }
            if (element.type_name == 7) {
              this.client_data.push(element)
            }
            if (element.type_name == 9) {
              this.product_data.push(element)
            }

            if (element.type_name == 6) {
              this.branch_data.push(element)
            }

            if (element.type_name == 10) {
              this.document_data.push(element)
            }
            
            if (element.type_name == 19) {
              this.risk_data.push(element)
            }
            if (element.type_name == 20) {
              this.kyc_data.push(element)
            }

            if (element.type_name == 12) {

              this.payment_data.push(element)
            }
            if (element.type_name == 14) {
              this.activity_detail.push(element)
            }
            if (element.type_name == 13) {
              this.activity_data.push(element)
            }
            if (element.type_name == 21) {
              this.bcp_data.push(element)
              //  this.shareService.modification_bcp_data.next(element);
               
            }
            if (element.type_name == 22) {
              this.due_data.push(element)
              // this.shareService.modification_due_data.next(element); 
            }

          }
          if (element.action == 1)//create
          {
            if (element.type_name == 8) {
              this.contract_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 7) {
              this.client_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            
            if (element.type_name == 9) {
              this.product_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 6) {
              this.branch_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 10) {
              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 19) {
              this.risk_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 20) {
              this.kyc_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 12) {

              this.payment_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 11) {
              this.branchtax_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 15) {
              this.catalouge_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 14) {
              this.activity_detail.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 13) {
              this.activity_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 21) {
              this.bcp_data.push(element)
              // this.shareService.modification_bcp_data.next(element); 
            }
            if (element.type_name == 22) {
              this.due_data.push(element)
              // this.shareService.modification_due_data.next(element); 
            }

          }if(element.action==3){
            if(element.type_name==12 ){
              this.payment_data.push(element)
            }
            if (element.type_name == 6) {
              this.branch_data.push(element)
            }
          }
          if (element.action == 0) {
            if (element.type_name == 10) {
              this.document_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 19) {
              this.risk_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 20) {
              this.kyc_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }

            if (element.type_name == 12) {

              this.payment_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 11) {
              this.branchtax_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 15) {
              this.catalouge_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 14) {
              this.activity_detail.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
            if (element.type_name == 13) {
              this.activity_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
            }
          }

        });






      })


  }

  //tablist
  gettabList(){
    this.vendorId = this.shareService.vendorID.value
    this.atmaService.gettabList(this.vendorId)
    .subscribe(result => {
      console.log("tab",result)
      this.asyncTabs = result['data']
      
    })

  }

  backButton(){
    this.router.navigate(['/atma/vendorView'], { skipLocationChange: true })
  }

  show_bcp = false;
  show_due = false;
  get_tabe(value) {
    // this.modify_changestatus = value.tab.textLabel
    // console.log(this.contract_data)
    if(this.bcp_data.length!= 0){
      this.shareService.modification_bcp_data.next(this.bcp_data[0]);
      this.show_bcp = true
    }

    if(this.due_data.length!= 0){
      this.shareService.modification_due_data.next(this.due_data[0]);
      this.show_due = true
    }

  }
}