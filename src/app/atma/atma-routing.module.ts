import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorMasterComponent } from '../atma/vendor-master/vendor-master.component'
import { SubTaxComponent } from '../atma/sub-tax/sub-tax.component'
import { TaxComponent } from '../atma/tax/tax.component'
import { TaxRateComponent } from '../atma/tax-rate/tax-rate.component'
import { CreateBankComponent } from '../atma/create-bank/create-bank.component'
import { BankEditComponent } from '../atma/bank-edit/bank-edit.component'
import { CreateBankbranchComponent } from '../atma/create-bankbranch/create-bankbranch.component'
import { CreatePaymodeComponent } from '../atma/create-paymode/create-paymode.component'
import { PaymodeEditComponent } from '../atma/paymode-edit/paymode-edit.component'
import { BankbranchEditComponent } from '../atma/bankbranch-edit/bankbranch-edit.component'
import { VendorSummaryComponent } from '../atma/vendor-summary/vendor-summary.component'
import { ContractorComponent } from '../atma/contractor/contractor.component'
import { VendorviewComponent } from '../atma/vendorview/vendorview.component'
import { ProductComponent } from '../atma/product/product.component'
import { ClientComponent } from '../atma/client/client.component'
import { BranchComponent } from '../atma/branch/branch.component'
import { CreateVendorComponent } from '../atma/create-vendor/create-vendor.component'
import { ProducttypeComponent } from '../atma/producttype/producttype.component'
import { ProducttypeEditComponent } from '../atma/producttype-edit/producttype-edit.component'
import { ApcategoryComponent } from '../atma/apcategory/apcategory.component'
import { ApcategoryEditComponent } from '../atma/apcategory-edit/apcategory-edit.component'
import { BranchTaxComponent } from '../atma/branch-tax/branch-tax.component'
import { VendorEditComponent } from '../atma/vendor-edit/vendor-edit.component'
import { BranchactivityComponent } from '../atma/branchactivity/branchactivity.component'
import { BranchPaymentComponent } from '../atma/branch-payment/branch-payment.component'
import { BranchViewComponent } from '../atma/branch-view/branch-view.component'
import { BranchactivityEditComponent } from '../atma/branchactivity-edit/branchactivity-edit.component'
import { ActivityViewComponent } from '../atma/activity-view/activity-view.component'
import { ActivitydetailComponent } from '../atma/activitydetail/activitydetail.component'
import { ActivitydetailEditComponent } from '../atma/activitydetail-edit/activitydetail-edit.component'
import { PaymenteditComponent } from '../atma/paymentedit/paymentedit.component'
import { BranchtaxtabComponent } from '../atma/branchtaxtab/branchtaxtab.component'
import { BranchpaymentSummaryComponent } from '../atma/branchpayment-summary/branchpayment-summary.component'
import { CreateCatalogComponent } from '../atma/create-catalog/create-catalog.component'
import { VendordocumentcreateComponent } from '../atma/vendordocumentcreate/vendordocumentcreate.component'
import { DocumentEditComponent } from '../atma/document-edit/document-edit.component'
import { ModificationviewComponent } from '../atma/modificationview/modificationview.component'
import { VendormodificationComponent } from '../atma/vendormodification/vendormodification.component'
import { CanActivateGuardService } from '../can-activate-guard.service';
import { VendorreportComponent } from '../atma/vendorreport/vendorreport.component'
import { RiskComponent} from '../atma/risk/risk.component'
import { RiskEditComponent} from '../atma/risk-edit/risk-edit.component'
import {RiskmodificationComponent} from '../atma/riskmodification/riskmodification.component'
import { KycComponent } from '../atma/kyc/kyc.component'
import { KycEditComponent} from '../atma/kyc-edit/kyc-edit.component'
import { KycmodificationComponent} from '../atma/kycmodification/kycmodification.component'

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'vendormaster', component: VendorMasterComponent, canActivate: [CanActivateGuardService] },
      { path: 'tax', component: TaxComponent },
      { path: 'subtax', component: SubTaxComponent },
      { path: 'taxrate', component: TaxRateComponent },
      { path: 'bank', component: CreateBankComponent },
      { path: 'bankedit', component: BankEditComponent },
      { path: 'bankbranch', component: CreateBankbranchComponent },
      { path: 'paymode', component: CreatePaymodeComponent },
      { path: 'paymodeedit', component: PaymodeEditComponent },
      { path: 'bankbranchedit', component: BankbranchEditComponent },
      { path: 'vendor', component: VendorSummaryComponent },
      { path: 'vendorView', component: VendorviewComponent },
      { path: 'client', component: ClientComponent },
      { path: 'branch', component: BranchComponent },
      { path: 'contractor', component: ContractorComponent },
      { path: 'product', component: ProductComponent },
      { path: 'BranchtaxtabComponent', component: BranchtaxtabComponent },
      { path: 'vendorcreate', component: CreateVendorComponent },
      { path: 'vendoredit', component: VendorEditComponent },
      { path: 'branchactivity', component: BranchactivityComponent },
      { path: 'branchView', component: BranchViewComponent },
      { path: 'BranchTaxComponent', component: BranchTaxComponent },
      { path: 'producttype', component: ProducttypeComponent },
      { path: 'producttypeEdit', component: ProducttypeEditComponent },
      { path: 'apcategory', component: ApcategoryComponent },
      { path: 'apcategoryEdit', component: ApcategoryEditComponent },
      { path: 'branchActivityEdit', component: BranchactivityEditComponent },
      { path: 'activityView', component: ActivityViewComponent },
      { path: 'activityDetail', component: ActivitydetailComponent },
      { path: 'activityDetailEdit', component: ActivitydetailEditComponent },
      { path: 'createCatalog', component: CreateCatalogComponent },
      { path: 'BranchPaymentComponent', component: BranchPaymentComponent },
      { path: 'branchActivityEdit', component: BranchactivityEditComponent },
      { path: 'activityView', component: ActivityViewComponent },
      { path: 'activityDetail', component: ActivitydetailComponent },
      { path: 'activityDetailEdit', component: ActivitydetailEditComponent },
      { path: 'vendor', component: CreateVendorComponent },
      { path: 'branchpayment', component: BranchpaymentSummaryComponent },
      { path: 'createCatalog', component: CreateCatalogComponent },
      { path: 'PaymenteditComponent', component: PaymenteditComponent },
      { path: 'documentcreate', component: VendordocumentcreateComponent },
      { path: 'documentedit', component: DocumentEditComponent },
      { path: 'modify', component: ModificationviewComponent },
      { path: 'vendormodification', component: VendormodificationComponent },
      { path: 'vendorreport', component: VendorreportComponent },
      { path: 'risk', component:RiskComponent},
      { path: 'riskedit', component:RiskEditComponent},
      { path: 'riskmodification', component:RiskmodificationComponent},
      { path: 'kyc', component:KycComponent},
      { path: 'kycedit', component: KycEditComponent},
      { path: 'kycmodification' ,component: KycmodificationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtmaRoutingModule { }
