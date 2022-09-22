import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastService: ToastrService) { }

  showSuccess(message) {
    this.toastService.success(message)
  }

  showError(message) {
    this.toastService.error(message)
  }

  showInfo(message) {
    this.toastService.info(message)
  }

  showWarning(message) {
    this.toastService.warning(message)
  }
}
