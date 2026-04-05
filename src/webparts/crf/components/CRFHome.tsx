import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import HttpClientService from '../../../services/HttpClientService';
import { SPFI } from "@pnp/sp";
import {
  Badge,
  Button,
  Dropdown,
  FluentProvider,
  IdPrefixProvider,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Spinner,
  Text,
  Link,
  webLightTheme,
} from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, EditRegular } from "@fluentui/react-icons";
import { HashRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { CRFService } from "../../../services/CRFService";
import { ICRFFormItem } from "../../../models/ICRFFormItem";
import { CRFContentType } from "../../../models/CRFFieldModel";
import CRFFormRenderer from "./CRFFormRenderer";
import { NotifyProvider } from "./ToastMaker";
import { useNotify } from "./ToastMaker";
import styles from "./Crf.module.scss";
//https://cplace.sharepoint.com/sites/Workflows/StoreOps/SitePages/CRFTest.aspx?debug=true&noredir=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fmanifests.js
export const SupportDataContext = React.createContext<{ ctx: WebPartContext, httpServiceCtx: HttpClientService }>({
  ctx: {} as WebPartContext,
  httpServiceCtx: {} as HttpClientService,
})


export type CRFHomeProps = {
  sp: SPFI;
  context: WebPartContext;
  theme?: any;
  httpService: HttpClientService;
};

const COMM_STATUSES = ["Cancelled", "Placeholder", "Pending Draft", "Published"];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

type CRFContentTypeSlug = "general" | "marketing" | "transfer" | "qa";

const CONTENT_TYPE_TO_SLUG: Record<CRFContentType, CRFContentTypeSlug> = {
  [CRFContentType.General]: "general",
  [CRFContentType.Marketing]: "marketing",
  [CRFContentType.Transfer]: "transfer",
  [CRFContentType.QA]: "qa",
};

const SLUG_TO_CONTENT_TYPE: Record<CRFContentTypeSlug, CRFContentType> = {
  general: CRFContentType.General,
  marketing: CRFContentType.Marketing,
  transfer: CRFContentType.Transfer,
  qa: CRFContentType.QA,
};

const resolveContentType = (item?: ICRFFormItem | null): CRFContentType => {
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

const CRFHomeApp: React.FC<CRFHomeProps> = ({ sp, context, httpService }) => {
  const service = React.useMemo(() => new CRFService(sp), [sp]);
  const navigate = useNavigate();
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
  const ctx: WebPartContext = context;
  const httpServiceCtx: HttpClientService = httpService;
  const [items, setItems] = React.useState<ICRFFormItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);
  const [isWorkflowOwner, setIsWorkflowOwner] = React.useState(false);
  const [contentTypeMap, setContentTypeMap] = React.useState<Record<string, string>>({});
  const { notify } = useNotify();
  //const toasterId = useId("crf-toaster");
  //const { dispatchToast } = useToastController(toasterId);
  const supportData = { ctx, httpServiceCtx };

  /*   const notify = React.useCallback(
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
    ); */

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
    loadItems().catch(() => {
      // Errors are already captured in loadItems.
    });
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
    })().catch((err: any) => {
      if (!isMounted) return;
      setError(err?.message ?? "Unable to load content types");
    });
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
    })().catch(() => {
      if (!isMounted) return;
      setIsWorkflowOwner(false);
    });
    return () => {
      isMounted = false;
    };
  }, [service]);

  const createItem = React.useCallback(
    async (contentType: CRFContentType, values: Partial<ICRFFormItem>, attachments: File[]) => {
      const payload = { ...values } as Partial<ICRFFormItem>;
      const contentTypeId = contentTypeMap[contentType];
      if (contentTypeId) {
        payload.ContentTypeId = contentTypeId;
      }

      const created = await service.createItem(context.spHttpClient,payload as ICRFFormItem);
      if (created.Id && attachments.length) {
        await service.addAttachments(created.Id, attachments);
      }
      notify("CRF created", '', 'success', false, '/');
      await loadItems();
    },
    [contentTypeMap, loadItems, notify, service]
  );

  const updateItem = React.useCallback(
    async (itemId: number, values: Partial<ICRFFormItem>, attachments: File[]) => {
      await service.updateItem(context.spHttpClient, itemId, values);
      console.log(attachments);
      if (attachments.length) {
        await service.addAttachments(itemId, attachments);
      }
      notify("CRF updated", '', 'success', false, '/');
      await loadItems();
    },
    [loadItems, notify, service]
  );

  return (
    <IdPrefixProvider value="APP1-">
      <FluentProvider theme={webLightTheme} className={styles.crf}>
        <SupportDataContext.Provider value={supportData}>
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

          <Routes>
            <Route
              path="/"
              element={
                <CRFListScreen
                  items={items}
                  isLoading={isLoading}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  onRefresh={loadItems}
                  onEdit={(itemId) => navigate(`/edit/${itemId}`)}
                  onCreate={(contentType) => navigate(`/new/${CONTENT_TYPE_TO_SLUG[contentType]}`)}
                  statusColor={statusColor}
                />
              }
            />
            <Route
              path="/new/:contentTypeSlug"
              element={
                <CRFNewFormScreen
                  service={service}
                  isWorkflowOwner={isWorkflowOwner}
                  context={context}
                  onSubmit={createItem}
                  onCancel={() => navigate("/")}
                />
              }
            />
            <Route
              path="/edit/:itemId"
              element={
                <CRFEditFormScreen
                  service={service}
                  isWorkflowOwner={isWorkflowOwner}
                  context={context}
                  onSubmit={updateItem}
                  onCancel={() => navigate("/")}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SupportDataContext.Provider>
      </FluentProvider>
    </IdPrefixProvider>
  );
};

type CRFListScreenProps = {
  items: ICRFFormItem[];
  isLoading: boolean;
  statusFilter?: string;
  onStatusFilterChange: (status: string | undefined) => void;
  onRefresh: () => Promise<void>;
  onEdit: (itemId: number) => void;
  onCreate: (contentType: CRFContentType) => void;
  statusColor: (status?: string) => React.ComponentProps<typeof Badge>["color"];
};

const CRFListScreen: React.FC<CRFListScreenProps> = ({
  items,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onEdit,
  onCreate,
  statusColor,
}) => {
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageStartIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, totalItems);
  const pagedItems = React.useMemo(
    () => items.slice(pageStartIndex, pageEndIndex),
    [items, pageStartIndex, pageEndIndex]
  );

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.newButtons}>
          {Object.values(CRFContentType).map((contentType) => (
            <Button
              key={contentType}
              appearance="primary"
              icon={<AddRegular />}
              onClick={() => onCreate(contentType)}
            >
              New {contentType.replace("CRF ", "")}
            </Button>
          ))}
        </div>
        <div className={styles.filters}>
          <Dropdown
            aria-label="Comm status filter"
            inlinePopup
            placeholder="Comm Status"
            selectedOptions={statusFilter ? [statusFilter] : []}
            onOptionSelect={(_, data) => {
              const value = data.optionValue;
              onStatusFilterChange(value === "All" ? undefined : value);
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
          <Button appearance="secondary" icon={<ArrowClockwiseRegular />} onClick={() => onRefresh()}>
            Refresh
          </Button>
        </div>
      </div>

      <div className={styles.dataGridWrapper}>
        {isLoading ? (
          <div className={styles.emptyState}>
            <Spinner label="Loading requests" labelPosition="below" />
          </div>
        ) : !items.length ? (
          <div className={styles.emptyState}>
            <Text weight="semibold">No requests match the current filters.</Text>
          </div>
        ) : (
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
              {pagedItems.map((item) => (
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
                        onClick={() => item.Id && onEdit(item.Id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && totalItems > 0 && (
        <div className={styles.paginationBar}>
          <Text className={styles.paginationSummary}>
            Showing {pageStartIndex + 1}-{pageEndIndex} of {totalItems}
          </Text>
          <div className={styles.paginationControls}>
            <Dropdown
              aria-label="Rows per page"
              inlinePopup
              selectedOptions={[String(pageSize)]}
              onOptionSelect={(_, data) => {
                const value = Number(data.optionValue);
                if (!Number.isNaN(value)) {
                  setPageSize(value);
                  setCurrentPage(1);
                }
              }}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <Option key={size} value={String(size)} text={`${size} per page`}>
                  {size} per page
                </Option>
              ))}
            </Dropdown>
            <Button
              appearance="secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              Previous
            </Button>
            <Text className={styles.pageIndicator}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              appearance="secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

type CRFNewFormScreenProps = {
  service: CRFService;
  isWorkflowOwner: boolean;
  context: WebPartContext;
  onSubmit: (contentType: CRFContentType, values: Partial<ICRFFormItem>, attachments: File[]) => Promise<void>;
  onCancel: () => void;
};

const CRFNewFormScreen: React.FC<CRFNewFormScreenProps> = ({ service, isWorkflowOwner, context, onSubmit, onCancel }) => {
  const params = useParams<{ contentTypeSlug: string }>();
  const slug = params.contentTypeSlug as CRFContentTypeSlug | undefined;
  const contentType = slug && SLUG_TO_CONTENT_TYPE[slug];
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!contentType) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.dataGridWrapper}>
      <Text weight="semibold">New {contentType}</Text>
      <CRFFormRenderer
        contentType={contentType}
        service={service}
        isWorkflowOwner={isWorkflowOwner}
        initialValues={null}
        context={context}
        isSubmitting={isSubmitting}
        onSubmit={async (values, attachments) => {
          setIsSubmitting(true);
          try {
            await onSubmit(contentType, values, attachments);
            onCancel();
          } finally {
            setIsSubmitting(false);
          }
        }}
        onCancel={onCancel}
      />
    </div>
  );
};

type CRFEditFormScreenProps = {
  service: CRFService;
  isWorkflowOwner: boolean;
  context: WebPartContext;
  onSubmit: (itemId: number, values: Partial<ICRFFormItem>, attachments: File[]) => Promise<void>;
  onCancel: () => void;
};

const CRFEditFormScreen: React.FC<CRFEditFormScreenProps> = ({ service, isWorkflowOwner, context, onSubmit, onCancel }) => {
  const params = useParams<{ itemId: string }>();
  const itemId = Number(params.itemId);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [item, setItem] = React.useState<ICRFFormItem | null>(null);
  const [existingAttachments, setExistingAttachments] = React.useState<{ FileName: string; ServerRelativeUrl: string }[]>([]);

  React.useEffect(() => {
    if (!Number.isFinite(itemId)) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        const [fullItem, files] = await Promise.all([service.getItem(itemId), service.getAttachments(itemId)]);
        if (!isMounted) return;
        setItem(fullItem);
        setExistingAttachments(files);
      } catch {
        if (!isMounted) return;
        setItem(null);
        setExistingAttachments([]);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })().catch(() => {
      if (!isMounted) return;
      setItem(null);
      setExistingAttachments([]);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [itemId, service]);

  if (!Number.isFinite(itemId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.dataGridWrapper}>
      {isLoading ? (
        <div className={styles.emptyState}>
          <Spinner label="Loading form" labelPosition="below" />
        </div>
      ) : !item ? (
        <div className={styles.emptyState}>
          <Text weight="semibold">Unable to load the selected record.</Text>
          <Button onClick={onCancel}>Back</Button>
        </div>
      ) : (
        <>
          <Text weight="semibold">Edit {resolveContentType(item)}</Text>
          <div className={styles.existingAttachments}>
            <Text weight="semibold">Existing attachments</Text>
            {existingAttachments.length ? (
              <ul className={styles.attachmentsList}>
                {existingAttachments.map((file) => (
                  <li key={`${file.FileName}-${file.ServerRelativeUrl}`}>
                    <Link href={file.ServerRelativeUrl} target="_blank" rel="noopener noreferrer">
                      {file.FileName}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Text size={200}>No attachments on this item yet.</Text>
            )}
          </div>
          <CRFFormRenderer
            contentType={resolveContentType(item)}
            service={service}
            isWorkflowOwner={isWorkflowOwner}
            initialValues={item}
            isSubmitting={isSubmitting}
            context={context}
            onSubmit={async (values, attachments) => {
              setIsSubmitting(true);
              try {
                await onSubmit(itemId, values, attachments);
                onCancel();
              } finally {
                setIsSubmitting(false);
              }
            }}
            onCancel={onCancel}
          />
        </>
      )}
    </div>
  );
};

const CRFHome: React.FC<CRFHomeProps> = (props) => {
  return (
    <HashRouter>
      <NotifyProvider>
        <CRFHomeApp {...props} />
      </NotifyProvider>
    </HashRouter>
  );
};

export default CRFHome;
