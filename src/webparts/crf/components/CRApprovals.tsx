import * as React from 'react';
import styles from './Crf.module.scss';
import { Tooltip, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, TableColumnDefinition, TableCellLayout, Button, Persona, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, partitionAvatarGroupItems, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from '@fluentui/react-components';
import { PresenceAvailableRegular, PresenceDndRegular, ArrowSyncCircleRegular, OpenRegular, InfoFilled } from '@fluentui/react-icons';
import ApprovalDialog from './ApprovalDialog';
import { _getSPList, isFalsy } from '../../../services/Util';
import { Stack} from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPApprovalIDS, personObj, IAllApprovalResponse } from '../../../models/ApprovalModel';
import { SupportDataContext } from './CRFHome';
export const ApprovalStatuses: { [key: string]: JSX.Element } = {
    Approve: <Stack horizontal tokens={{ childrenGap: 3 }}><PresenceAvailableRegular color='green' /><span>Approved</span></Stack>,
    'Not Approve': <Stack horizontal tokens={{ childrenGap: 3 }}><PresenceDndRegular color='red' /><span>Not Approved</span></Stack>,
    Reject: <Stack horizontal tokens={{ childrenGap: 3 }}><PresenceDndRegular color='red' /><span>Rejected</span></Stack>,
    Pending: <Stack horizontal tokens={{ childrenGap: 3 }}><ArrowSyncCircleRegular color='#c58207' /><span>Pending</span></Stack>
}
export const columnSizingOptions = {
    Title: {
        minWidth: 100,
        defaultWidth: 200
    },
    State: {
        minWidth: 80,
        defaultWidth: 100
    },
    AssignTo: {
        minWidth: 80,
        defaultWidth: 300
    },
    RequestDate: {
        minWidth: 100,
        defaultWidth: 150
    },
    Owner: {
        minWidth: 80,
        defaultWidth: 100
    },
    Comment: {
        minWidth: 80,
        defaultWidth: 100
    },
}

export type funcOnResponse = (approvalID: string, userResponse: string, comment: string) => void;
export type funcOnCabResponse = (body: Partial<ISPApprovalIDS>) => void;
export type funcOnChange = (key: string, value: string | Date | undefined) => void;
interface IResponseDetailsProps {
    isOpenResponses: boolean;
    responses?: IAllApprovalResponse[];
}

export function ApproverAvatars(props: React.PropsWithChildren<{ approvers: personObj[] }>): JSX.Element {
    const { inlineItems, overflowItems } = partitionAvatarGroupItems({
        items: props.approvers,
    });

    const avatars = (): JSX.Element => {
        return <AvatarGroup layout="stack">
            {inlineItems.map(approver => (
                <Tooltip key={approver.EMail} content={`${approver.Title}`} relationship="label" positioning={'above'}>
                    <AvatarGroupItem color='colorful' name={approver.Title} key={approver.EMail} />
                </Tooltip>
            ))}
            {overflowItems && (
                <AvatarGroupPopover>
                    {overflowItems.map((approver) => (
                        <AvatarGroupItem color='colorful' name={approver.Title} key={approver.EMail} />
                    ))}
                </AvatarGroupPopover>
            )}
        </AvatarGroup>
    }

    if (props.approvers.length === 1) {
        return <Persona
            avatar={{ color: "colorful", "aria-hidden": true }}
            name={props.approvers[0].Title || ''}
            textAlignment="center"
        />;
    }
    else {
        return avatars();
    }

}

export function ResponseDetails(props: React.PropsWithChildren<{ responsesProps: IResponseDetailsProps, setResponsesProps: React.Dispatch<React.SetStateAction<IResponseDetailsProps>> }>): JSX.Element {

    return <Dialog open={props.responsesProps.isOpenResponses}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Individual Statuses</DialogTitle>
                <DialogContent>
                    <Stack tokens={{ childrenGap: 3 }}>
                        <p>
                            The chosen workflow requires approval from all assigned users before it can proceed. <br />
                            Each participant must review and confirm their approval to ensure full consensus and compliance.
                        </p>
                        {props.responsesProps.responses && props.responsesProps.responses.map(response =>
                            <Stack key={response.responder.email} horizontal tokens={{ childrenGap: 10 }}>
                                <Persona
                                    key={response.responder.id}
                                    avatar={{ color: "colorful", "aria-hidden": true }}
                                    name={response.responder.displayName}
                                />
                                {ApprovalStatuses[response.approverResponse]}
                                {response.comments}
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setResponsesProps({ responses: props.responsesProps.responses, isOpenResponses: false })}>Close</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>

}

export default function CRApprovals(props: React.PropsWithChildren<{ displayType: 'Screen' | 'Tab', IDPK?: number, onChange?: funcOnChange, ctx: WebPartContext }>): JSX.Element {

    const { httpServiceCtx } = React.useContext(SupportDataContext);
    const [approvaResponse, setApprovalResponse] = React.useState<Partial<ISPApprovalIDS>[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [responsesProps, setResponsesProps] = React.useState<IResponseDetailsProps>({ isOpenResponses: false });

    const onResponse = async (approvalID: string, userResponse: string, comment: string): Promise<void> => {
        const approvalPost = await httpServiceCtx._postApproval('3395fa50-b035-ed14-a3dd-acb3ee41da06', approvalID, userResponse, comment);
        if (approvalPost.properties.status === 'Committed') {
            const tempArray = approvaResponse.map(approvalItem => {
                if (approvalItem.ApprovalID === approvalID)
                    return { ...approvalItem, ApproverComment: comment, ApprovalState: userResponse }
                return approvalItem;

            });
            setApprovalResponse(tempArray);
        }
    }

    const columnDefTitle: TableColumnDefinition<ISPApprovalIDS> = createTableColumn<ISPApprovalIDS>({
        columnId: "Title",
        renderHeaderCell: () => {
            return "Approval Request";
        },
        renderCell: (item) => {
            const isAssignedUser: boolean = item.AssignTo ? item.AssignTo.some(assignee => assignee.EMail === props.ctx.pageContext.user.email) : false;
            return (<> {isAssignedUser && item.ApprovalState === 'Pending' ? <TableCellLayout
                truncate
                media={<OpenRegular
                    className="iconopen" />}>
                    <ApprovalDialog ApprovalID={item.ApprovalID} Text={item.Title} env='3395fa50-b035-ed14-a3dd-acb3ee41da06' onResponse={onResponse} userResponseOptions={['Approve', 'Reject']} />
            </TableCellLayout> : <span>{item.Title}</span>}</>)
        },
    });

    const columnDefState: TableColumnDefinition<ISPApprovalIDS> = createTableColumn<ISPApprovalIDS>({
        columnId: "State",
        renderHeaderCell: () => {
            return "State";
        },
        renderCell: (item) => {
            return (item.ApprovalState)
        },
    });

    const columnDefAssignedTo: TableColumnDefinition<ISPApprovalIDS> = createTableColumn<ISPApprovalIDS>({
        columnId: "AssignTo",
        renderHeaderCell: () => {
            return "Assign To";
        },
        renderCell: (item) => {
            return (
                <Stack horizontal tokens={{ childrenGap: 5 }}>
                    <ApproverAvatars approvers={item.AssignTo ?? []} />
                </Stack>
            )
        },
    });

    const columnsDefRequestDate: TableColumnDefinition<ISPApprovalIDS> = createTableColumn<ISPApprovalIDS>({
        columnId: "RequestDate",
        renderHeaderCell: () => {
            return "Request Date";
        },
        renderCell: (item) => {
            return (item.RequestDateEST)
        },
    });

    const columnDefResult: TableColumnDefinition<ISPApprovalIDS> = createTableColumn<ISPApprovalIDS>({
        columnId: "Result",
        renderHeaderCell: () => {
            return "Result";
        },
        renderCell: (item) => {
            if (isFalsy(item.AllApproveResponse)) {
                return (ApprovalStatuses[item.ApprovalState])
            }
            else {
                return <Stack horizontal>
                    {ApprovalStatuses[item.ApprovalState]}
                    <Button appearance='transparent' icon={<InfoFilled color='#2cafe2' />} onClick={() => setResponsesProps({ isOpenResponses: true, responses: JSON.parse(item.AllApproveResponse) })} />
                </Stack>
            }
        },
    });

    const columnDefComment: TableColumnDefinition<ISPApprovalIDS> = createTableColumn<ISPApprovalIDS>({
        columnId: "Comment",
        renderHeaderCell: () => {
            return "Comment";
        },
        renderCell: (item) => {
            return (item.ApproverComment)
        },
    });

    const columnsDefScreen: TableColumnDefinition<ISPApprovalIDS>[] = [
        columnDefTitle,
        columnDefState,
        columnDefAssignedTo,
        columnsDefRequestDate
    ];

    const columnsDefTab: TableColumnDefinition<ISPApprovalIDS>[] = [
        columnDefTitle,
        columnDefAssignedTo,
        columnDefResult,
        columnDefComment
    ];

    React.useEffect(() => {
        if (!httpServiceCtx) return;
        if (props.displayType === 'Screen') {
            _getSPList<ISPApprovalIDS[]>(props.ctx.spHttpClient, `${props.ctx.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('CRFApprovals')/items?$select=Title,ApprovalState,ApprovedBy,ApprovalID,ApproverComment,ChangeType,RequestDateEST,RequestFrom,AllApproveResponse,AssignTo/Title,AssignTo/EMail&$expand=AssignTo&$filter=AssignTo/Id eq ${props.ctx.pageContext.legacyPageContext.userId} and ApprovalState eq 'Pending'`)
                .then(approvalData => {
                    setApprovalResponse(approvalData);
                    setIsLoading(false);
                })
                .catch(error => console.log(error));
        }
        else if (props.displayType === 'Tab') {
            _getSPList<ISPApprovalIDS[]>(props.ctx.spHttpClient, `${props.ctx.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('CRFApprovals')/items?$select=Id,Title,ApprovalState,ApprovedBy,ApprovalID,ApproverComment,ChangeType,ReAssignmentState,RequestFrom,AllApproveResponse,AssignTo/Title,AssignTo/EMail&$expand=AssignTo&$filter=RequestFromID eq '${props.IDPK}'`)
                .then(approvalData => {
                    setApprovalResponse(approvalData);
                    setIsLoading(false);
                })
                .catch(error => console.log(error));
        }

    }, [httpServiceCtx])

    if (approvaResponse !== undefined && approvaResponse.length > 0) {
        return <div className={styles.listItems} style={props.displayType === 'Tab' ? { width: '100%' } : {}}>
            <Stack>
                <div className={styles.DataGridArea}>
                    <DataGrid
                        items={approvaResponse}
                        columns={props.displayType === 'Screen' ? columnsDefScreen : columnsDefTab}
                        resizableColumns
                        columnSizingOptions={columnSizingOptions}
                        resizableColumnsOptions={{
                            autoFitColumns: true,
                        }}
                        className={styles.gridHeader}
                    >
                        <DataGridHeader style={{ backgroundColor: '#d5d7dd', textAlign: 'left', boxShadow: '0 0 2px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .14)' }}>
                            <DataGridRow>
                                {({ renderHeaderCell }) => (
                                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                                )}
                            </DataGridRow>
                        </DataGridHeader>
                        <DataGridBody<any>
                            className={styles.gridbody}
                        >
                            {({ item, rowId }) => (
                                <DataGridRow<any>
                                    key={rowId}
                                >
                                    {({ renderCell }) => (
                                        <DataGridCell>{renderCell(item)}</DataGridCell>
                                    )}
                                </DataGridRow>
                            )}
                        </DataGridBody>
                    </DataGrid>
                </div>
            </Stack>
            <ResponseDetails responsesProps={responsesProps} setResponsesProps={setResponsesProps} />
        </div>;
    }
    else if (isLoading) return <></>;
    else {
        return <Stack>
            {props.displayType === 'Screen' && <div className={styles.pendingempty}> All approvals are up to date. <br /><br /> There are currently no items awaiting your review.</div>}
            {props.displayType === 'Tab' && <></>}
        </Stack>;
    }

}