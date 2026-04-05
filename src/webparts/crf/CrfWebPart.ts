import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import CRFHome from "./components/CRFHome";
import HttpClientService from '../../services/HttpClientService';

export interface ICRFWebPartProps {}

export default class CRFWebPart extends BaseClientSideWebPart<ICRFWebPartProps> {
  private _sp: SPFI;
  private _themeVariant?: IReadonlyTheme;
  private httpService: HttpClientService;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this.httpService = await HttpClientService.create(this.context);
    this._sp = spfi().using(SPFx(this.context));
  }

  public render(): void {
    const element = React.createElement(CRFHome, {
      sp: this._sp,
      context: this.context,
      theme: this._themeVariant,
      httpService: this.httpService
    });

    ReactDom.render(element, this.domElement);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    this._themeVariant = currentTheme;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [] };
  }
}
