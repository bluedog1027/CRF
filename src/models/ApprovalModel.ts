
/** Sharepoint List Item object name. This is needed in the body for Create, Update and Delete  
 * @example Contracts is string SP.Data.ContractsListItem
*/
type listItemName = {
  type: string;
}

/** Sharepoint Person lookup Field values  */
export type personObj = {
  "@odata.type": string;
  "@odata.id": string;
  Title: string;
  EMail: string;
}

/** Sharepoint People Picker Id Field  */
export type peopleField = {
  results: string[] | number[];
}

/** Sharepoint Multi Person lookup Field values  */
export type multiPersonObj = {
  results: personObj[];
}

export interface ISPApprovalIDS {
  '__metadata'?: listItemName;
  Id?: string | undefined;
  Title: string;
  ApprovalState: string;
  ApprovedBy: string;
  ApproverComment: string;
  RequestFrom: string;
  RequestFromID: string;
  ApprovalID: string;
  RoleID: string;
  WaitingState: string;
  AssignTo: personObj[];
  AssignToId?: peopleField;
  RequestDateEST: string;
  CompletionDateEST: string;
  ReAssignmentState: string;
  ChangeType:string;
  [key: string]: any;
}

interface Responder {
  id: string;
  displayName: string;
  email: string;
  tenantId: string;
  userPrincipalName: string;
}

export interface IAllApprovalResponse {
  responder: Responder;
  requestDate: string; // ISO 8601 format
  responseDate: string; // ISO 8601 format
  approverResponse: string;
  comments?: string; // Optional, since not all entries have comments
}