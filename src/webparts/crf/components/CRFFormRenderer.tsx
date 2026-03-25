import * as React from "react";
import {
  Body1Strong,
  Button,
  Caption1,
  Dropdown,
  Field,
  Input,
  Option,
  Spinner,
  Switch,
  Tag,
  TagGroup,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { CRF_FIELD_MAPPING } from "../../../config/CRFFieldMapping";
import { CRFContentType, ICRFFieldConfig } from "../../../models/CRFFieldModel";
import { FieldType } from "../../../models/FieldType";
import { ICRFFormItem, IUserReference } from "../../../models/ICRFFormItem";
import { CRFService } from "../../../services/CRFService";
import styles from "./Crf.module.scss";

export interface ICRFFormRendererProps {
  contentType: CRFContentType;
  service: CRFService;
  initialValues?: Partial<ICRFFormItem> | null;
  isSubmitting?: boolean;
  onSubmit: (values: Partial<ICRFFormItem>, attachments: File[]) => Promise<void>;
  onCancel: () => void;
}

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
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const fieldConfigs = React.useMemo(() => CRF_FIELD_MAPPING[contentType] ?? [], [contentType]);
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

  const validate = React.useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!formValues.Title || !formValues.Title.trim()) {
      nextErrors.Title = "Project/Event Name is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formValues.Title]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload: Record<string, any> = {};
    fieldConfigs.forEach((field) => {
      payload[field.internalName] = formValues[field.internalName];
    });

    payload.Title = formValues.Title;
    await onSubmit(payload, attachments);
  };

  const renderField = (field: ICRFFieldConfig) => {
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
            />
          </Field>
        );
      case FieldType.MultiChoice:
        return (
          <Field label={field.displayName}>
            <Dropdown
              multiselect
              selectedOptions={Array.isArray(value) ? value : []}
              onOptionSelect={(_, data) => {
                handleChange(field.internalName, data.selectedOptions);
              }}
              className={styles.fullWidth}
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
              selectedOptions={value ? [value] : []}
              onOptionSelect={(_, data) => handleChange(field.internalName, data.optionValue)}
              className={styles.fullWidth}
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
            />
          </Field>
        );
      case FieldType.Boolean:
        return (
          <Field label={field.displayName}>
            <Switch
              checked={Boolean(value)}
              onChange={(_, data) => handleChange(field.internalName, data.checked)}
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
            />
          </Field>
        );
      case FieldType.User:
        return (
          <PeoplePickerField
            label={field.displayName}
            value={value as IUserReference | null}
            onChange={(nextValue) => handleChange(field.internalName, nextValue as IUserReference | null)}
            service={service}
          />
        );
      case FieldType.UserMulti:
        return (
          <PeoplePickerField
            label={field.displayName}
            value={value as IUserReference[] | null}
            onChange={(nextValue) => handleChange(field.internalName, nextValue as IUserReference[] | null)}
            service={service}
            multi
          />
        );
      default:
        return (
          <Field label={field.displayName} validationMessage={error} validationState={error ? "error" : undefined}>
            <Input
              value={value ?? ""}
              onChange={(_, data) => handleChange(field.internalName, data.value)}
            />
          </Field>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      <div className={styles.fullWidth}>
        <Body1Strong>Required fields</Body1Strong>
        <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
          Provide as much detail as possible to accelerate approvals.
        </Caption1>
      </div>
      {fieldConfigs.map((field) => (
        <div key={field.internalName} className={field.fieldType === FieldType.Note ? styles.fullWidth : undefined}>
          {renderField(field)}
        </div>
      ))}
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
      </div>
    </form>
  );
};

interface PeoplePickerFieldProps {
  label: string;
  value?: IUserReference | IUserReference[] | null;
  multi?: boolean;
  onChange: (value: IUserReference | IUserReference[] | null) => void;
  service: CRFService;
}

const PeoplePickerField: React.FC<PeoplePickerFieldProps> = ({ label, value, multi, onChange, service }) => {
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<IUserReference[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debounceRef = React.useRef<number>();

  const selected = React.useMemo(() => {
    if (multi) {
      return Array.isArray(value) ? value : [];
    }
    return value ? [value as IUserReference] : [];
  }, [value, multi]);

  React.useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const results = await service.searchUsers(query);
        setSuggestions(results);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [query, service]);

  const addPerson = async (person: IUserReference) => {
    let resolved = person;
    if (!resolved.id && resolved.loginName) {
      resolved = await service.ensureUser(resolved.loginName);
    }

    if (multi) {
      const alreadySelected = selected.some((entry) => entry.id === resolved.id);
      if (!alreadySelected) {
        onChange([...selected, resolved]);
      }
    } else {
      onChange(resolved);
    }

    setQuery("");
    setSuggestions([]);
  };

  const tagValueForPerson = (person: IUserReference): string => {
    if (typeof person.id === "number") {
      return `id:${person.id}`;
    }
    if (person.loginName) {
      return `login:${person.loginName}`;
    }
    return `label:${person.email ?? person.title ?? ""}`;
  };

  const removePersonByTagValue = (tagValue: string) => {
    if (!tagValue) {
      onChange(multi ? [] : null);
      return;
    }

    const [kind, valuePart] = tagValue.split(":", 2);
    if (multi) {
      const next = selected.filter((entry) => {
        if (kind === "id") {
          return `${entry.id ?? ""}` !== valuePart;
        }
        if (kind === "login") {
          return (entry.loginName ?? "") !== valuePart;
        }
        const label = entry.email ?? entry.title ?? "";
        return label !== valuePart;
      });
      onChange(next);
    } else {
      onChange(null);
    }
  };

  return (
    <Field label={label} className={styles.peoplePickerField}>
      <div className={styles.peoplePickerShell}>
        {selected.length > 0 && (
          <TagGroup dismissible onDismiss={(_, data) => removePersonByTagValue(String(data.value))}>
            {selected.map((person) => (
              <Tag
                key={tagValueForPerson(person)}
                value={tagValueForPerson(person)}
                shape="rounded"
                dismissible
              >
                {person.title ?? person.email ?? person.loginName}
              </Tag>
            ))}
          </TagGroup>
        )}
        <Input
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          placeholder={selected.length ? "Add another name" : "Search by name or email"}
        />
        {(suggestions.length > 0 || isSearching) && (
          <div className={styles.peoplePickerSuggestions}>
            {isSearching && (
              <div className={styles.peoplePickerSuggestionRow}>
                <Spinner size="tiny" label="Searching" labelPosition="after" />
              </div>
            )}
            {suggestions.map((option) => (
              <button
                key={option.loginName ?? option.id}
                type="button"
                className={styles.peoplePickerSuggestionRow}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addPerson(option)}
              >
                <div className={styles.peoplePickerSuggestionPrimary}>{option.title ?? option.loginName}</div>
                <div className={styles.peoplePickerSuggestionSecondary}>{option.email}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
};

export default CRFFormRenderer;
