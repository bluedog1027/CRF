import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AadHttpClient, SPHttpClient } from '@microsoft/sp-http';
import { IApprovalDetail, IApprovalResponse, IApprovalView } from '../models/IPowerPlatformProps';

interface IEnvironment {
  name: string;
  location: string;
  id: string;
  type: string;
  properties: any;
}

export default class HttpClientService {

  private static readonly flowEndpoint: string = 'https://service.flow.microsoft.com';

  public static async create(context: WebPartContext): Promise<HttpClientService> {
    return new HttpClientService(
      await context.aadHttpClientFactory.getClient(HttpClientService.flowEndpoint),
      context.spHttpClient,
      context.pageContext.web.absoluteUrl);
  }

  private flowHttpClient: AadHttpClient;
  private spHttpClient: SPHttpClient;
  private spBaseUrl: string;

  private constructor(flowHttpClient: AadHttpClient, spHttpClient: SPHttpClient, spBaseUrl: string) {
    this.flowHttpClient = flowHttpClient;
    this.spHttpClient = spHttpClient;
    this.spBaseUrl = spBaseUrl;
  }

  public async getEnvironments(): Promise<IEnvironment[]> {
    const response = await this.flowHttpClient.get(
      'https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments' +
      '?api-version=2016-11-01',
      AadHttpClient.configurations.v1);
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json.value as IEnvironment[];
  }

  public async getApprovals(environments: string[]): Promise<IApprovalView[]> {
    const values = [];
    for (const environment of environments) {
      const response = await this.flowHttpClient.get(
        `https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/${environment}/approvalViews` +
        '?$filter=properties/userRole eq \'Approver\' and properties/isActive eq \'true\' and properties/isDescending eq \'true\'' +
        '&api-version=2016-11-01',
        AadHttpClient.configurations.v1);
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      for (const value of json.value) {
        values.push({
          ...value,
          environment: environment
        });
      }
    }
    return values;
  }

  public async getApproval(environment: string, approvalID: string): Promise<IApprovalDetail> {
    const url = `https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/${environment}/approvals/${approvalID}?api-version=2016-11-01`;
    const response = await this.flowHttpClient.get(url, AadHttpClient.configurations.v1);
    const result = await response.json();
    console.log(result);
    return result;
  }

  public async getApprovalResponse(environment: string, approvalID: string): Promise<IApprovalDetail> {
    const url = `https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/${environment}/approvals/${approvalID}/approvalResponses?api-version=2016-11-01`;
    const response = await this.flowHttpClient.get(url, AadHttpClient.configurations.v1);
    const result = await response.json();
    console.log(result);
    return result;
  }

  public async _postApproval(environment: string, approvalID: string, userResponse: string, comment: string): Promise<IApprovalResponse> {
    const url = `https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/${environment}/approvals/${approvalID}/approvalResponses?api-version=2016-11-01`;
    const body = { properties: { response: userResponse, comments: comment } };
    const headers = { "Content-Type": "application/json" };

    const response = await this.flowHttpClient.post(url, AadHttpClient.configurations.v1, { headers: headers, body: JSON.stringify(body) })
    return await response.json();
  }

  public async _postReassign(environment: string, approvalID: string, assignedToEmail: string): Promise<IApprovalResponse> {
    const url = `https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/${environment}/approvals/${approvalID}/reassign?api-version=2016-11-01`;
    const body = { assignedTo: assignedToEmail };
    const headers = { "Content-Type": "application/json" };

    const response = await this.flowHttpClient.post(url, AadHttpClient.configurations.v1, { headers: headers, body: JSON.stringify(body) })
    return await response.json();
  }

  public async convertUtcToLocal(date: string): Promise<string> {
    const response = await this.spHttpClient.get(
      `${this.spBaseUrl}/_api/web/RegionalSettings/TimeZone/utcToLocalTime(@date)?@date='${date}'`,
      SPHttpClient.configurations.v1
    );
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json.value;
  }

}