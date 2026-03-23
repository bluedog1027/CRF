import { FieldType } from "./FieldType";

export interface ICRFFieldConfig {
  internalName: string;
  displayName: string;
  fieldType: FieldType;
  options?: string[];
  usedInContentTypes: string[];
}

export enum CRFContentType {
  General = "CRF General",
  Marketing = "CRF Marketing",
  Transfer = "CRF Transfer",
  QA = "CRF QA",
}

export type CRFFieldMap = Record<CRFContentType, ICRFFieldConfig[]>;
