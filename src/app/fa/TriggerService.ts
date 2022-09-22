import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable()
export class TriggerService {
  constructor() { }
  private _trigger = new BehaviorSubject<string>("");
  castTrigger = this._trigger.asObservable();

  trigger(value) {
    console.log(value)
    this._trigger.next(value);
  }
}
