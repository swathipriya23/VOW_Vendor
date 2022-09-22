import { Component, OnInit } from '@angular/core';
import { ProofingService } from '../proofing.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-proofing-master',
  templateUrl: './proofing-master.component.html',
  styleUrls: ['./proofing-master.component.scss']
})
export class ProofingMasterComponent implements OnInit {
  templateList : Array<any>;
  accountList: Array<any>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  constructor(private proofingService: ProofingService,private notification: NotificationService,
     private router: Router,private shareService: ShareService) { }

  ngOnInit(): void {
    this.getTemplate();
    this.getAccountList();
  }

  getTemplate(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
      this.proofingService.getTemplateList(filter, sortOrder, pageNumber, pageSize)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.templateList = datas;
          for (let i = 0; i < this.templateList.length; i++) {
            let ft = this.templateList[i].file_type
            if (ft == undefined) {
              this.templateList[i].file_name = ''
            } else {
              this.templateList[i].file_name = ft.text
            };
          }
          if (this.templateList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })
  }
  // templateEdit(data: any) {
  //   this.shareService.templateEditValue.next(data)
  //   this.router.navigateByUrl('/templateedit', { skipLocationChange: true })
  //   return data;
  // }
  nextClickTemplate() {
    if (this.has_next === true) {
      this.getTemplate("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickTemplate() {
    if (this.has_previous === true) {
      this.getTemplate("", 'asc', this.currentpage - 1, 10)
    }
  }
  deleteTemplate(data) {
    let value = data.id
    console.log("tempdetelevalueeee", value)
    this.proofingService.templateDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getTemplate();
        return true

      })
  }


  private getAccountList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.proofingService.getAccountList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.accountList = datas;
        console.log("account",this.accountList)
        for (let i = 0; i < this.accountList.length; i++) {
          let temp = this.accountList[i].template
          if (temp == undefined) {
            this.accountList[i].template_name = ''
          } else {
            this.accountList[i].template_name = temp.template
          };
        }
        let datapagination = results["pagination"];
        this.accountList = datas;
        if (this.accountList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }

  // accountEdit(data: any) {
  //   this.shareService.accountEditValue.next(data)
  //   this.router.navigateByUrl('/accountEdit', { skipLocationChange: true })
  //   return data;
  // }
  deleteAccount(data) {
    let value = data.id
    console.log("valueeee", value)
    this.proofingService.acctDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getAccountList();
        return true

      })
  }
  nextClickAccount() {
    if (this.has_next === true) {
      this.getAccountList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickAccount() {
    if (this.has_previous === true) {
      this.getAccountList("", 'asc', this.currentpage - 1, 10)
    }
  }













  subModuleList = [{ name: 'Template',url: '/template' }, { name: 'Account' ,url: '/account'}];
  url:string;
  urlTemplate: string;
  urlAccount: string;
  makerNameBtn:any;
  isTemplate:boolean;
  isAccount:boolean;
  isTemplateForm:boolean;
  isTemplateEditform:boolean;
  isAccountForm:boolean;
  ismakerCheckerButton:boolean;



  subModuleData(data) {
    this.url = data.url;
    this.urlTemplate = "/template";
    this.urlAccount = "/account";
  
    this.isTemplate =this.urlTemplate === this.url ? true:false;
    this.isAccount = this.urlAccount === this.url ? true : false;
  
    this.makerNameBtn = data.name;
    
    if (this.isTemplate) {
      this.getTemplate();
      this.isTemplateForm = false;
      this.isTemplateEditform = false;
      this.isAccountForm =false;
      this.ismakerCheckerButton = true;
    
    } 
    if (this.isAccount) {
      this.getAccountList();
      this.isTemplateForm=false;
      this.isTemplateEditform = false;
      this.isAccountForm = false;
      this.ismakerCheckerButton = true;
    }
  }



  addForm() {
    console.log(this.makerNameBtn)
    if (this.makerNameBtn === "Template") {
      this.isTemplate = false;
      this.isTemplateForm = true;
      this.isTemplateEditform = false;
      this.isAccountForm =false;
      this.ismakerCheckerButton=false;
    } else if (this.makerNameBtn === "Account") {
      this.isAccount = false;
      this.isTemplateForm = false;
      this.isTemplateEditform = false;
      this.isAccountForm = true;
      let data ="";
      this.shareService.accountEditValue.next(data)
      this.ismakerCheckerButton=false;
    } 
  }


  tempCancel(){
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
  }
  tempSubmit(){
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
    this.getTemplate();
  }
  temEditCancel() {
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
  }

  tempeditSubmit() {
    this.isTemplate = true;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =false;
    this.isAccount = false;
    this.ismakerCheckerButton = true;
    this.getTemplate();
  }
  
  templateEdit(data) {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = true;
    this.isAccountForm =false;
    this.isAccount = false;
    this.ismakerCheckerButton = false;
    this.shareService.templateEditValue.next(data)
    return data;
   
  }
  accountEdit(data) {
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =true;
    this.isAccount = false;
    this.ismakerCheckerButton = false;
    this.shareService.accountEditValue.next(data)
    return data;
  }
  acountCancel(){
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =false;
    this.isAccount = true;
    this.ismakerCheckerButton = true;
  }
  acountSubmit(){
    this.isTemplate = false;
    this.isTemplateForm = false;
    this.isTemplateEditform = false;
    this.isAccountForm =false;
    this.isAccount = true;
    this.ismakerCheckerButton = true;
    this.getAccountList();
  }

}