import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  FluentProvider,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Spinner,
  Text,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  useId,
  useToastController,
  webLightTheme,
} from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, EditRegular } from "@fluentui/react-icons";
import { CRFService } from "../../../services/CRFService";
import { ICRFFormItem } from "../../../models/ICRFFormItem";
import { CRFContentType } from "../../../models/CRFFieldModel";
import CRFFormRenderer from "./CRFFormRenderer";
import styles from "./Crf.module.scss";

export type CRFHomeProps = {
  sp: SPFI;
  context: WebPartContext;
  theme?: any;
};

type FormState =
  | null
  | { mode: "new"; contentType: CRFContentType }
  | { mode: "edit"; contentType: CRFContentType; itemId: number };

const COMM_STATUSES = ["Cancelled", "Placeholder", "Pending Draft", "Published"];

const CRFHome: React.FC<CRFHomeProps> = ({ sp }) => {
  const service = React.useMemo(() => new CRFService(sp), [sp]);
  const statusColor = React.useCallback(
    (status?: string): React.ComponentProps<typeof Badge>["color"] => {
      switch (status) {
        case "Published":
          return "success";
        case "Pending Draft":
          return "important";
        case "Placeholder":
          return "informative";
        case "Cancelled":
          return "danger";
        default:
          return "brand";
      }
    },
    []
  );
  const [items, setItems] = React.useState<ICRFFormItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);
  const [formState, setFormState] = React.useState<FormState>(null);
  const [activeItem, setActiveItem] = React.useState<ICRFFormItem | null>(null);
  const [isFormLoading, setIsFormLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isWorkflowOwner, setIsWorkflowOwner] = React.useState(false);
  const [contentTypeMap, setContentTypeMap] = React.useState<Record<string, string>>({});

  const toasterId = useId("crf-toaster");
  const { dispatchToast } = useToastController(toasterId);

  const notify = React.useCallback(
    (title: string, body?: string, intent: "success" | "error" = "success") => {
      dispatchToast(
        <Toast>
          <ToastTitle>{title}</ToastTitle>
          {body && <ToastBody>{body}</ToastBody>}
        </Toast>,
        { intent }
      );
    },
    [dispatchToast]
  );

  const resolveContentType = React.useCallback((item?: ICRFFormItem | null): CRFContentType => {
    const label = item?.ContentType ?? "";
    switch (label) {
      case CRFContentType.Marketing:
        return CRFContentType.Marketing;
      case CRFContentType.Transfer:
        return CRFContentType.Transfer;
      case CRFContentType.QA:
        return CRFContentType.QA;
      default:
        return CRFContentType.General;
    }
  }, []);

  const loadItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getItems({ status: statusFilter });
      setItems(data);
    } catch (err: any) {
      setError(err.message ?? "Unable to load CRF items.");
    } finally {
      setIsLoading(false);
    }
  }, [service, statusFilter]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const types = await service.getContentTypes();
        if (!isMounted) return;
        const map: Record<string, string> = {};
        types.forEach((type) => {
          map[type.name] = type.id;
        });
        setContentTypeMap(map);
      } catch (err: any) {
        setError(err.message ?? "Unable to load content types");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [service]);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const isMember = await service.isCurrentUserInGroup(19);
        if (!isMounted) return;
        setIsWorkflowOwner(isMember);
      } catch {
        if (!isMounted) return;
        setIsWorkflowOwner(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [service]);

  const openNewForm = (contentType: CRFContentType) => {
    setActiveItem(null);
    setFormState({ mode: "new", contentType });
  };

  const openEditForm = async (item: ICRFFormItem) => {
    if (!item.Id) {
      return;
    }
    const ct = resolveContentType(item);
    setFormState({ mode: "edit", contentType: ct, itemId: item.Id });
    setIsFormLoading(true);
    try {
      const fullItem = await service.getItem(item.Id);
      setActiveItem(fullItem);
    } catch (err: any) {
      setError(err.message ?? "Unable to load the record for editing.");
      setFormState(null);
    } finally {
      setIsFormLoading(false);
    }
  };

  const closeForm = () => {
    setFormState(null);
    setActiveItem(null);
    setIsFormLoading(false);
  };

  const handleFormSubmit = async (values: Partial<ICRFFormItem>, attachments: File[]) => {
    if (!formState) {
      return;
    }
    setIsSaving(true);
    try {
      if (formState.mode === "new") {
        const payload = { ...values } as Partial<ICRFFormItem>;
        const contentTypeId = contentTypeMap[formState.contentType];
        if (contentTypeId) {
          payload.ContentTypeId = contentTypeId;
        }
        const created = await service.createItem(payload as ICRFFormItem);
        if (created.Id && attachments.length) {
          await service.addAttachments(created.Id, attachments);
        }
        notify("CRF created");
      } else {
        await service.updateItem(formState.itemId, values);
        if (attachments.length) {
          await service.addAttachments(formState.itemId, attachments);
        }
        notify("CRF updated");
      }
      closeForm();
      await loadItems();
    } catch (err: any) {
      const message = err.message ?? "Unable to save changes.";
      setError(message);
      notify("Save failed", message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const formatActualPublishDate = (value?: string | null): string => {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString();
  };

  const renderGrid = () => {
    if (isLoading) {
      return (
        <div className={styles.emptyState}>
          <Spinner label="Loading requests" labelPosition="below" />
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className={styles.emptyState}>
          <Text weight="semibold">No requests match the current filters.</Text>
        </div>
      );
    }

    return (
      <table className={styles.simpleTable}>
        <thead>
          <tr>
            <th>Project/Event</th>
            <th>Comm Status</th>
            <th>Department</th>
            <th>Actual publish date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.Id}>
              <td>{item.Title}</td>
              <td>
                {item.Comm_x0020_Status ? (
                  <Badge appearance="filled" color={statusColor(item.Comm_x0020_Status)}>
                    {item.Comm_x0020_Status}
                  </Badge>
                ) : (
                  "-"
                )}
              </td>
              <td>{item.Department ?? "-"}</td>
              <td>{formatActualPublishDate(item.Actual_x0020_Publication_x0020_D)}</td>
              <td>
                <div className={styles.actionsCell}>
                  <Button
                    icon={<EditRegular />}
                    appearance="subtle"
                    onClick={() => openEditForm(item)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <FluentProvider theme={webLightTheme} className={styles.crf}>
      <Toaster toasterId={toasterId} />
      <div className={styles.toolbar}>
        <div className={styles.newButtons}>
          {Object.values(CRFContentType).map((contentType) => (
            <Button
              key={contentType}
              appearance="primary"
              icon={<AddRegular />}
              onClick={() => openNewForm(contentType)}
            >
              New {contentType.replace("CRF ", "")}
            </Button>
          ))}
        </div>
        <div className={styles.filters}>
          <Dropdown
            aria-label="Comm status filter"
            placeholder="Comm Status"
            selectedOptions={statusFilter ? [statusFilter] : []}
            onOptionSelect={(_, data) => {
              const value = data.optionValue;
              setStatusFilter(value === "All" ? undefined : value);
            }}
          >
            <Option key="all" value="All">
              All statuses
            </Option>
            {COMM_STATUSES.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Dropdown>
          <Button
            appearance="secondary"
            icon={<ArrowClockwiseRegular />}
            onClick={loadItems}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>{error}</MessageBarTitle>
          </MessageBarBody>
          <Button appearance="transparent" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </MessageBar>
      )}

      <div className={styles.dataGridWrapper}>{renderGrid()}</div>

      <Dialog
        open={Boolean(formState)}
        onOpenChange={(_, data) => {
          if (!data.open) {
            closeForm();
          }
        }}
      >
        <DialogSurface className={styles.dialogSurface}>
          <DialogBody>
            <DialogTitle>
              {formState?.mode === "edit" ? "Edit" : "New"} {formState?.contentType ?? "CRF"}
            </DialogTitle>
            <DialogContent>
              {isFormLoading ? (
                <div className={styles.emptyState}>
                  <Spinner label="Loading form" labelPosition="below" />
                </div>
              ) : (
                formState && (
                  <CRFFormRenderer
                    contentType={formState.contentType}
                    service={service}
                    isWorkflowOwner={isWorkflowOwner}
                    initialValues={formState.mode === "edit" ? activeItem : null}
                    isSubmitting={isSaving}
                    onSubmit={handleFormSubmit}
                    onCancel={closeForm}
                  />
                )
              )}
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>

    </FluentProvider>
  );
};

export default CRFHome;
