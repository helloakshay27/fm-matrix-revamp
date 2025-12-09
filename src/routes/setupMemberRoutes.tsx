import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const NewTier = lazy(() => import("@/pages/NewTier"));
const DepartmentCreate = lazy(() => import("@/pages/DepartmentCreate"));
const DepartmentList = lazy(() => import("@/pages/DepartmentList"));
const ProjectBuildingType = lazy(() => import("@/pages/ProjectBuildingType"));
const ProjectBuildingTypeEdit = lazy(() => import("@/pages/ProjectBuildingTypeEdit"));
const ProjectBuildingTypeList = lazy(() => import("@/pages/ProjectBuildingTypeList"));
const PlusServicesList = lazy(() => import("@/pages/PlusServiceList"));
const PlusServicesCreate = lazy(() => import("@/pages/PlusServiceCreate"));

// Lazy load all setup member pages
const Amenities = lazy(() => import("@/pages/Amenities"));
const AmenitiesList = lazy(() => import("@/pages/AmenitiesList"));
const BankDetailsCreate = lazy(() => import("@/pages/BankDetailsCreate"));
const BankDetailsEdit = lazy(() => import("@/pages/BankDetailsEdit"));
const BankDetailsList = lazy(() => import("@/pages/BankDetailsList"));
const Banks = lazy(() => import("@/pages/Banks"));
const BanksList = lazy(() => import("@/pages/BanksList"));
const BanksCreate = lazy(() => import("@/pages/BankDetailsCreate"));
const BannerAdd = lazy(() => import("@/pages/BannerAdd"));
const BannerEdit = lazy(() => import("@/pages/BannerEdit"));
const BannerList = lazy(() => import("@/pages/BannerList"));
const CategoryTypes = lazy(() => import("@/pages/CategoryTypes"));
const CategoryTypesEdit = lazy(() => import("@/pages/CategoryTypesEdit"));
const CategoryTypesList = lazy(() => import("@/pages/CategoryTypesList"));
const CommonFiles = lazy(() => import("@/pages/CommonFiles"));
const CompanyCreate = lazy(() => import("@/pages/CompanyCreate"));
const CompanyEdit = lazy(() => import("@/pages/CompanyEdit"));
const CompanyList = lazy(() => import("@/pages/CompanyList"));
const ConstructionStatus = lazy(() => import("@/pages/ConstructionStatus"));
const ConstructionStatusEdit = lazy(() => import("@/pages/ConstructionStatusEdit"));
const ConstructionStatusList = lazy(() => import("@/pages/ConstructionStatusList"));
const ConstructionUpdatesCreate = lazy(() => import("@/pages/ConstructionUpdatesCreate"));
const ConstructionUpdatesEdit = lazy(() => import("@/pages/ConstructionUpdatesEdit"));
const ConstructionUpdatesList = lazy(() => import("@/pages/ConstructionUpdatesList"));
const CreateRuleEngine = lazy(() => import("@/pages/CreateRuleEngine"));
const EnquiryList = lazy(() => import("@/pages/EnquiryList"));
const EventCreate = lazy(() => import("@/pages/EventCreate"));
const EventEdit = lazy(() => import("@/pages/EventEdit"));
const EventList = lazy(() => import("@/pages/EventList"));
const FaqCategoryForm = lazy(() => import("@/pages/FaqCategoryForm"));
const FaqCategoryList = lazy(() => import("@/pages/FaqCategoryList"));
const FaqCreate = lazy(() => import("@/pages/FaqCreate"));
const FaqEdit = lazy(() => import("@/pages/FaqEdit"));
const FaqList = lazy(() => import("@/pages/FaqList"));
const FaqSubCategory = lazy(() => import("@/pages/FaqSubCategory"));
const FaqSubCategoryList = lazy(() => import("@/pages/FaqSubCategoryList"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const GalleryDetails = lazy(() => import("@/pages/GalleryDetails"));
const GalleryList = lazy(() => import("@/pages/GalleryList"));
const HomeLoanCreate = lazy(() => import("@/pages/HomeLoanCreate"));
const HomeLoanEdit = lazy(() => import("@/pages/HomeLoanEdit"));
const HomeLoanList = lazy(() => import("@/pages/HomeLoanList"));
const ImageConfigCreate = lazy(() => import("@/pages/ImageConfigCreate"));
const ImageConfigEdit = lazy(() => import("@/pages/ImageConfigEdit"));
const ImageConfigList = lazy(() => import("@/pages/ImageConfigList"));
const LoanManagerAdd = lazy(() => import("@/pages/LoanManagerAdd"));
const LoanManagerEdit = lazy(() => import("@/pages/LoanManagerEdit"));
const LoanManagerList = lazy(() => import("@/pages/LoanManagerList"));
const LockFunctionCreate = lazy(() => import("@/pages/LockFunctionCreate"));
const LockFunctionList = lazy(() => import("@/pages/LockFunctionList"));
const LockRoleCreate = lazy(() => import("@/pages/LockRoleCreate"));
const LockRoleList = lazy(() => import("@/pages/LockRoleList"));
const LoyaltyManagersCreate = lazy(() => import("@/pages/LoyaltyManagersCreate"));
const LoyaltyManagersEdit = lazy(() => import("@/pages/LoyaltyManagersEdit"));
const LoyaltyManagersList = lazy(() => import("@/pages/LoyaltyManagersList"));
const NewGallery = lazy(() => import("@/pages/NewGallery"));
const NoticeboardCreate = lazy(() => import("@/pages/NoticeboardCreate"));
const NoticeboardList = lazy(() => import("@/pages/NoticeboardList"));
const OrganizationCreate = lazy(() => import("@/pages/OrganizationCreate"));
const OrganizationList = lazy(() => import("@/pages/OrganizationList"));
const OrganizationUpdate = lazy(() => import("@/pages/OrganizationUpdate"));
const ProjectDetailsCreate = lazy(() => import("@/pages/ProjectDetailsCreate"));
const ProjectDetailsEdit = lazy(() => import("@/pages/ProjectDetailsEdit"));
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"));
const ProjectDetailsList = lazy(() => import("@/pages/ProjectDetailsList"));
const PropertyType = lazy(() => import("@/pages/PropertyType"));
const PropertyTypeEdit = lazy(() => import("@/pages/PropertyTypeEdit"));
const PropertyTypeList = lazy(() => import("@/pages/PropertyTypeList"));
const ReferralCreate = lazy(() => import("@/pages/ReferralCreate"));
const ReferralEdit = lazy(() => import("@/pages/ReferralEdit"));
const ReferralList = lazy(() => import("@/pages/ReferralList"));
const ReferralProgramCreate = lazy(() => import("@/pages/ReferralProgramCreate"));
const ReferralProgramEdit = lazy(() => import("@/pages/ReferralProgramEdit"));
const ReferralProgramList = lazy(() => import("@/pages/ReferralProgramList"));
const ServiceCategory = lazy(() => import("@/pages/ServiceCategory"));
const ServiceCategoryList = lazy(() => import("@/pages/ServiceCategoryList"));
const SiteCreate = lazy(() => import("@/pages/SiteCreate"));
const SiteEdit = lazy(() => import("@/pages/SiteEdit"));
const SiteList = lazy(() => import("@/pages/SiteList"));
const SiteVisitCreate = lazy(() => import("@/pages/SiteVisitCreate"));
const SiteVisitEdit = lazy(() => import("@/pages/SiteVisitEdit"));
const SiteVisitList = lazy(() => import("@/pages/SiteVisitList"));
const SiteVisitSlotConfig = lazy(() => import("@/pages/SiteVisitSlotConfig"));
const SiteVisitSlotConfigList = lazy(() => import("@/pages/SiteVisitSlotConfigList"));
const SmtpSettingsEdit = lazy(() => import("@/pages/SmtpSettingsEdit"));
const SmtpSettingsList = lazy(() => import("@/pages/SmtpSettingsList"));
const Specification = lazy(() => import("@/pages/Specification"));
const SpecificationList = lazy(() => import("@/pages/SpecificationList"));
const SpecificationUpdate = lazy(() => import("@/pages/SpecificationUpdate"));
const SupportServiceList = lazy(() => import("@/pages/SupportServiceList"));
const TagAdd = lazy(() => import("@/pages/TagAdd"));
const TdsTutorialsCreate = lazy(() => import("@/pages/TdsTutorialsCreate"));
const TdsTutorialsEdit = lazy(() => import("@/pages/TdsTutorialsEdit"));
const TdsTutorialsList = lazy(() => import("@/pages/TdsTutorialsList"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const TestimonialEdit = lazy(() => import("@/pages/TestimonialEdit"));
const TestimonialList = lazy(() => import("@/pages/TestimonialList"));
const UserCreate = lazy(() => import("@/pages/UserCreate"));
const UserDetails = lazy(() => import("@/pages/UserDetails"));
const UserEdit = lazy(() => import("@/pages/UserEdit"));
const UserGroupsCreate = lazy(() => import("@/pages/UserGroupsCreate"));
const UserGroupsEdit = lazy(() => import("@/pages/UserGroupsEdit"));
const UserGroupsList = lazy(() => import("@/pages/UserGroupsList"));
const UserList = lazy(() => import("@/pages/UserList"));
const PressReleasesCreate = lazy(() => import("@/pages/PressReleasesCreate"));
const PressReleasesEdit = lazy(() => import("@/pages/PressReleasesEdit"));
const PressReleasesList = lazy(() => import("@/pages/PressReleasesList"));

// Add lazy imports for loyalty pages
const LoyaltyMembersList = lazy(() => import("@/pages/LoyaltyMembersList"));
const LoyaltyTiersList = lazy(() => import("@/pages/LoyaltyTiersList"));
const RuleEngineList = lazy(() => import("@/pages/RuleEngineList"));
const LockPaymentsList = lazy(() => import("@/pages/LockPaymentsList"));
const HomeLoanRequestsList = lazy(() => import("@/pages/HomeLoanRequestsList"));
const DemandNotesList = lazy(() => import("@/pages/DemandNotesList"));
const OrdersList = lazy(() => import("@/pages/OrdersList"));
const EncashList = lazy(() => import("@/pages/EncashList"));

// Add missing lazy imports
const ProjectConfiguration = lazy(() => import("@/pages/ProjectConfiguraion"));
const ProjectConfigurationList = lazy(() => import("@/pages/ProjectConfiguraionList"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// Wrapper to add Suspense to lazy components
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const setupMemberRoutes = (
  <>
    {/* Amenities Routes */}
    <Route path="/setup-member/amenities" element={withSuspense(Amenities)} />
    <Route path="/setup-member/amenities-list" element={withSuspense(AmenitiesList)} />

    {/* Bank Details Routes */}
    <Route path="/setup-member/bank-details-create" element={withSuspense(BankDetailsCreate)} />
    <Route path="/setup-member/bank-details-edit/:id" element={withSuspense(BankDetailsEdit)} />
    <Route path="/setup-member/bank-details-list" element={withSuspense(BankDetailsList)} />

    {/* Banks Routes */}
    <Route path="/setup-member/banks/:bankId?" element={withSuspense(Banks)} />
    <Route path="/setup-member/banks-list" element={withSuspense(BanksList)} />
    <Route path="/setup-member/banks/create" element={withSuspense(BanksCreate)} />

    {/* Banner Routes */}
    <Route path="/setup-member/banner-add" element={withSuspense(BannerAdd)} />
    <Route path="/setup-member/banner-edit/:id" element={withSuspense(BannerEdit)} />
    <Route path="/setup-member/banner-list" element={withSuspense(BannerList)} />

    {/* Category Types Routes */}
    <Route path="/setup-member/category-types" element={withSuspense(CategoryTypes)} />
    <Route path="/setup-member/category-types-edit/:id" element={withSuspense(CategoryTypesEdit)} />
    <Route path="/setup-member/category-types-list" element={withSuspense(CategoryTypesList)} />

    {/* Common Files Routes */}
    <Route path="/setup-member/common-files" element={withSuspense(CommonFiles)} />

    {/* Company Routes */}
    <Route path="/setup-member/company-create" element={withSuspense(CompanyCreate)} />
    <Route path="/setup-member/company-edit/:id" element={withSuspense(CompanyEdit)} />
    <Route path="/setup-member/company-list" element={withSuspense(CompanyList)} />

    {/* Construction Status Routes */}
    <Route path="/setup-member/construction-status" element={withSuspense(ConstructionStatus)} />
    <Route path="/setup-member/construction-status-edit/:id" element={withSuspense(ConstructionStatusEdit)} />
    <Route path="/setup-member/construction-status-list" element={withSuspense(ConstructionStatusList)} />

    {/* Construction Updates Routes */}
    <Route path="/setup-member/construction-updates-create" element={withSuspense(ConstructionUpdatesCreate)} />
    <Route path="/setup-member/construction-updates-edit/:id" element={withSuspense(ConstructionUpdatesEdit)} />
    <Route path="/setup-member/construction-updates-list" element={withSuspense(ConstructionUpdatesList)} />

    {/* Rule Engine Routes */}
    <Route path="/setup-member/create-rule-engine" element={withSuspense(CreateRuleEngine)} />

    {/* Enquiry Routes */}
    <Route path="/setup-member/enquiry-list" element={withSuspense(EnquiryList)} />

    {/* Event Routes */}
    <Route path="/setup-member/event-create" element={withSuspense(EventCreate)} />
    <Route path="/setup-member/event-edit/:id" element={withSuspense(EventEdit)} />
    <Route path="/setup-member/event-list" element={withSuspense(EventList)} />

    {/* FAQ Routes */}
    <Route path="/setup-member/faq-category-form" element={withSuspense(FaqCategoryForm)} />
    <Route path="/setup-member/faq-category-list" element={withSuspense(FaqCategoryList)} />
    <Route path="/setup-member/faq-create" element={withSuspense(FaqCreate)} />
    <Route path="/setup-member/faq-edit/:id" element={withSuspense(FaqEdit)} />
    <Route path="/setup-member/faq-list" element={withSuspense(FaqList)} />
    <Route path="/setup-member/faq-subcategory" element={withSuspense(FaqSubCategory)} />
    <Route path="/setup-member/faq-subcategory/:faqSubId/edit" element={<FaqSubCategory />} />
    <Route path="/setup-member/faq-subcategory-list" element={withSuspense(FaqSubCategoryList)} />

    {/* Gallery Routes */}
    <Route path="/setup-member/gallery" element={withSuspense(Gallery)} />
    <Route path="/setup-member/gallery-details/:id" element={withSuspense(GalleryDetails)} />
    <Route path="/setup-member/gallery-list" element={withSuspense(GalleryList)} />
    <Route path="/setup-member/new-gallery" element={withSuspense(NewGallery)} />

    {/* Home Loan Routes */}
    <Route path="/setup-member/home-loan-create" element={withSuspense(HomeLoanCreate)} />
    <Route path="/setup-member/home-loan-edit/:id" element={withSuspense(HomeLoanEdit)} />
    <Route path="/setup-member/home-loan-list" element={withSuspense(HomeLoanList)} />

    {/* Image Config Routes */}
    <Route path="/setup-member/image-config-create" element={withSuspense(ImageConfigCreate)} />
    <Route path="/setup-member/image-config-edit/:id" element={withSuspense(ImageConfigEdit)} />
    <Route path="/setup-member/image-config-list" element={withSuspense(ImageConfigList)} />

    {/* Loan Manager Routes */}
    <Route path="/setup-member/loan-manager-add" element={withSuspense(LoanManagerAdd)} />
    <Route path="/setup-member/loan-manager-edit/:id" element={withSuspense(LoanManagerEdit)} />
    <Route path="/setup-member/loan-manager-list" element={withSuspense(LoanManagerList)} />
    
    {/* Department Routes */}
    <Route path="/setup-member/department-list" element={withSuspense(DepartmentList)} />
    <Route path="/setup-member/department-create" element={withSuspense(DepartmentCreate)} />

    {/* Lock Function Routes */}
    <Route path="/setup-member/lock-function-create" element={withSuspense(LockFunctionCreate)} />
    <Route path="/setup-member/lock-function-list" element={withSuspense(LockFunctionList)} />

    {/* Lock Role Routes */}
    <Route path="/setup-member/lock-role-create" element={withSuspense(LockRoleCreate)} />
    <Route path="/setup-member/lock-role-list" element={withSuspense(LockRoleList)} />

    {/* Loyalty Manager Routes */}
    <Route path="/setup-member/loyalty-managers-create" element={withSuspense(LoyaltyManagersCreate)} />
    <Route path="/setup-member/loyalty-managers-edit/:id" element={withSuspense(LoyaltyManagersEdit)} />
    <Route path="/setup-member/loyalty-managers-list" element={withSuspense(LoyaltyManagersList)} />

    {/* Noticeboard Routes */}
    <Route path="/setup-member/noticeboard-create" element={withSuspense(NoticeboardCreate)} />
    <Route path="/setup-member/noticeboard-list" element={withSuspense(NoticeboardList)} />

    {/* Organization Routes */}
    <Route path="/setup-member/organization-create" element={withSuspense(OrganizationCreate)} />
    <Route path="/setup-member/organization-list" element={withSuspense(OrganizationList)} />
    <Route path="/setup-member/organization-update/:id" element={withSuspense(OrganizationUpdate)} />

    {/* Project Details Routes */}
    <Route path="/setup-member/project-details-create" element={withSuspense(ProjectDetailsCreate)} />
    <Route path="/setup-member/project-details-edit/:id" element={withSuspense(ProjectDetailsEdit)} />
    <Route path="/setup-member/project-details-view/:id" element={withSuspense(ProjectDetails)} />
    <Route path="/setup-member/project-details-list" element={withSuspense(ProjectDetailsList)} />


    <Route path="/setup-member/project-building-type" element={withSuspense(ProjectBuildingType)} />
    <Route path="/setup-member/project-building-type-edit/:id" element={withSuspense(ProjectBuildingTypeEdit)} />
    <Route path="/setup-member/project-building-type-list" element={withSuspense(ProjectBuildingTypeList)} />


    {/* Property Type Routes */}
    <Route path="/setup-member/property-type" element={withSuspense(PropertyType)} />
    <Route path="/setup-member/property-type-edit/:id" element={withSuspense(PropertyTypeEdit)} />
    <Route path="/setup-member/property-type-list" element={withSuspense(PropertyTypeList)} />

    {/* Referral Routes */}
    <Route path="/setup-member/referral-create" element={withSuspense(ReferralCreate)} />
    <Route path="/setup-member/referral-edit/:id" element={withSuspense(ReferralEdit)} />
    <Route path="/setup-member/referral-list" element={withSuspense(ReferralList)} />

    {/* Referral Program Routes */}
    <Route path="/setup-member/referral-program-create" element={withSuspense(ReferralProgramCreate)} />
    <Route path="/setup-member/referral-program-edit/:id" element={withSuspense(ReferralProgramEdit)} />
    <Route path="/setup-member/referral-program-list" element={withSuspense(ReferralProgramList)} />

    {/* Service Category Routes */}
    <Route path="/setup-member/service-category" element={withSuspense(ServiceCategory)} />
    <Route path="/setup-member/service-category/:serviceId" element={withSuspense(ServiceCategory)} />
    <Route path="/setup-member/service-category-list" element={withSuspense(ServiceCategoryList)} />

    {/* Site Routes */}
    <Route path="/setup-member/site-create" element={withSuspense(SiteCreate)} />
    <Route path="/setup-member/site-edit/:id" element={withSuspense(SiteEdit)} />
    <Route path="/setup-member/site-list" element={withSuspense(SiteList)} />

    {/* Site Visit Routes */}
    <Route path="/setup-member/site-visit-create" element={withSuspense(SiteVisitCreate)} />
    <Route path="/setup-member/site-visit-edit/:id" element={withSuspense(SiteVisitEdit)} />
    <Route path="/setup-member/site-visit-list" element={withSuspense(SiteVisitList)} />

    {/* Site Visit Slot Config Routes */}
    <Route path="/setup-member/site-visit-slot-config" element={withSuspense(SiteVisitSlotConfig)} />
    <Route path="/setup-member/site-visit-slot-config-list" element={withSuspense(SiteVisitSlotConfigList)} />

    {/* SMTP Settings Routes */}
    <Route path="/setup-member/smtp-settings-edit/:id" element={withSuspense(SmtpSettingsEdit)} />
    <Route path="/setup-member/smtp-settings-list" element={withSuspense(SmtpSettingsList)} />

    {/* Specification Routes */}
    <Route path="/setup-member/specification" element={withSuspense(Specification)} />
    <Route path="/setup-member/specification-list" element={withSuspense(SpecificationList)} />
    <Route path="/setup-member/specification-update/:id" element={withSuspense(SpecificationUpdate)} />

    {/* Support Service Routes */}
    <Route path="/setup-member/support-service-list" element={withSuspense(SupportServiceList)} />

    {/* Tag Routes */}
    <Route path="/setup-member/tag-add" element={withSuspense(TagAdd)} />

    {/* TDS Tutorials Routes */}
    <Route path="/setup-member/tds-tutorials-create" element={withSuspense(TdsTutorialsCreate)} />
    <Route path="/setup-member/tds-tutorials-edit/:id" element={withSuspense(TdsTutorialsEdit)} />
    <Route path="/setup-member/tds-tutorials-list" element={withSuspense(TdsTutorialsList)} />

    {/* Testimonial Routes */}
    <Route path="/setup-member/testimonials" element={withSuspense(Testimonials)} />
    <Route path="/setup-member/testimonial-edit/:id" element={withSuspense(TestimonialEdit)} />
    <Route path="/setup-member/testimonial-list" element={withSuspense(TestimonialList)} />

    {/* User Routes */}
    <Route path="/setup-member/user-create" element={withSuspense(UserCreate)} />
    <Route path="/setup-member/user-details/:id" element={withSuspense(UserDetails)} />
    <Route path="/setup-member/user-edit/:id" element={withSuspense(UserEdit)} />
    <Route path="/setup-member/user-list" element={withSuspense(UserList)} />

    {/* User Groups Routes */}
    <Route path="/setup-member/user-groups-create" element={withSuspense(UserGroupsCreate)} />
    <Route path="/setup-member/user-groups-edit/:id" element={withSuspense(UserGroupsEdit)} />
    <Route path="/setup-member/user-groups-list" element={withSuspense(UserGroupsList)} />

    {/* Press Releases Routes */}
    <Route path="/setup-member/press-releases-create" element={withSuspense(PressReleasesCreate)} />
    <Route path="/setup-member/press-releases-edit/:id" element={withSuspense(PressReleasesEdit)} />
    <Route path="/setup-member/press-releases-list" element={withSuspense(PressReleasesList)} />

    {/* Loyalty Module Routes */}
    <Route path="/setup-member/loyalty-members-list" element={withSuspense(LoyaltyMembersList)} />
    <Route path="/setup-member/loyalty-tiers-list" element={withSuspense(LoyaltyTiersList)} />
    <Route path="/setup-member/new-tier" element={withSuspense(NewTier)} />
    <Route path="/setup-member/rule-engine-list" element={withSuspense(RuleEngineList)} />
    <Route path="/setup-member/lock-payments-list" element={withSuspense(LockPaymentsList)} />
    <Route path="/setup-member/home-loan-requests-list" element={withSuspense(HomeLoanRequestsList)} />
    <Route path="/setup-member/demand-notes-list" element={withSuspense(DemandNotesList)} />
    <Route path="/setup-member/orders-list" element={withSuspense(OrdersList)} />
    <Route path="/setup-member/encash-list" element={withSuspense(EncashList)} />

    {/* Project Configuration Routes */}
    <Route path="/setup-member/project-configuration" element={withSuspense(ProjectConfiguration)} />
    <Route path="/setup-member/project-configuration-list" element={withSuspense(ProjectConfigurationList)} />

    {/* Site Visit Slot Config Routes */}
    <Route path="/setup-member/site-visit-slot-config" element={withSuspense(SiteVisitSlotConfig)} />
    <Route path="/setup-member/site-visit-slot-config-list" element={withSuspense(SiteVisitSlotConfigList)} />

    {/* Plus Services Routes */}
    <Route path="/setup-member/plus-services-list" element={withSuspense(PlusServicesList)} />
    <Route path="/setup-member/plus-services-create" element={withSuspense(PlusServicesCreate)} />
  </>
);
