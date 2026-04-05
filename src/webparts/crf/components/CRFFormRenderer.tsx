import * as React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Body1Strong,
  Button,
  Caption1,
  Dropdown,
  Field,
  Input,
  Option,
  Switch,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { PeoplePicker, PrincipalType, IPeoplePickerContext } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { CRF_FIELD_MAPPING } from "../../../config/CRFFieldMapping";
import { CRFContentType, ICRFFieldConfig } from "../../../models/CRFFieldModel";
import { FieldType } from "../../../models/FieldType";
import { ICRFFormItem, IUserReference } from "../../../models/ICRFFormItem";
import { CRFService } from "../../../services/CRFService";
import styles from "./Crf.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import CRApprovals from "./CRApprovals";
import { Stack } from "@fluentui/react/lib/Stack";
import { _createSPListItem, isFalsy } from "../../../services/Util";
import { ISPApprovalIDS } from "../../../models/ApprovalModel";

export interface ICRFFormRendererProps {
  contentType: CRFContentType;
  service: CRFService;
  isWorkflowOwner: boolean;
  initialValues?: Partial<ICRFFormItem> | null;
  isSubmitting?: boolean;
  context: WebPartContext;
  onSubmit: (values: Partial<ICRFFormItem>, attachments: File[]) => Promise<void>;
  onCancel: () => void;
}

const OWNER_ONLY_HIDDEN_FIELDS = new Set([
  "Expiration_x0020_Date",
  "Language",
  "FlowStatus",
  "Impacted_x0020_Brand",
  "Division",
  "Category_x0020_Name",
  "Comm_x0020_Type",
  "Submitter",
  "qs8f",
  "Status",
  "Comm_x0020_Owner",
  "Reason_x0020_for_x0020_error_x00",
  "Error_x003f_",
  "Monthly_x0020_Agenda_x003f_",
  "Approval_x0020_Lock",
  "Sign_x002d_off_x0020_status",
  "CRF_x0020_Approval_x0020_WF_x002"
]);

const OWNER_ONLY_EDIT_FIELDS = new Set([
  "Comm_x0020_Status",
  "Communication_x0020_Vehicle",
  "Actual_x0020_Publication_x0020_D",
  "First_x0020_draft_x0020_due_x002",
  "Final_x0020_approval_x0020_due_x",
  "Actual_x0020_Fiscal_x0020_Week",
]);

const defaultValueForField = (field: ICRFFieldConfig, item?: Partial<ICRFFormItem> | null): any => {
  const existing = item?.[field.internalName as keyof ICRFFormItem] as any;

  if (existing !== undefined && existing !== null) {
    if (field.fieldType === FieldType.MultiChoice && Array.isArray(existing)) {
      return [...existing];
    }
    if (field.fieldType === FieldType.UserMulti && Array.isArray(existing)) {
      return [...existing];
    }
    return existing;
  }

  switch (field.fieldType) {
    case FieldType.MultiChoice:
    case FieldType.UserMulti:
      return [];
    case FieldType.User:
    case FieldType.DateTime:
    case FieldType.Number:
    case FieldType.URL:
      return null;
    case FieldType.Boolean:
      return false;
    default:
      return "";
  }
};

const CRFFormRenderer: React.FC<ICRFFormRendererProps> = ({
  contentType,
  service,
  isWorkflowOwner,
  initialValues,
  isSubmitting,
  context,
  onSubmit,
  onCancel,
}) => {
  const fieldConfigs = React.useMemo(() => CRF_FIELD_MAPPING[contentType] ?? [], [contentType]);
  const visibleFields = React.useMemo(
    () => fieldConfigs.filter((field) => !OWNER_ONLY_HIDDEN_FIELDS.has(field.internalName)),
    [fieldConfigs]
  );
  const ownerOnlyFields = React.useMemo(
    () => fieldConfigs.filter((field) => OWNER_ONLY_HIDDEN_FIELDS.has(field.internalName)),
    [fieldConfigs]
  );
  const initialState = React.useMemo(() => {
    const state: Record<string, any> = {};
    fieldConfigs.forEach((field) => {
      state[field.internalName] = defaultValueForField(field, initialValues ?? undefined);
    });
    state.Title = initialValues?.Title ?? state.Title ?? "";
    return state;
  }, [fieldConfigs, initialValues]);

  const [formValues, setFormValues] = React.useState<Record<string, any>>(initialState);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: "https://cplace.sharepoint.com/sites/workflows/storeops",
    msGraphClientFactory: context.msGraphClientFactory as any,
    spHttpClient: context.spHttpClient as any
  };

  React.useEffect(() => {
    setFormValues(initialState);
    setErrors({});
    setAttachments([]);
  }, [initialState]);

  const handleChange = React.useCallback((fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const createApproval = React.useCallback(() => {
       const body:Partial<ISPApprovalIDS> = {
          __metadata : {
            type: 'SP.Data.CRFApprovalsListItem'
          },
          Title: initialValues?.Title,
          RequestFromID: initialValues?.Id?.toString()
       }
      _createSPListItem<ISPApprovalIDS>(context.spHttpClient, `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('CRFApprovals')/items`, JSON.stringify(body))
      .then(data => console.log(data))
      .catch(error => console.log(error));
  }, [])

  const validate = React.useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!formValues.Title || !formValues.Title.trim()) {
      nextErrors.Title = "Project/Event Name is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formValues.Title]);

  const handleSubmit = async (event: React.FormEvent):Promise<void> => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload: Record<string, any> = {};
    fieldConfigs.forEach((field) => {
      if (!isWorkflowOwner && OWNER_ONLY_HIDDEN_FIELDS.has(field.internalName)) {
        return;
      }
      if (!isWorkflowOwner && OWNER_ONLY_EDIT_FIELDS.has(field.internalName)) {
        return;
      }
      payload[field.internalName] = formValues[field.internalName];
    });

    payload.Title = formValues.Title;
    await onSubmit(payload, attachments);
  };

  const renderField = (field: ICRFFieldConfig, isReadOnly: boolean) : JSX.Element => {
    const value = formValues[field.internalName];
    const error = errors[field.internalName];

    switch (field.fieldType) {
      case FieldType.Note:
        return (
          <Field label={field.displayName} validationMessage={error} validationState={error ? "error" : undefined}>
            <Textarea
              value={value ?? ""}
              onChange={(_, data) => handleChange(field.internalName, data.value)}
              resize="vertical"
              className={styles.fullWidth}
              rows={4}
              disabled={isReadOnly}
            />
          </Field>
        );
      case FieldType.MultiChoice:
        return (
          <Field label={field.displayName}>
            <Dropdown
              multiselect
              selectedOptions={Array.isArray(value) ? value : []}
              value={Array.isArray(value) ? value.toString() : ''}
              inlinePopup
              onOptionSelect={(_, data) => {
                handleChange(field.internalName, data.selectedOptions);
              }}
              //className={styles.fullWidth}
              disabled={isReadOnly}
            >
              {(field.options ?? []).map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Field>
        );
      case FieldType.Choice:
        return (
          <Field label={field.displayName}>
            <Dropdown
              inlinePopup
              selectedOptions={value ? [value] : []}
              value={value.toString() ?? ''}
              onOptionSelect={(_, data) => handleChange(field.internalName, data.optionValue)}
              //className={styles.fullWidth}
              disabled={isReadOnly}
            >
              {(field.options ?? []).map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </Field>
        );
      case FieldType.DateTime:
        return (
          <Field label={field.displayName}>
            <Input
              type="date"
              value={
                value
                  ? new Date(value).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(_, data) =>
                handleChange(
                  field.internalName,
                  data.value ? new Date(`${data.value}T00:00:00`).toISOString() : null
                )
              }
              disabled={isReadOnly}
            />
          </Field>
        );
      case FieldType.Boolean:
        return (
          <Field label={field.displayName}>
            <Switch
              checked={Boolean(value)}
              onChange={(_, data) => handleChange(field.internalName, data.checked)}
              disabled={isReadOnly}
            />
          </Field>
        );
      case FieldType.Number:
        return (
          <Field label={field.displayName}>
            <Input
              type="number"
              value={value?.toString() ?? ""}
              onChange={(_, data) => handleChange(field.internalName, data.value ? Number(data.value) : null)}
              disabled={isReadOnly}
            />
          </Field>
        );
      case FieldType.URL:
        return (
          <Field label={field.displayName}>
            <Input
              type="url"
              value={value ?? ""}
              onChange={(_, data) => handleChange(field.internalName, data.value)}
              disabled={isReadOnly}
            />
          </Field>
        );
      case FieldType.User:
        return (
          <PeoplePicker
            context={peoplePickerContext as any}
            titleText={field.displayName}
            personSelectionLimit={1}
            principalTypes={[PrincipalType.User]}
            resolveDelay={300}
            defaultSelectedUsers={value ? value.secondaryText : undefined}
            onChange={(nextValue) => handleChange(field.internalName, nextValue as IUserReference[] | null)}
            disabled={isReadOnly}
          />
        );
      case FieldType.UserMulti:
        console.log(value);
        return (
          <PeoplePicker
            context={peoplePickerContext as any}
            titleText={field.displayName}
            personSelectionLimit={10}
            ensureUser={true}
            principalTypes={[PrincipalType.User]}
            resolveDelay={300}
            defaultSelectedUsers={value ? value.map((person:any) => person.secondaryText) : ['']}
            onChange={(nextValue) => handleChange(field.internalName, nextValue as IUserReference[] | null)}
            disabled={isReadOnly}
          />
        );
      default:
        return (
          <Field label={field.displayName} validationMessage={error} validationState={error ? "error" : undefined}>
            <Input
              value={value ?? ""}
              onChange={(_, data) => handleChange(field.internalName, data.value)}
              disabled={isReadOnly}
            />
          </Field>
        );
    }
  };

  return (
    <Stack tokens={{childrenGap: 10}}>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.fullWidth}>
          <Body1Strong>Required fields </Body1Strong>
          <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
            Provide as much detail as possible to accelerate approvals.
          </Caption1>
        </div>
        {visibleFields.map((field) => (
          <div key={field.internalName} className={field.fieldType === FieldType.Note ? styles.fullWidth : undefined}>
            {renderField(field, !isWorkflowOwner && OWNER_ONLY_EDIT_FIELDS.has(field.internalName))}
          </div>
        ))}
        {isWorkflowOwner && ownerOnlyFields.length > 0 && (
          <div className={styles.fullWidth}>
            <Accordion collapsible>
              <AccordionItem value="workflow-owner-fields">
                <AccordionHeader>StoreOps Workflow Owners Fields</AccordionHeader>
                <AccordionPanel>
                  <div className={styles.formGrid}>
                    {ownerOnlyFields.map((field) => (
                      <div
                        key={field.internalName}
                        className={field.fieldType === FieldType.Note ? styles.fullWidth : undefined}
                      >
                        {renderField(field, false)}
                      </div>
                    ))}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        <div className={styles.fullWidth}>
          <Field label="Attachments">
            <input
              type="file"
              multiple
              className={styles.nativeFileInput}
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                setAttachments(target.files ? Array.from(target.files) : []);
              }}
            />
            {attachments.length > 0 && (
              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                {attachments.length} file(s): {attachments.map((file) => file.name).join(", ")}
              </Caption1>
            )}
          </Field>
        </div>
        <div className={styles.formActions}>
          <Button appearance="secondary" onClick={onCancel} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button appearance="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          {!isFalsy(initialValues?.Id) && isWorkflowOwner && <Button appearance="primary" color="purple" onClick={createApproval} >Send Approval</Button>}
        </div>
      </form>
      <CRApprovals displayType="Tab" IDPK={initialValues?.Id} ctx={context} />
    </Stack>
  );
};

export default CRFFormRenderer;
