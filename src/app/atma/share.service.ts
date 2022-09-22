import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  menuUrlData: Array<any>;
  titleUrl: any;
  public taxEdit = new BehaviorSubject<string>('');
  public subTaxEdit = new BehaviorSubject<string>('');
  public taxRateEdit = new BehaviorSubject<string>('');
  public bankEditValue = new BehaviorSubject<string>(' ');
  public paymodeEditValue = new BehaviorSubject<string>(' ');
  public vendorView = new BehaviorSubject<string>(' ');
  public vendorID = new BehaviorSubject<any>('');
  public productEditForm = new BehaviorSubject<any>('');
  public clientEditForm = new BehaviorSubject<any>('');
  public contractorEditForm = new BehaviorSubject<any>('');
  public branchEditFrom = new BehaviorSubject<any>('');
  public bankBranchEditValue = new BehaviorSubject<string>(' ');
  public productTypeEdit = new BehaviorSubject<string>('');
  public apCategoryEdit = new BehaviorSubject<string>('');
  public apSubCategoryEdit = new BehaviorSubject<string>('');
  public uomEdit = new BehaviorSubject<string>('');
  public customerCategoryEdit = new BehaviorSubject<string>('');
  public productCategoryEdit = new BehaviorSubject<string>('');
  public docgrpedit = new BehaviorSubject<string>('');
  public productedit = new BehaviorSubject<String>('');
  public vendorEditValue = new BehaviorSubject<string>(' ');
  public branchID = new BehaviorSubject<any>('');
  public vendorDATA = new BehaviorSubject<any>('');
  public branchView = new BehaviorSubject<string>(' ');
  public vendorViewHeaderName = new BehaviorSubject<string>(' ');
  public branchTaxtEdit = new BehaviorSubject<string>(' ');
  public activityEditForm = new BehaviorSubject<any>('');
  public activityView = new BehaviorSubject<any>('');
  public activityDetailEditForm = new BehaviorSubject<any>('');
  public catalogEdit = new BehaviorSubject<string>(' ');
  public activityDetailList = new BehaviorSubject<string>(' ');
  public testingvalue=new BehaviorSubject<string>('')
  public modification_data=new BehaviorSubject<string>('')
  public modification_bcp_data=new BehaviorSubject<string>('')
  public modification_due_data=new BehaviorSubject<string>('')
  public modification_contractor=new BehaviorSubject<string>('')
  // public menuUrlData = new BehaviorSubject<any>('');
  // public titleUrls = new BehaviorSubject<any>('');

  public activityViewDetail = new BehaviorSubject<any>('');
  // public catalogEdit = new BehaviorSubject<string>(' ');
  // public activityDetailList = new BehaviorSubject<string>(' ');
  // public testingvalue=new BehaviorSubject<string>('')

  public paymenteditid=new BehaviorSubject<string>('');
  public documentEdit=new BehaviorSubject<string>('')
  public riskEdit = new BehaviorSubject<string>('');
  public kycEdit = new BehaviorSubject<string>('');
  public result = new BehaviorSubject<string>('');
  public modifiyRecord = new BehaviorSubject<any>('');
  public hsnedit=new BehaviorSubject<any>('');

  public loginID = new BehaviorSubject<any>('');
  public pre_branch = new BehaviorSubject<any>('');
  public add_submit_preActivityID = new BehaviorSubject<any>('');
  public add_submit_preActivityDetailID = new BehaviorSubject<any>('');
  public taxdata = new BehaviorSubject<any>('')

  constructor() { }


}