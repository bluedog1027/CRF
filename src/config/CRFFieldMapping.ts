import { CRFFieldMap } from "../models/CRFFieldModel";
import { FieldType } from "../models/FieldType";

export const CRF_FIELD_MAPPING: CRFFieldMap = {
  "CRF General": [
    {
      "internalName": "Title",
      "displayName": "Project/Event Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Desired_x0020_Publish_x0020_Date",
      "displayName": "Desired Publish Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Effective_x0020_Date",
      "displayName": "Effective Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Stores_x0020_or_x0020_Channels_x",
      "displayName": "Store Type or Channels Affected",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ALL US (including HI & PR)",
        "ALL CAN (including Quebec French)",
        "Select US",
        "Select CAN",
        "US GYM",
        "CAN GYM"
      ]
    },
    {
      "internalName": "Are_x0020_resources_x0020_availa",
      "displayName": "Are resources available for reference?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Will_x0020_materials_x0020_be_x0",
      "displayName": "Will materials be delivered to the store?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Are_x0020_materials_x0020_re_x00",
      "displayName": "Are materials re-orderable?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No",
        "N/A"
      ]
    },
    {
      "internalName": "Who_x0020_can_x0020_stores_x002f",
      "displayName": "Who can stores/DMs contact for support?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Scope_x0020_of_x0020_Project",
      "displayName": "Scope of Project",
      "fieldType": FieldType.Note
    },
    {
      "internalName": "Category_x0020_Name",
      "displayName": "Category Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Division",
      "displayName": "Division",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "Accessories/Shoes",
        "Newborn",
        "Big Boy",
        "Big Girl",
        "Toddler Boy",
        "Toddler Girl",
        "Sleep",
        "Graphics"
      ]
    },
    {
      "internalName": "Status",
      "displayName": "Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Pending",
        "Approved",
        "Unresolved​"
      ]
    },
    {
      "internalName": "Department",
      "displayName": "Department",
      "fieldType": FieldType.Choice,
      "options": [
        "Engagement",
        "Finance",
        "HR",
        "IT",
        "Internal Audit",
        "Legal",
        "Logistics",
        "Loss Prevention",
        "Maintenance",
        "Marketing",
        "Merchandising",
        "Omnichannel",
        "Planning & Allocation",
        "Quality Assurance",
        "Real Estate",
        "Store Comm",
        "Store Ops",
        "Supply/Maintenance",
        "Tax",
        "Visual",
        "N/A"
      ]
    },
    {
      "internalName": "Language",
      "displayName": "Language",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ENGLISH",
        "FRENCH",
        "SPANISH"
      ]
    },
    {
      "internalName": "Management_x0020_Visibility",
      "displayName": "Minimum Management Visibility",
      "fieldType": FieldType.Choice,
      "options": [
        "All Store Associates",
        "District Managers",
        "HQ",
        "Store Leaders (SLs or Keyholders)",
        "Store Managers",
        "Regional Directors"
      ]
    },
    {
      "internalName": "Who_x0020_in_x0020_Store_x0020_O",
      "displayName": "What member of Store Operations has reviewed this CRF? What other team members should be included in the approval email?",
      "fieldType": FieldType.UserMulti
    },
    {
      "internalName": "Expiration_x0020_Date",
      "displayName": "Portal Expiration Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Comm_x0020_Status",
      "displayName": "Comm Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Cancelled",
        "Placeholder",
        "Pending Draft",
        "Published"
      ]
    },
    {
      "internalName": "Monthly_x0020_Agenda_x003f_",
      "displayName": "Monthly Agenda?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Error_x003f_",
      "displayName": "Error?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Reason_x0020_for_x0020_error_x00",
      "displayName": "Reason for error?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Actual_x0020_Publication_x0020_D",
      "displayName": "Actual Publication Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "First_x0020_draft_x0020_due_x002",
      "displayName": "First draft due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Final_x0020_approval_x0020_due_x",
      "displayName": "Final approval due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Communication_x0020_Vehicle",
      "displayName": "Communication Vehicle",
      "fieldType": FieldType.Choice,
      "options": [
        "Store Portal- Pricing",
        "Store Portal- Newsletter",
        "Store Portal- Store Ops Omni",
        "Store Portal- Marketing/Visual",
        "Store Portal- QA/Transfers",
        "Store Portal- HR",
        "Store Portal- Misc.",
        "Store Alert",
        "Monthly Agenda",
        "UFU",
        "News Article",
        "TSt Email",
        "Workload Calendar",
        "Mailpack",
        "Bi-Weekly Newsletter"
      ]
    },
    {
      "internalName": "Approval_x0020_Lock",
      "displayName": "Approval Lock",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Actual_x0020_Fiscal_x0020_Week",
      "displayName": "Published Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Comm_x0020_Owner",
      "displayName": "Comm Owner",
      "fieldType": FieldType.Choice,
      "options": [
        "Barbara Van Voorhis",
        "Michelle Tucci"
      ]
    },
    {
      "internalName": "Submitter",
      "displayName": "Approver",
      "fieldType": FieldType.User
    },
    {
      "internalName": "Comm_x0020_Type",
      "displayName": "Comm Error Type",
      "fieldType": FieldType.Choice,
      "options": [
        "Mid-Day Pricing",
        "Pricing Update",
        "Quality",
        "Re-price/Re-ticket",
        "Transfer"
      ]
    },
    {
      "internalName": "Impacted_x0020_Brand",
      "displayName": "Impacted Brand",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "TCP",
        "GYM"
      ]
    },
    {
      "internalName": "Effective_x0020_Fiscal_x0020_Wee",
      "displayName": "Effective Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Effective_x0020_End_x0020_Date",
      "displayName": "Effective End Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "qs8f",
      "displayName": "Text",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "FlowStatus",
      "displayName": "FlowStatus",
      "fieldType": FieldType.Choice,
      "options": [
        "Created",
        "Changed",
        "Finished"
      ]
    },
    {
      "internalName": "Sign_x002d_off_x0020_status",
      "displayName": "Sign-off status",
      "fieldType": FieldType.Text
    }
  ],
  "CRF Marketing": [
    {
      "internalName": "Title",
      "displayName": "Project/Event Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Desired_x0020_Publish_x0020_Date",
      "displayName": "Desired Publish Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Effective_x0020_Date",
      "displayName": "Effective Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Stores_x0020_or_x0020_Channels_x",
      "displayName": "Store Type or Channels Affected",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ALL US (including HI & PR)",
        "ALL CAN (including Quebec French)",
        "Select US",
        "Select CAN",
        "US GYM",
        "CAN GYM"
      ]
    },
    {
      "internalName": "Are_x0020_resources_x0020_availa",
      "displayName": "Are resources available for reference?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Will_x0020_materials_x0020_be_x0",
      "displayName": "Will materials be delivered to the store?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Are_x0020_materials_x0020_re_x00",
      "displayName": "Are materials re-orderable?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No",
        "N/A"
      ]
    },
    {
      "internalName": "Who_x0020_can_x0020_stores_x002f",
      "displayName": "Who can stores/DMs contact for support?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Scope_x0020_of_x0020_Project",
      "displayName": "Scope of Project",
      "fieldType": FieldType.Note
    },
    {
      "internalName": "Due_x0020_by_x0020_Date",
      "displayName": "Due By Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Distribution_x0020_Start_x0020_D",
      "displayName": "Distribution Start Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Distribution_x0020_End_x0020_Dat",
      "displayName": "Distribution End Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Redemption_x0020_Start_x0020_Dat",
      "displayName": "Redemption Start Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Redemption_x0020_End_x0020_Date",
      "displayName": "Redemption End Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Terms_x0020__x0026__x0020_Condit",
      "displayName": "Terms & Conditions",
      "fieldType": FieldType.Note
    },
    {
      "internalName": "Can_x0020_marketing_x0020_materi",
      "displayName": "Can coupons be purged upon completion?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No",
        "N/A"
      ]
    },
    {
      "internalName": "Will_x0020_online_x002c__x0020_e",
      "displayName": "Will online, email, text, or direct mailing be sent to customers?",
      "fieldType": FieldType.Note
    },
    {
      "internalName": "Status",
      "displayName": "Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Pending",
        "Approved",
        "Unresolved​"
      ]
    },
    {
      "internalName": "Department",
      "displayName": "Department",
      "fieldType": FieldType.Choice,
      "options": [
        "Engagement",
        "Finance",
        "HR",
        "IT",
        "Internal Audit",
        "Legal",
        "Logistics",
        "Loss Prevention",
        "Maintenance",
        "Marketing",
        "Merchandising",
        "Omnichannel",
        "Planning & Allocation",
        "Quality Assurance",
        "Real Estate",
        "Store Comm",
        "Store Ops",
        "Supply/Maintenance",
        "Tax",
        "Visual",
        "N/A"
      ]
    },
    {
      "internalName": "Language",
      "displayName": "Language",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ENGLISH",
        "FRENCH",
        "SPANISH"
      ]
    },
    {
      "internalName": "Management_x0020_Visibility",
      "displayName": "Minimum Management Visibility",
      "fieldType": FieldType.Choice,
      "options": [
        "All Store Associates",
        "District Managers",
        "HQ",
        "Store Leaders (SLs or Keyholders)",
        "Store Managers",
        "Regional Directors"
      ]
    },
    {
      "internalName": "Who_x0020_in_x0020_Store_x0020_O",
      "displayName": "What member of Store Operations has reviewed this CRF? What other team members should be included in the approval email?",
      "fieldType": FieldType.UserMulti
    },
    {
      "internalName": "Expiration_x0020_Date",
      "displayName": "Portal Expiration Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Comm_x0020_Status",
      "displayName": "Comm Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Cancelled",
        "Placeholder",
        "Pending Draft",
        "Published"
      ]
    },
    {
      "internalName": "Monthly_x0020_Agenda_x003f_",
      "displayName": "Monthly Agenda?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Error_x003f_",
      "displayName": "Error?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Reason_x0020_for_x0020_error_x00",
      "displayName": "Reason for error?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Actual_x0020_Publication_x0020_D",
      "displayName": "Actual Publication Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "First_x0020_draft_x0020_due_x002",
      "displayName": "First draft due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Final_x0020_approval_x0020_due_x",
      "displayName": "Final approval due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Communication_x0020_Vehicle",
      "displayName": "Communication Vehicle",
      "fieldType": FieldType.Choice,
      "options": [
        "Store Portal- Pricing",
        "Store Portal- Newsletter",
        "Store Portal- Store Ops Omni",
        "Store Portal- Marketing/Visual",
        "Store Portal- QA/Transfers",
        "Store Portal- HR",
        "Store Portal- Misc.",
        "Store Alert",
        "Monthly Agenda",
        "UFU",
        "News Article",
        "TSt Email",
        "Workload Calendar",
        "Mailpack",
        "Bi-Weekly Newsletter"
      ]
    },
    {
      "internalName": "Approval_x0020_Lock",
      "displayName": "Approval Lock",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "CRF_x0020_Approval_x0020_WF_x002",
      "displayName": "CRF Approval WF 7920",
      "fieldType": FieldType.URL
    },
    {
      "internalName": "Actual_x0020_Fiscal_x0020_Week",
      "displayName": "Published Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Comm_x0020_Owner",
      "displayName": "Comm Owner",
      "fieldType": FieldType.Choice,
      "options": [
        "Barbara Van Voorhis",
        "Michelle Tucci"
      ]
    },
    {
      "internalName": "Submitter",
      "displayName": "Approver",
      "fieldType": FieldType.User
    },
    {
      "internalName": "Comm_x0020_Type",
      "displayName": "Comm Error Type",
      "fieldType": FieldType.Choice,
      "options": [
        "Mid-Day Pricing",
        "Pricing Update",
        "Quality",
        "Re-price/Re-ticket",
        "Transfer"
      ]
    },
    {
      "internalName": "Impacted_x0020_Brand",
      "displayName": "Impacted Brand",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "TCP",
        "GYM"
      ]
    },
    {
      "internalName": "Effective_x0020_Fiscal_x0020_Wee",
      "displayName": "Effective Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Effective_x0020_End_x0020_Date",
      "displayName": "Effective End Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "FlowStatus",
      "displayName": "FlowStatus",
      "fieldType": FieldType.Choice,
      "options": [
        "Created",
        "Changed",
        "Finished"
      ]
    },
    {
      "internalName": "Sign_x002d_off_x0020_status",
      "displayName": "Sign-off status",
      "fieldType": FieldType.Text
    }
  ],
  "CRF Transfer": [
    {
      "internalName": "Title",
      "displayName": "Project/Event Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Desired_x0020_Publish_x0020_Date",
      "displayName": "Desired Publish Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Effective_x0020_Date",
      "displayName": "Effective Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Stores_x0020_or_x0020_Channels_x",
      "displayName": "Store Type or Channels Affected",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ALL US (including HI & PR)",
        "ALL CAN (including Quebec French)",
        "Select US",
        "Select CAN",
        "US GYM",
        "CAN GYM"
      ]
    },
    {
      "internalName": "Are_x0020_resources_x0020_availa",
      "displayName": "Are resources available for reference?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Will_x0020_materials_x0020_be_x0",
      "displayName": "Will materials be delivered to the store?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Are_x0020_materials_x0020_re_x00",
      "displayName": "Are materials re-orderable?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No",
        "N/A"
      ]
    },
    {
      "internalName": "Who_x0020_can_x0020_stores_x002f",
      "displayName": "Who can stores/DMs contact for support?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Scope_x0020_of_x0020_Project",
      "displayName": "Scope of Project",
      "fieldType": FieldType.Note
    },
    {
      "internalName": "What_x0020_type_x0020_of_x0020_m",
      "displayName": "What type of merchandise do you want transferred?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Is_x0020_there_x0020_a_x0020_spe",
      "displayName": "Is there a specific transfer-in direction?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Is_x0020_there_x0020_a_x0020_spe0",
      "displayName": "Is there a specific transfer-out direction?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "When_x0020_do_x0020_you_x0020_wa",
      "displayName": "When do you want the transfer completed by?",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Category_x0020_Name",
      "displayName": "Category Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Smart_x0020_Code",
      "displayName": "Smart Code",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Generic_x0020_Article_x0020_Numb",
      "displayName": "Generic Article Number",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Generic_x0020_Article_x0020_Desc",
      "displayName": "Generic Article Description",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "UPAs",
      "displayName": "UPAS",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Is_x0020_this_x0020_a_x0020_stor",
      "displayName": "Is this a store to store transfer or store to DC transfer?",
      "fieldType": FieldType.Choice,
      "options": [
        "Store to Store",
        "Store to DC"
      ]
    },
    {
      "internalName": "Division",
      "displayName": "Division",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "Accessories/Shoes",
        "Newborn",
        "Big Boy",
        "Big Girl",
        "Toddler Boy",
        "Toddler Girl",
        "Sleep",
        "Graphics"
      ]
    },
    {
      "internalName": "Status",
      "displayName": "Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Pending",
        "Approved",
        "Unresolved​"
      ]
    },
    {
      "internalName": "Department",
      "displayName": "Department",
      "fieldType": FieldType.Choice,
      "options": [
        "Engagement",
        "Finance",
        "HR",
        "IT",
        "Internal Audit",
        "Legal",
        "Logistics",
        "Loss Prevention",
        "Maintenance",
        "Marketing",
        "Merchandising",
        "Omnichannel",
        "Planning & Allocation",
        "Quality Assurance",
        "Real Estate",
        "Store Comm",
        "Store Ops",
        "Supply/Maintenance",
        "Tax",
        "Visual",
        "N/A"
      ]
    },
    {
      "internalName": "Language",
      "displayName": "Language",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ENGLISH",
        "FRENCH",
        "SPANISH"
      ]
    },
    {
      "internalName": "Management_x0020_Visibility",
      "displayName": "Minimum Management Visibility",
      "fieldType": FieldType.Choice,
      "options": [
        "All Store Associates",
        "District Managers",
        "HQ",
        "Store Leaders (SLs or Keyholders)",
        "Store Managers",
        "Regional Directors"
      ]
    },
    {
      "internalName": "Who_x0020_in_x0020_Store_x0020_O",
      "displayName": "What member of Store Operations has reviewed this CRF? What other team members should be included in the approval email?",
      "fieldType": FieldType.UserMulti
    },
    {
      "internalName": "Expiration_x0020_Date",
      "displayName": "Portal Expiration Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Comm_x0020_Status",
      "displayName": "Comm Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Cancelled",
        "Placeholder",
        "Pending Draft",
        "Published"
      ]
    },
    {
      "internalName": "Monthly_x0020_Agenda_x003f_",
      "displayName": "Monthly Agenda?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Error_x003f_",
      "displayName": "Error?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Reason_x0020_for_x0020_error_x00",
      "displayName": "Reason for error?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Actual_x0020_Publication_x0020_D",
      "displayName": "Actual Publication Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "First_x0020_draft_x0020_due_x002",
      "displayName": "First draft due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Final_x0020_approval_x0020_due_x",
      "displayName": "Final approval due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Communication_x0020_Vehicle",
      "displayName": "Communication Vehicle",
      "fieldType": FieldType.Choice,
      "options": [
        "Store Portal- Pricing",
        "Store Portal- Newsletter",
        "Store Portal- Store Ops Omni",
        "Store Portal- Marketing/Visual",
        "Store Portal- QA/Transfers",
        "Store Portal- HR",
        "Store Portal- Misc.",
        "Store Alert",
        "Monthly Agenda",
        "UFU",
        "News Article",
        "TSt Email",
        "Workload Calendar",
        "Mailpack",
        "Bi-Weekly Newsletter"
      ]
    },
    {
      "internalName": "Approval_x0020_Lock",
      "displayName": "Approval Lock",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Actual_x0020_Fiscal_x0020_Week",
      "displayName": "Published Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Comm_x0020_Owner",
      "displayName": "Comm Owner",
      "fieldType": FieldType.Choice,
      "options": [
        "Barbara Van Voorhis",
        "Michelle Tucci"
      ]
    },
    {
      "internalName": "Submitter",
      "displayName": "Approver",
      "fieldType": FieldType.User
    },
    {
      "internalName": "Comm_x0020_Type",
      "displayName": "Comm Error Type",
      "fieldType": FieldType.Choice,
      "options": [
        "Mid-Day Pricing",
        "Pricing Update",
        "Quality",
        "Re-price/Re-ticket",
        "Transfer"
      ]
    },
    {
      "internalName": "Impacted_x0020_Brand",
      "displayName": "Impacted Brand",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "TCP",
        "GYM"
      ]
    },
    {
      "internalName": "Effective_x0020_Fiscal_x0020_Wee",
      "displayName": "Effective Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Effective_x0020_End_x0020_Date",
      "displayName": "Effective End Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "FlowStatus",
      "displayName": "FlowStatus",
      "fieldType": FieldType.Choice,
      "options": [
        "Created",
        "Changed",
        "Finished"
      ]
    },
    {
      "internalName": "Sign_x002d_off_x0020_status",
      "displayName": "Sign-off status",
      "fieldType": FieldType.Text
    }
  ],
  "CRF QA": [
    {
      "internalName": "Title",
      "displayName": "Project/Event Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Desired_x0020_Publish_x0020_Date",
      "displayName": "Desired Publish Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Effective_x0020_Date",
      "displayName": "Effective Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Stores_x0020_or_x0020_Channels_x",
      "displayName": "Store Type or Channels Affected",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ALL US (including HI & PR)",
        "ALL CAN (including Quebec French)",
        "Select US",
        "Select CAN",
        "US GYM",
        "CAN GYM"
      ]
    },
    {
      "internalName": "Are_x0020_resources_x0020_availa",
      "displayName": "Are resources available for reference?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Will_x0020_materials_x0020_be_x0",
      "displayName": "Will materials be delivered to the store?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Are_x0020_materials_x0020_re_x00",
      "displayName": "Are materials re-orderable?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No",
        "N/A"
      ]
    },
    {
      "internalName": "Who_x0020_can_x0020_stores_x002f",
      "displayName": "Who can stores/DMs contact for support?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Scope_x0020_of_x0020_Project",
      "displayName": "Scope of Project",
      "fieldType": FieldType.Note
    },
    {
      "internalName": "Smart_x0020_Code",
      "displayName": "Smart Code",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Generic_x0020_Article_x0020_Numb",
      "displayName": "Generic Article Number",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Generic_x0020_Article_x0020_Desc",
      "displayName": "Generic Article Description",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Was_x0020_this_x0020_request_x00",
      "displayName": "Was this request initiated by the Legal department?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Legal_x0020_Approver_x0020_Name",
      "displayName": "Legal Approver Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Merchant_x0020_Approver_x0020_Na",
      "displayName": "Merchant Approver Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Sourcing_x0020_Approver_x0020_Na",
      "displayName": "Sourcing Approver Name",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Division",
      "displayName": "Division",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "Accessories/Shoes",
        "Newborn",
        "Big Boy",
        "Big Girl",
        "Toddler Boy",
        "Toddler Girl",
        "Sleep",
        "Graphics"
      ]
    },
    {
      "internalName": "Style_x0020_Color_x0028_s_x0029_",
      "displayName": "Style Color(s)",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Style_x0020_Size_x0028_s_x0029_",
      "displayName": "Style Size(s)",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Description_x0020_of_x0020_Quali",
      "displayName": "Description of Quality Issue",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Is_x0020_inspection_x0020_requir",
      "displayName": "Is inspection required?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Initial_x0020_Store_x0020_Action",
      "displayName": "Initial Store Action",
      "fieldType": FieldType.Choice,
      "options": [
        "Hold (Follow up action TBD)",
        "Transfer to DC",
        "Transfer to HQ",
        "Transfer to Other",
        "Destroy",
        "Recall (Transfer to DC)",
        "Recall (Transfer to HQ)",
        "Recall (Transfer to Other)",
        "Damage Out (Sellable-Keep in store)",
        "Damage Out (Non-Sellable-Transfer to salvage company)",
        "Damage Out (Non-Sellable-Transfer to charity-HI & PR)",
        "Damage Out (Non-Sellable-Destroy-CAN ONLY)"
      ]
    },
    {
      "internalName": "Action_x0020_for_x0020_Returns",
      "displayName": "Action for Returns",
      "fieldType": FieldType.Choice,
      "options": [
        "Pull & Hold (Follow up action TBD)",
        "Recall (Transfer to DC)",
        "Recall (Transfer to HQ)",
        "Recall (Transfer to Other)",
        "Destroy",
        "Pull & Transfer to DC",
        "Pull & Transfer to HQ",
        "Pull & Transfer to Other",
        "Damage Out (Sellable-Keep in store)",
        "Damage Out (Non-Sellable-Transfer to salvage company)",
        "Damage Out (Non-Sellable-Transfer to charity)",
        "Damage Out (Non-Sellable-Destroy)"
      ]
    },
    {
      "internalName": "Action_x0020_for_x0020_Incoming_",
      "displayName": "Action for Incoming Shipments",
      "fieldType": FieldType.Choice,
      "options": [
        "No additional shipments expected",
        "Pull & Hold (Follow up action TBD)",
        "Recall (Transfer to DC)",
        "Recall (Transfer to HQ)",
        "Recall (Transfer to Other)",
        "Destroy",
        "Pull & Transfer to DC",
        "Pull & Transfer to HQ",
        "Pull & Transfer to Other",
        "Damage Out (Sellable-Keep in store)",
        "Damage Out (Non-Sellable-Transfer to salvage company)",
        "Damage Out (Non-Sellable-Transfer to charity)",
        "Damage Out (Non-Sellable-Destroy)"
      ]
    },
    {
      "internalName": "UPAs_x0020_On_x0020_Hand",
      "displayName": "UPAS On Hand",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Are_x0020_items_x0020_in_x0020_t",
      "displayName": "Are items in transit?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "UPAs_x0020_arriving_x0020_in_x00",
      "displayName": "UPAS arriving in shipment",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Is_x0020_a_x0020_compliance_x002",
      "displayName": "Is a compliance survey required?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Is_x0020_the_x0020_Store_x0020_L",
      "displayName": "Is the Store Labor Team funding payroll to support this?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Compliance_x0020_Survey_x0020_Li",
      "displayName": "Compliance Survey Link",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Payroll_x0020_Direction",
      "displayName": "Is there specific Payroll direction?",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Inspection_x0020_Guidelines",
      "displayName": "Are there specific inspection guidelines?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Status",
      "displayName": "Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Pending",
        "Approved",
        "Unresolved​"
      ]
    },
    {
      "internalName": "Department",
      "displayName": "Department",
      "fieldType": FieldType.Choice,
      "options": [
        "Engagement",
        "Finance",
        "HR",
        "IT",
        "Internal Audit",
        "Legal",
        "Logistics",
        "Loss Prevention",
        "Maintenance",
        "Marketing",
        "Merchandising",
        "Omnichannel",
        "Planning & Allocation",
        "Quality Assurance",
        "Real Estate",
        "Store Comm",
        "Store Ops",
        "Supply/Maintenance",
        "Tax",
        "Visual",
        "N/A"
      ]
    },
    {
      "internalName": "Language",
      "displayName": "Language",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "ENGLISH",
        "FRENCH",
        "SPANISH"
      ]
    },
    {
      "internalName": "Management_x0020_Visibility",
      "displayName": "Minimum Management Visibility",
      "fieldType": FieldType.Choice,
      "options": [
        "All Store Associates",
        "District Managers",
        "HQ",
        "Store Leaders (SLs or Keyholders)",
        "Store Managers",
        "Regional Directors"
      ]
    },
    {
      "internalName": "Who_x0020_in_x0020_Store_x0020_O",
      "displayName": "What member of Store Operations has reviewed this CRF? What other team members should be included in the approval email?",
      "fieldType": FieldType.UserMulti
    },
    {
      "internalName": "Expiration_x0020_Date",
      "displayName": "Portal Expiration Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Comm_x0020_Status",
      "displayName": "Comm Status",
      "fieldType": FieldType.Choice,
      "options": [
        "Cancelled",
        "Placeholder",
        "Pending Draft",
        "Published"
      ]
    },
    {
      "internalName": "Monthly_x0020_Agenda_x003f_",
      "displayName": "Monthly Agenda?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Error_x003f_",
      "displayName": "Error?",
      "fieldType": FieldType.Choice,
      "options": [
        "No",
        "Yes"
      ]
    },
    {
      "internalName": "Reason_x0020_for_x0020_error_x00",
      "displayName": "Reason for error?",
      "fieldType": FieldType.Text
    },
    {
      "internalName": "Actual_x0020_Publication_x0020_D",
      "displayName": "Actual Publication Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "First_x0020_draft_x0020_due_x002",
      "displayName": "First draft due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Final_x0020_approval_x0020_due_x",
      "displayName": "Final approval due by:",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "Communication_x0020_Vehicle",
      "displayName": "Communication Vehicle",
      "fieldType": FieldType.Choice,
      "options": [
        "Store Portal- Pricing",
        "Store Portal- Newsletter",
        "Store Portal- Store Ops Omni",
        "Store Portal- Marketing/Visual",
        "Store Portal- QA/Transfers",
        "Store Portal- HR",
        "Store Portal- Misc.",
        "Store Alert",
        "Monthly Agenda",
        "UFU",
        "News Article",
        "TSt Email",
        "Workload Calendar",
        "Mailpack",
        "Bi-Weekly Newsletter"
      ]
    },
    {
      "internalName": "Approval_x0020_Lock",
      "displayName": "Approval Lock",
      "fieldType": FieldType.Choice,
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "internalName": "Actual_x0020_Fiscal_x0020_Week",
      "displayName": "Published Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Comm_x0020_Owner",
      "displayName": "Comm Owner",
      "fieldType": FieldType.Choice,
      "options": [
        "Barbara Van Voorhis",
        "Michelle Tucci"
      ]
    },
    {
      "internalName": "Submitter",
      "displayName": "Approver",
      "fieldType": FieldType.User
    },
    {
      "internalName": "Comm_x0020_Type",
      "displayName": "Comm Error Type",
      "fieldType": FieldType.Choice,
      "options": [
        "Mid-Day Pricing",
        "Pricing Update",
        "Quality",
        "Re-price/Re-ticket",
        "Transfer"
      ]
    },
    {
      "internalName": "Impacted_x0020_Brand",
      "displayName": "Impacted Brand",
      "fieldType": FieldType.MultiChoice,
      "options": [
        "TCP",
        "GYM"
      ]
    },
    {
      "internalName": "Effective_x0020_Fiscal_x0020_Wee",
      "displayName": "Effective Fiscal Week",
      "fieldType": FieldType.Number
    },
    {
      "internalName": "Effective_x0020_End_x0020_Date",
      "displayName": "Effective End Date",
      "fieldType": FieldType.DateTime
    },
    {
      "internalName": "FlowStatus",
      "displayName": "FlowStatus",
      "fieldType": FieldType.Choice,
      "options": [
        "Created",
        "Changed",
        "Finished"
      ]
    },
    {
      "internalName": "Sign_x002d_off_x0020_status",
      "displayName": "Sign-off status",
      "fieldType": FieldType.Text
    }
  ]
};
