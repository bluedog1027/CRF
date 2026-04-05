import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Guid } from '@microsoft/sp-core-library';
//import { IMSGraphFilteredResponse, IMSGraphGroupFilteredResponse, IMSGraphGroupList, IMSGraphResponse, ISPFile } from './IChangecontrolProps';
//import { sp } from "@pnp/sp/presets/all";


//https://cplace.sharepoint.com/sites/StorePortalDev/SitePages/IM.aspx?loadSPFX=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fmanifests.js

//https://cplace.sharepoint.com/sites/AppControl/SitePages/TopicHome.aspx?loadSPFX=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fmanifests.js

export async function batchGetRequestRaw(
  ctx: WebPartContext,
  listName: string,
  columnName: string,
  values: string[],
  statuses: string
): Promise<any[]> {

  const boundary = `batch_${Guid.newGuid()}`;
  const lines: string[] = [];

  values.forEach(v => {
    lines.push(`--${boundary}`);
    lines.push('Content-Type: application/http');
    lines.push('Content-Transfer-Encoding: binary');
    lines.push('');
    lines.push(
      `GET /sites/AppControl/_api/web/lists/GetByTitle('${listName}')/items?$select=*,Author/Title,Author/EMail,Editor/Title,Editor/EMail,AssignedTo/Title,AssignedTo/EMail,RequestForName/Title,RequestForName/EMail&$expand=Author,Editor,AssignedTo,RequestForName` +
      `&$filter=${columnName} eq '${encodeURIComponent(v)}' ${statuses} HTTP/1.1`
    );
    lines.push('Accept: application/json;odata.metadata=minimal');
    lines.push('');                // blank line → end of sub-request
  });
  lines.push(`--${boundary}--`);
  lines.push('');                  // final CRLF

  const resp = await ctx.spHttpClient.post(
    `${ctx.pageContext.web.absoluteUrl}/_api/$batch`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        Accept: 'multipart/mixed'
      },
      body: lines.join('\r\n')
    }
  );

  // 1️⃣  Get the boundary that the server actually used
  const contentType = resp.headers.get('content-type') ?? '';
  const match = contentType.match(/boundary="?([^;"]+)"?/i);
  if (!match) throw new Error('Batch response is missing a boundary');
  const respBoundary = match[1];            // e.g. batchresponse_26a4ff4e...

  // 2️⃣  Get the raw text
  const raw = await resp.text();

  // 3️⃣  Split on that boundary (case-insensitive filter for JSON parts)
  const parts = raw
    .split(`--${respBoundary}`)
    .filter(p => /content-type:\s*application\/json/i.test(p));

  console.log(parts);
  // 4️⃣  Extract & parse each JSON payload
  const results = parts.map(p => {
    const jsonStart = p.indexOf('{');
    if (jsonStart === -1) throw new Error('JSON start not found in part');

    const jsonRaw = p.slice(jsonStart).trim();
    const jsonEnd = jsonRaw.lastIndexOf('}');
    if (jsonEnd === -1) throw new Error('JSON end not found in part');

    return JSON.parse(jsonRaw.slice(0, jsonEnd + 1));
  });


  // 5️⃣  Flatten every .value[] array into one
  const allItems = results.flatMap(r => r.value ?? []);

  return allItems;          // ← single array of list items



}


export async function batchCRGetRequestRaw(
  ctx: WebPartContext,
  listName: string,
  columnName: string,
  values: string[],
  statuses: string
): Promise<any[]> {

  const boundary = `batch_${Guid.newGuid()}`;
  const lines: string[] = [];

  values.forEach(v => {
    lines.push(`--${boundary}`);
    lines.push('Content-Type: application/http');
    lines.push('Content-Transfer-Encoding: binary');
    lines.push('');
    lines.push(
      `GET /sites/AppControl/_api/web/lists/GetByTitle('${listName}')/items?$select=*,Author/Title,Author/EMail,Editor/Title,Editor/EMail,AssignedTo/Title,AssignedTo/EMail&$expand=Author,Editor,AssignedTo` +
      `&$filter=${columnName} eq '${encodeURIComponent(v)}' ${statuses} HTTP/1.1`
    );
    lines.push('Accept: application/json;odata.metadata=minimal');
    lines.push('');                // blank line → end of sub-request
  });
  lines.push(`--${boundary}--`);
  lines.push('');                  // final CRLF

  const resp = await ctx.spHttpClient.post(
    `${ctx.pageContext.web.absoluteUrl}/_api/$batch`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        Accept: 'multipart/mixed'
      },
      body: lines.join('\r\n')
    }
  );

  // 1️⃣  Get the boundary that the server actually used
  const contentType = resp.headers.get('content-type') ?? '';
  const match = contentType.match(/boundary="?([^;"]+)"?/i);
  if (!match) throw new Error('Batch response is missing a boundary');
  const respBoundary = match[1];            // e.g. batchresponse_26a4ff4e...

  // 2️⃣  Get the raw text
  const raw = await resp.text();

  // 3️⃣  Split on that boundary (case-insensitive filter for JSON parts)
  const parts = raw
    .split(`--${respBoundary}`)
    .filter(p => /content-type:\s*application\/json/i.test(p));

  console.log(parts);
  // 4️⃣  Extract & parse each JSON payload
  const results = parts.map(p => {
    const jsonStart = p.indexOf('{');
    if (jsonStart === -1) throw new Error('JSON start not found in part');

    const jsonRaw = p.slice(jsonStart).trim();
    const jsonEnd = jsonRaw.lastIndexOf('}');
    if (jsonEnd === -1) throw new Error('JSON end not found in part');

    return JSON.parse(jsonRaw.slice(0, jsonEnd + 1));
  });


  // 5️⃣  Flatten every .value[] array into one
  const allItems = results.flatMap(r => r.value ?? []);

  return allItems;          // ← single array of list items



}

export async function _getSPList<T>(client: SPHttpClient, url: string): Promise<T> {
  const result = await client.get(url, SPHttpClient.configurations.v1);
  const data = await result.json();
  return data.value;
}

export async function _getSPListJson<T>(client: SPHttpClient, url: string): Promise<T> {
  const result = await client.get(url, SPHttpClient.configurations.v1);
  const data = await result.json();
  return data;
}

export async function _getSPListItem<T>(client: SPHttpClient, url: string): Promise<T> {
  const result = await client.get(url, SPHttpClient.configurations.v1);
  const data = await result.json();
  return data;
}

export async function _updateSPList(client: SPHttpClient, url: string, body: string): Promise<SPHttpClientResponse> {
  const response: SPHttpClientResponse = await client.post(`${url}`, SPHttpClient.configurations.v1,
    {
      headers: {
        "accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose",
        'odata-version': '',
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE'
      }, body: body
    });
  return response;
}

export async function _createSPListItem<T>(client: SPHttpClient, url: string, body: string): Promise<T> {
  const response: SPHttpClientResponse = await client.post(`${url}`, SPHttpClient.configurations.v1,
    {
      headers: {
        "accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose",
        'odata-version': ''
      }, body: body
    });
  const data = await response.json();
  return data.d;
}

export async function _deleteSPListItem(client: SPHttpClient, url: string): Promise<SPHttpClientResponse> {
  const response: SPHttpClientResponse = await client.post(`${url}`, SPHttpClient.configurations.v1,
    {
      headers: {
        "accept": "application/json;odata=nometadata",
        "content-type": "application/json;odata=verbose",
        'odata-version': '',
        'IF-MATCH': '*',
        'X-HTTP-Method': 'DELETE'
      }
    });

  return response;
}


export async function _getUserID<T>(client: SPHttpClient, siteurl: string, email: string): Promise<T> {
  const result = await client.get(`${siteurl}/_api/web/siteusers?$select=Id&$filter=Email eq '${email}'`, SPHttpClient.configurations.v1);
  const data = await result.json();
  return data.value[0];
}


export async function _getOrAddUserID(client: SPHttpClient, siteurl: string, email: string): Promise<number> {
  // First, try to get the user by email
  const getUserResponse = await client.get(
    `${siteurl}/_api/web/siteusers?$select=Id&$filter=Email eq '${email}'`,
    SPHttpClient.configurations.v1
  );
  const getUserData = await getUserResponse.json();

  if (getUserData.value.length > 0) {
    // User exists, return the user Id
    return getUserData.value[0].Id;
  } else {
    // User doesn't exist, use ensureuser to add them
    const loginName = `i:0#.f|membership|${email}`;
    const ensureUserResponse = await client.post(
      `${siteurl}/_api/web/ensureuser`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose'
        },
        body: JSON.stringify({ 'logonName': loginName })
      }
    );
    const ensureUserData = await ensureUserResponse.json();
    return ensureUserData.d.Id;
  }
}


/* export function _getEmployee(ctx: WebPartContext, email: string): Promise<IMSGraphResponse> {
  return new Promise((resolve, reject) => {
    ctx.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api(`/users/${email}`)
          .select(['employeeId', 'displayName'])
          .expand('manager($levels=max;$select=id,displayName,employeeId)')
          .get((error, response: IMSGraphResponse) => {
            if (error) {
              console.error(error);
              reject(error);
              return;
            }
            resolve(response);
          })
          .catch(error => console.log(error));
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

export function _getEmployeeFromID(ctx: WebPartContext, id: string): Promise<IMSGraphFilteredResponse> {
  return new Promise((resolve, reject) => {
    ctx.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api(`/users?$count=true&$filter=employeeId eq '${id}'`)
          .select(['employeeId', 'displayName', 'mail'])
          .get((error, response: IMSGraphFilteredResponse) => {
            if (error) {
              console.error(error);
              reject(error);
              return;
            }
            resolve(response);
          })
          .catch(error => console.log(error));
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

//const extensions = supportState.assignmentGroups[assignmentGroup?.optionValue as string].extensions.find(ext => ext.extension_name === "ADGUID");
//const employeesResponse = await util._getGroupFromGUID(ctx, GroupGUID)
//extensions?.extension_value as string

export function _getGroupFromGUID(ctx: WebPartContext, GUID: string): Promise<IMSGraphGroupFilteredResponse> {
  return new Promise((resolve, reject) => {
    ctx.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api(`/groups/${GUID}/members`)
          .select(['displayName', 'mail', 'employeeId'])
          .count(true)
          .get((error, response: IMSGraphGroupFilteredResponse) => {
            if (error) {
              console.error(error);
              reject(error);
              return;
            }
            resolve(response);
          })
          .catch(error => console.log(error));
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

export function _getLoginUserGroup(ctx: WebPartContext): Promise<IMSGraphGroupList> {
  const body = { securityEnabledOnly: false };
  return new Promise((resolve, reject) => {
    ctx.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3): void => {
        client
          .api(`/me/getMemberGroups`)
          .post(body)
          .then(response => {
            resolve(response);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      })
      .catch(error => console.log(error));

  });
} */



export async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = response.json();
  return data;
}


export async function postData<T>(url: string, body: string): Promise<T> {
  const response = await fetch(url,
    {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: body
    });
  const data = response.json();
  return data;
}


export async function sendEmail(url: string, body: string): Promise<string> {
  const response = await fetch(url,
    {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

  const data = await response.text();
  return data;
}

export const isFalsy = (value: any): boolean => !value;


export function isEmptyObject(obj:any): boolean {
    return obj && obj.constructor === Object && Object.keys(obj).length === 0;
}


export function defaultValue<T>(value: T | undefined, exception: string): T | string {
  if (value !== undefined) {
    return value;
  }
  return exception;
}


export const isTwoDecimalPlaces = (value: any): boolean => {
  return /^\d+(\.\d{1,2})?$/.test(value);
}

export const formatStoreName = (value: string): string => {
  if (value.substring(0, 6) === 'STORE0') {
    return value.replace('STORE0', '');
  }
  return value;
}

/**
 * 
 * @param client 
 * @param siteUrl example https://cplace.sharepoint.com/sites/workflows/clm
 * @param filename sampledocument.docx
 * @param size 0 = 16X16; 1 = 32X32
 * @returns icon url
 */
export async function getDocumentIcon(client: SPHttpClient, siteUrl: string, filename: string, size: string): Promise<string> {
  const result = await client.get(`${siteUrl}/_api/web/maptoicon(filename='${filename}', progid='', size='${size}')`, SPHttpClient.configurations.v1);
  const data = await result.json();
  return `${siteUrl}/_layouts/15/images/${data.value}`;
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts.pop() || '';
  }
  return '';
}
/* 
export const uploadFileToSharePoint = async (file: File, folderUrl: string, IDPK: string, filename: string): Promise<ISPFile | undefined> => {
  try {
    let result;
    if (file.size > 10485760) { // if file size is larger than 10MB
      result = await sp.web.getFolderByServerRelativeUrl(folderUrl).files.addChunked(filename, file);
    } else {
      result = await sp.web.getFolderByServerRelativeUrl(folderUrl).files.add(filename, file, true);
    }
    // Edit file metadata
    const filedata = sp.web.getFileByServerRelativePath(result.data.ServerRelativeUrl);
    const listItem: ISPFile = await filedata.listItemAllFields.get();


    await sp.web.lists.getByTitle('Attachments').items.getById(listItem.Id).update({
      IDPK: `${IDPK}`,
    });
    console.log(listItem);
    return listItem;
  }
  catch (error) {
    console.error("Error uploading file", error);
  }
};
 */

export async function _recycleSPListItem(client: SPHttpClient, url: string): Promise<any> {
  const response: SPHttpClientResponse = await client.post(`${url}`, SPHttpClient.configurations.v1,
    {
      headers: {
        "accept": "application/json;odata=nometadata",
        "content-type": "application/json;odata=verbose",
        'odata-version': '',
        'IF-MATCH': '*'
      }
    });

  return response;
}

/* 
const emailBody = {
  properties: {
      To: [props.parentBidWaiver?.bidwaiver.RFPProcurement?.EMail, 'CentralizedProcurement@childrensplace.com'],
      Body: util.NotifyProcurementBidWaiver(props.contract.ID, props.contract.Title, props.context.pageContext.web.absoluteUrl),
      Subject: `${props.contract.Title} - Contract Workflow`
  }
}; */


export async function _SPhttppost(client: SPHttpClient, url: string, body: string): Promise<any> {
  const response: SPHttpClientResponse = await client.post(`${url}`, SPHttpClient.configurations.v1,
    {
      headers: {
        "accept": "application/json;odata=nometadata",
        "content-type": "application/json;odata=nometadata"
      }, body: body
    });
  return response;
}


export function getNextTuesday(): Date {
  const result = new Date();
  const currentDay = result.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const daysUntilTuesday = (9 - currentDay) % 7 || 7; // Ensure it's always in the future
  result.setDate(result.getDate() + daysUntilTuesday);
  return result;
}


/** Date format for fiscal calendar API */
export const getFormattedDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


export function getLocalDateFromUTCString(utcString:string): Date {
  const utcDate = new Date(utcString);
  const year = utcDate.getUTCFullYear();
  const month = utcDate.getUTCMonth();
  const day = utcDate.getUTCDate();

  // Create a new Date object at local time midnight for the same UTC date
  return new Date(year, month, day);
}

export const estFormat: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  hour12: true, // optional: use 12-hour format
  weekday: "long", // optional: include day of the week
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
