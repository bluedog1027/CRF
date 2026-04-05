export interface IApprovalView {
    name: string;
    id: string;
    type: string;
    properties: Properties;
    environment: string;
}

interface Properties {
    type: string;
    isActive: boolean;
    userRoles: string[];
    owner: User;
    title: string;
    details: string;
    detailsArry?: string[];
    allowCancel: boolean;
    enableNotifications: boolean;
    creationDate: string;
    dueDate: string;
    expirationDate: string;
    userRequest: UserRequest;
    approvers: string[];
    principals: Principal[];
    priority: string;
    requestType: string;
    currentStepNumber: number;
}

interface User {
    id: string;
    email: string;
    type: string;
    tenantId: string;
    userPrincipalName: string;
}

interface UserRequest {
    stage: string;
    creationDate: string;
    dueDate: string;
    expirationDate: string;
    assignedTo: User;
    allowReassignment: boolean;
    isReassigned: boolean;
    responseOptions: string[];
    stepNumber: number;
}

interface Principal {
    id: string;
    displayName: string;
    email: string;
    type: string;
    tenantId: string;
    userPrincipalName: string;
}

export interface approvalResponse {
    "responseId": string;
    "approvalId": string;
    "responder": string;
    "response": string;
    "timestamp": string;
}



interface responseUser {
    id: string;
    email: string;
    type: string;
    tenantId: string;
    userPrincipalName: string;
}

interface responseProperties {
    stage: string;
    status: string;
    creationDate: string;
    owner: responseUser;
    response: string;
}

export interface IApprovalResponse {
    name: string;
    id: string;
    type: string;
    properties: responseProperties;
}


interface detailResponseProperties extends responseProperties {
    creator: responseUser;
    details: string;
    result: string;
    dueDate: string;
    expirationDate: string;
    completionDate: string;
    allowCancel: boolean,
    allowReassign: boolean,
    status: string;
    stage: string;
    attachments: any[];
    textAttachments: any[];
    priority: string;
    requestType: string;
    title:string;
}

export interface IApprovalDetail extends IApprovalResponse {
    properties: detailResponseProperties;
}