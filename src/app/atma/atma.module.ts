import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from 'ngx-pagination'
import { AtmaRoutingModule } from './atma-routing.module';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { TaxComponent } from './tax/tax.component';
import { TaxEditComponent } from './tax-edit/tax-edit.component';
import { SubTaxComponent } from './sub-tax/sub-tax.component';
import { SubTaxEditComponent } from './sub-tax-edit/sub-tax-edit.component';
import { TaxRateComponent } from './tax-rate/tax-rate.component';
import { TaxRateEditComponent } from './tax-rate-edit/tax-rate-edit.component';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { CreateBankbranchComponent } from './create-bankbranch/create-bankbranch.component';
import { BankEditComponent } from './bank-edit/bank-edit.component';
import { CreatePaymodeComponent } from './create-paymode/create-paymode.component';
import { PaymodeEditComponent } from './paymode-edit/paymode-edit.component';
import { BankbranchEditComponent } from './bankbranch-edit/bankbranch-edit.component';
import { VendorSummaryComponent } from './vendor-summary/vendor-summary.component';
import { ContractorComponent } from './contractor/contractor.component';
import { VendorviewComponent } from './vendorview/vendorview.component';
import { ClientComponent } from './client/client.component';
import { ProductComponent } from './product/product.component';
import { BranchComponent } from './branch/branch.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ContractorEditComponent } from './contractor-edit/contractor-edit.component';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ProducttypeComponent } from './producttype/producttype.component';
import { ProducttypeEditComponent } from './producttype-edit/producttype-edit.component';
import { ApcategoryComponent } from './apcategory/apcategory.component';
import { ApcategoryEditComponent } from './apcategory-edit/apcategory-edit.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { SubcategoryEditComponent } from './subcategory-edit/subcategory-edit.component';
import { UomComponent } from './uom/uom.component';
import { UomEditComponent } from './uom-edit/uom-edit.component';
import { CustomerCategoryComponent } from './customer-category/customer-category.component';
import { CustomerCategoryEditComponent } from './customer-category-edit/customer-category-edit.component';
import { ProductcategoryComponent } from './productcategory/productcategory.component';
import { ProductcategoryEditComponent } from './productcategory-edit/productcategory-edit.component';
import { BranchTaxComponent } from './branch-tax/branch-tax.component';
import { DocumentgroupComponent } from './documentgroup/documentgroup.component';
import { DocumentgroupEditComponent } from './documentgroup-edit/documentgroup-edit.component';
import { ProductmasterComponent } from './productmaster/productmaster.component';
import { ProductmasterEditComponent } from './productmaster-edit/productmaster-edit.component';
import { VendorEditComponent } from './vendor-edit/vendor-edit.component';
import { BranchactivityComponent } from './branchactivity/branchactivity.component';
import { BranchViewComponent } from './branch-view/branch-view.component';
import { BranchPaymentComponent } from './branch-payment/branch-payment.component';
import { BranchactivityEditComponent } from './branchactivity-edit/branchactivity-edit.component';
import { ActivityViewComponent } from './activity-view/activity-view.component';
import { ActivitydetailComponent } from './activitydetail/activitydetail.component';
import { ActivitydetailEditComponent } from './activitydetail-edit/activitydetail-edit.component';
import { CreateCatalogComponent } from './create-catalog/create-catalog.component';
import { CatalogEditComponent } from './catalog-edit/catalog-edit.component';
//import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { BranchpaymentSummaryComponent } from './branchpayment-summary/branchpayment-summary.component';
import { ApsubcategoryComponent } from './apsubcategory/apsubcategory.component';
import { ApsubcategoryEditComponent } from './apsubcategory-edit/apsubcategory-edit.component';
import { PaymenteditComponent } from './paymentedit/paymentedit.component';
import { BranchtaxtabComponent } from './branchtaxtab/branchtaxtab.component';
import { VendordocumentcreateComponent } from './vendordocumentcreate/vendordocumentcreate.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DocumentSummaryComponent } from './document-summary/document-summary.component';
import { ClientmodifyviewComponent } from './clientmodifyview/clientmodifyview.component';
import { ModificationviewComponent } from './modificationview/modificationview.component';
import { ContractmodificationComponent } from './contractmodification/contractmodification.component';
import { BranchmodificationComponent } from './branchmodification/branchmodification.component';
import { PaymentmodificationComponent } from './paymentmodification/paymentmodification.component';
import { DocumentmodificationComponent } from './documentmodification/documentmodification.component';
import { BranchtaxmodificationComponent } from './branchtaxmodification/branchtaxmodification.component';
import { CatalougemodificationComponent } from './catalougemodification/catalougemodification.component';
import { ActivitymodificationComponent } from './activitymodification/activitymodification.component';
import { ActivitydetailmodificationComponent } from './activitydetailmodification/activitydetailmodification.component';
import { ProductmodificationComponent } from './productmodification/productmodification.component';
import { VendormodificationComponent } from './vendormodification/vendormodification.component';
import { ConfirmnotificationComponent } from './confirmnotification/confirmnotification.component';
import { confirmationservice } from '../atma/confirmnotification/confirmationservice';
import { ValidationserviceComponent } from './validationservice/validationservice.component';
import { VendorreportComponent } from './vendorreport/vendorreport.component'
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DatePipe } from '@angular/common';
import { HsnComponent } from './hsn/hsn.component';
import { HsnEditComponent } from './hsn-edit/hsn-edit.component';
import { RiskComponent } from './risk/risk.component';
import { RiskEditComponent } from './risk-edit/risk-edit.component';
import { RiskmodificationComponent } from './riskmodification/riskmodification.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { KycComponent } from './kyc/kyc.component';
import { KycEditComponent } from './kyc-edit/kyc-edit.component';
import { KycmodificationComponent } from './kycmodification/kycmodification.component';
import { BcpModificationComponent } from './bcp-modification/bcp-modification.component';
import { DuediligenceModificationComponent } from './duediligence-modification/duediligence-modification.component';

@NgModule({
  declarations: [VendorMasterComponent, TaxComponent, TaxEditComponent, SubTaxComponent,
    SubTaxEditComponent, TaxRateComponent, TaxRateEditComponent, CreateVendorComponent,
    CreateBankComponent, CreateBankbranchComponent, BankEditComponent, CreatePaymodeComponent,
    PaymodeEditComponent, BankbranchEditComponent, VendorSummaryComponent, VendorEditComponent,
    ContractorComponent, VendorviewComponent, ClientComponent, ProductComponent, BranchactivityComponent,
    BranchComponent, BranchEditComponent, ClientEditComponent, ProductEditComponent,
    ContractorEditComponent, ProducttypeComponent, ProducttypeEditComponent, ApcategoryComponent,
    ApcategoryEditComponent, SubcategoryComponent, SubcategoryEditComponent,
    UomComponent,
    UomEditComponent,
    CustomerCategoryComponent,
    CustomerCategoryEditComponent,
    ProductcategoryComponent,
    ProductcategoryEditComponent,
    BranchTaxComponent,
    ContractorEditComponent,
    DocumentgroupComponent,
    DocumentgroupEditComponent,
    ProductmasterComponent,
    ProductmasterEditComponent,
    ContractorEditComponent,
    BranchViewComponent,
    BranchPaymentComponent,
    BranchactivityEditComponent,
    ActivityViewComponent,
    ActivitydetailComponent,
    ActivitydetailEditComponent,
    CreateCatalogComponent,
    CatalogEditComponent,
    BranchpaymentSummaryComponent,
    ApsubcategoryComponent,
    ApsubcategoryEditComponent,
    ContractorEditComponent,
    CreateCatalogComponent,
    CatalogEditComponent,
    PaymenteditComponent,
    BranchtaxtabComponent,
    VendordocumentcreateComponent,
    DocumentEditComponent,
    DocumentSummaryComponent,
    ClientmodifyviewComponent,
    ModificationviewComponent,
    ContractmodificationComponent,
    BranchmodificationComponent,
    PaymentmodificationComponent,
    DocumentmodificationComponent,
    BranchtaxmodificationComponent,
    CatalougemodificationComponent,
    ActivitymodificationComponent,
    ActivitydetailmodificationComponent,
    ProductmodificationComponent,
    VendormodificationComponent, ConfirmnotificationComponent, ValidationserviceComponent, VendorreportComponent,
    HsnComponent, HsnEditComponent, RiskComponent, RiskEditComponent, RiskmodificationComponent, KycComponent, KycEditComponent, KycmodificationComponent, BcpModificationComponent, DuediligenceModificationComponent
  ],
  providers: [confirmationservice,DatePipe],
  imports: [
    ToastrModule.forRoot(),
    SharedModule,MaterialModule,
    // BrowserAnimationsModule, 
    AtmaRoutingModule,
    PdfViewerModule
  ],
  entryComponents: []

})
export class AtmaModule { }