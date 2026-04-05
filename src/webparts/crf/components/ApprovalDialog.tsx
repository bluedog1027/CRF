import * as React from 'react';
import { IApprovalDetail } from '../../../models/IPowerPlatformProps';
import { DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogActions, Dialog, Button, DialogContent, Field, Textarea, TextareaOnChangeData, Link } from '@fluentui/react-components';
import { Stack } from '@fluentui/react';
import { SupportDataContext } from './CRFHome';
type funcOnResponse = (approvalID: string, userResponse: string, comment: string) => void;


/* function extractMarkdownLink(text:string):JSX.Element {
    // If no "[" is present, bail out early
    if (!text.includes("[")) {
        return <>{text}</>;
    }

    // Regex to capture [label
    const match = text.match(/\[(.*?)\]\((.*?)\)/);

    if (!match) {
        return <>{text}</>; // malformed markdown-like text
    }

    const label = match[1];
    //const url = match[2];

    return <Link href={`https://cplace.sharepoint.com/sites/AppControl/UAPAttachments/${encodeURIComponent(label)}?web=1`} target="_blank" data-interception="off" rel="noreferrer">{label}</Link>;
}
 */

export default function ApprovalDialog(props: React.PropsWithChildren<{ ApprovalID: string; Text: string; env: string; onResponse: funcOnResponse; userResponseOptions: string[]; }>): JSX.Element {

    const { ApprovalID, Text, userResponseOptions } = props;
    const { httpServiceCtx } = React.useContext(SupportDataContext);
    const [comment, setComment] = React.useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
    const [approvalItem, setApprovalItem] = React.useState<IApprovalDetail>();

    const onChange = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData): void => {
        setComment(data.value);
    }

    const onSubmit = (userResponse: string): void => {
        props.onResponse(ApprovalID, userResponse, comment);
        console.log(comment);
        setIsDialogOpen(false);
    }

    const onOpen = (): void => {
        httpServiceCtx.getApproval(props.env, ApprovalID)
            .then(data => {
                setIsDialogOpen(true);
                setApprovalItem(data);
            })
            .catch(error => console.log(error));
    }

 /*    const details = (detailsText: string): JSX.Element[] => {
        const detailsArray = detailsText.split(/\r?\n/);
        return detailsArray.map((line, index) => <p key={index}>{extractMarkdownLink(line)}</p>);
    } */

    return (
        <Dialog open={isDialogOpen}>
            <DialogTrigger disableButtonEnhancement>
                <Link onClick={onOpen}>{Text}</Link>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{Text}</DialogTitle>
                    <DialogContent>
                        <Stack tokens={{ childrenGap: 5 }}>
                            {
                                approvalItem?.properties.details && approvalItem?.properties.details
                            }
                            <Field label="">
                                <Textarea placeholder='Optional comments' onChange={onChange} />
                            </Field>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" style={{ backgroundColor: 'green' }} onClick={() => onSubmit(userResponseOptions[0])} >{userResponseOptions[0]}</Button>
                        <Button appearance="primary" style={{ backgroundColor: 'red' }} onClick={() => onSubmit(userResponseOptions[1])} >{userResponseOptions[1]}</Button>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary" onClick={() => setIsDialogOpen(false)} >Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );

}