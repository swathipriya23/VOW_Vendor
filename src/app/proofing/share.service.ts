import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public documentUpload = new BehaviorSubject<string>('');
  public accountEditValue = new BehaviorSubject<string>('');
  public templateEditValue = new BehaviorSubject<string>('');
  constructor() { }
}