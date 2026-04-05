import * as React from 'react';
import { FluentProvider, Link, Spinner, Toast, ToastBody, ToastIntent, ToastTitle, ToastTrigger, Toaster, useId, useToastController, webLightTheme } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";

interface NotifyContextType {
    notify: (title: string, subTitle: string, intent: ToastIntent, action?: boolean, navigateloc?: string, spinner?:boolean) => void;
}

const NotifyContext = React.createContext<NotifyContextType | undefined>(undefined);

export const NotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    /**
     * 
     * @param title message title.
     * @param subTitle message content.
     * @param intent "info" | "success" | "error" | "warning"
     * @param action does the user need to take action on the message ture or false ? 
     * @param navigateloc location to navigate after message closed.
     */
    const notify = (title: string, subTitle: string, intent: ToastIntent, action: boolean = false, navigateloc?: string, spinner?:boolean): void => {
        const toastContent = (
            <Toast appearance="inverted">
                <ToastTitle action={action ? <ToastTrigger><Link>Acknowledged</Link></ToastTrigger> : undefined} media={spinner ? <Spinner size="tiny" /> : undefined}>
                    {title}
                </ToastTitle>
                <ToastBody>{subTitle}</ToastBody>
            </Toast>
        );

        dispatchToast(toastContent, {
            intent: intent,
            onStatusChange: (e, { status: toastStatus }) => {
                if (toastStatus === "unmounted" && navigateloc) {
                    navigate(navigateloc);
                }
            }
        });
    };

    return (
        <NotifyContext.Provider value={{ notify }}>
            {children}
            <FluentProvider theme={webLightTheme} style={{ background: 'transparent' }}><Toaster toasterId={toasterId} /></FluentProvider>
        </NotifyContext.Provider>
    );
};

export const useNotify = (): NotifyContextType => {
    const context = React.useContext(NotifyContext);
    if (!context) {
        throw new Error("useNotify must be used within a NotifyProvider");
    }
    return context;
};