import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public categoryEditValue = new BehaviorSubject<string>('');
  public deptEditValue = new BehaviorSubject<string>('');
  public subCategoryEditValue = new BehaviorSubject<string>('');
  public rolesEditValue = new BehaviorSubject<string>('');
  public channelEdit = new BehaviorSubject<string>('');
  public courierEdit = new BehaviorSubject<string>('');
  public documentEdit = new BehaviorSubject<string>('');
  
  public accountEditValue = new BehaviorSubject<string>('');
  public templateEditValue = new BehaviorSubject<string>('');
  public costCentreEditValue = new BehaviorSubject<string>('');
  public businessSegmentEditValue = new BehaviorSubject<string>('');
  public ccbsMappingEditValue = new BehaviorSubject<string>('');
  public hierarchyEditValue = new BehaviorSubject<string>('');
  public contactEditValue = new BehaviorSubject<string>('');
  public designationEditValue = new BehaviorSubject<string>('');
  public countryEditValue = new BehaviorSubject<string>('');
  public stateEditValue = new BehaviorSubject<string>('');
  public districtEditValue = new BehaviorSubject<string>('');
  public cityEditValue = new BehaviorSubject<string>('');
  public pincodeEditValue = new BehaviorSubject<string>('');
  public BSShare = new BehaviorSubject<string>('');
  public empeditid=new BehaviorSubject<any>('');
  public designationValue=new BehaviorSubject<any>('');
  public riskValue=new BehaviorSubject<any>('');
  public sectorEdit=new BehaviorSubject<any>('');
  public expEdit=new BehaviorSubject<any>('');
  public finedit=new BehaviorSubject<any>('');
  public finquateredit=new BehaviorSubject<any>('');
  public CommodityEdit = new BehaviorSubject<string>('');
  public DelmatEdit = new BehaviorSubject<string>('');
  public Delmatappshare=new BehaviorSubject<any>('');
  public newExpenceEdit=new BehaviorSubject<any>('');
  public clientedit=new BehaviorSubject<any>('');
  public branchmstid=new BehaviorSubject<any>('');
  constructor() { }
}
