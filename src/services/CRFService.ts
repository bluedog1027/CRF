import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
//import "@pnp/sp/items/get-all";
import "@pnp/sp/attachments";
import "@pnp/sp/content-types";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/profiles";
import { ICRFFormItem, IUserReference } from "../models/ICRFFormItem";
import { _createSPListItem, _updateSPList } from "./Util";
import { SPHttpClient } from '@microsoft/sp-http';

export interface ICRFQueryOptions {
  searchText?: string;
  status?: string;
  department?: string;
  contentType?: string;
  pageSize?: number;
}

const STORE_OPS_FIELD = "Who_x0020_in_x0020_Store_x0020_O";

export class CRFService {
  private readonly listName = "CRF";

  constructor(private sp: SPFI) { }

  public async getContentTypes(): Promise<{ id: string; name: string }[]> {
    const types = await this.sp.web.lists
      .getByTitle(this.listName)
      .contentTypes.select("Name", "Id/StringValue")();

    return types.map((type) => ({ id: type.Id.StringValue, name: type.Name }));
  }

  public async isCurrentUserInGroup(groupId: number): Promise<boolean> {
    try {
      const [currentUser, members] = await Promise.all([
        this.sp.web.currentUser(),
        this.sp.web.siteGroups.getById(groupId).users.select("Id")(),
      ]);
      return members.some((member: { Id: number }) => member.Id === currentUser.Id);
    } catch {
      return false;
    }
  }

  public async getItems(options: ICRFQueryOptions = {}): Promise<ICRFFormItem[]> {
    const { searchText, status, department, contentType, pageSize = 100 } = options;

    let itemsQuery = this.sp.web.lists
      .getByTitle(this.listName)
      .items.select(
        "Id",
        "Title",
        "Comm_x0020_Status",
        "Department",
        "Comm_x0020_Type",
        "FlowStatus",
        "Actual_x0020_Publication_x0020_D",
        "Created",
        "ContentTypeId",
        "ContentType/Name",
        "Author/Id",
        "Author/Title",
        "Author/EMail"
      )
      .expand("Author", "ContentType")
      .top(pageSize)
      .orderBy("Actual_x0020_Publication_x0020_D", false);

    const filters: string[] = [];

    if (searchText) {
      const escaped = searchText.replace(/'/g, "''");
      filters.push(`substringof('${escaped}', Title)`);
    }

    if (status) {
      filters.push(`Comm_x0020_Status eq '${status}'`);
    }

    if (department) {
      filters.push(`Department eq '${department}'`);
    }

    if (contentType) {
      const escapedContentType = contentType.replace(/'/g, "''");
      filters.push(`ContentType/Name eq '${escapedContentType}'`);
    }

    if (filters.length) {
      itemsQuery = itemsQuery.filter(filters.join(" and "));
    }

    const results = await itemsQuery();
    return results.map(this.mapItem);
  }

  public async getItem(id: number): Promise<ICRFFormItem> {
    const item = await this.sp.web.lists
      .getByTitle(this.listName)
      .items.getById(id)
      .select(
        "*",
        "Author/Id",
        "Author/Title",
        "Author/EMail",
        "Submitter/Id",
        "Submitter/Title",
        "Submitter/EMail",
        `${STORE_OPS_FIELD}/Id`,
        `${STORE_OPS_FIELD}/Title`,
        `${STORE_OPS_FIELD}/EMail`,
        "ContentTypeId",
        "ContentType/Name"
      )
      .expand("Author", "Submitter", STORE_OPS_FIELD, "ContentType")();

    return this.mapItem(item);
  }

  public async createItem(ctx: SPHttpClient, payload: ICRFFormItem): Promise<ICRFFormItem> {
    const body = this.normalizePayload(payload);
    console.log(body);
    const bodyTwo = {
      "__metadata": {
        "type": "SP.Data.CRFListItem"
      },
      "Title": "et",
      "Department": "Internal Audit",
      "Stores_x0020_or_x0020_Channels_x": { "results": [
        "ALL US (including HI & PR)",
        "ALL CAN (including Quebec French)"
      ]},
      "Desired_x0020_Publish_x0020_Date": "2026-04-06T04:00:00.000Z",
      "Effective_x0020_Date": "2026-04-10T04:00:00.000Z",
      "Effective_x0020_Fiscal_x0020_Wee": 12,
      "Are_x0020_resources_x0020_availa": "Yes",
      "Will_x0020_materials_x0020_be_x0": "No",
      "Are_x0020_materials_x0020_re_x00": "Yes",
      "Who_x0020_can_x0020_stores_x002f": "etaylor",
      "Effective_x0020_End_x0020_Date": "2026-04-22T04:00:00.000Z",
      "Scope_x0020_of_x0020_Project": "test ",
      "Management_x0020_Visibility": "HQ",
      "Who_x0020_in_x0020_Store_x0020_OId": { 'results': [17,42] },
      "ContentTypeId": "0x0100EF7710CF532A7C409077AE3B5E447A3D"
    }
    console.log(bodyTwo);
    const data = await _createSPListItem(ctx, `https://cplace.sharepoint.com/sites/Workflows/StoreOps/_api/web/lists/getbytitle('CRF')/items`, JSON.stringify(body));
    //const { data } = await this.sp.web.lists.getByTitle(this.listName).items.add(body);
    return this.mapItem(data);
  }

  public async updateItem(ctx: SPHttpClient, id: number, payload: Partial<ICRFFormItem>): Promise<void> {
    const body = this.normalizePayload(payload);
    await _updateSPList(ctx,`https://cplace.sharepoint.com/sites/Workflows/StoreOps/_api/web/lists/getbytitle('CRF')/items(${id})`,JSON.stringify(body))
    //await this.sp.web.lists.getByTitle(this.listName).items.getById(id).update(body);
  }

  public async addAttachments(itemId: number, files: File[]): Promise<void> {
    if (!files?.length) {
      return;
    }

    const item = this.sp.web.lists.getByTitle(this.listName).items.getById(itemId);
    for (const file of files) {
      const content = await file.arrayBuffer();
      await item.attachmentFiles.add(file.name, content);
    }
  }

  public async deleteItem(id: number): Promise<void> {
    await this.sp.web.lists.getByTitle(this.listName).items.getById(id).delete();
  }

  private normalizePayload(payload: Partial<ICRFFormItem>): Partial<ICRFFormItem> {
    const body: Partial<ICRFFormItem> = {
      "__metadata": { type: 'SP.Data.CRFListItem' }
    };
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      if(Array.isArray(value) && value.length === 0){
        return;
      }

      if (Array.isArray(value)) {
        const entries = value as unknown[];
        if (entries.every((entry: unknown) => typeof entry === "object" && entry !== null && "id" in (entry as object))) {
          const ids = entries
            .map((entry: any) => entry?.id)
            .filter((id: unknown): id is number => typeof id === "number");
            body[`${key}Id`] = { 'results': ids };
        } else {
          body[key] = { 'results': value };
        }
      } else if (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof (value as { id?: unknown }).id === "number"
      ) {
        body[`${key}Id`] = (value as { id: number }).id;
      } else {
        body[key] = value;
      }
    });

    return body;
  }

  public async searchUsers(query: string): Promise<IUserReference[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const results = await this.sp.profiles.clientPeoplePickerSearchUser({
      QueryString: query,
      MaximumEntitySuggestions: 8,
      AllowEmailAddresses: true,
      PrincipalSource: 15,
      PrincipalType: 1 + 2 + 4 + 8,
    });

    return results.map((result: any) => ({
      id:
        result.EntityData?.SPUserID && !Number.isNaN(Number(result.EntityData.SPUserID))
          ? Number(result.EntityData.SPUserID)
          : undefined,
      title: result.DisplayText,
      email: result.EntityData?.Email ?? result.Description,
      loginName: result.Key,
    }));
  }

  public async ensureUser(loginName: string): Promise<IUserReference> {
    const ensured = await this.sp.web.ensureUser(loginName);
    const data: any = ensured;
    return {
      id: data.Id ?? data.data?.Id,
      text: data.Title ?? data.data?.Title,
      secondaryText: data.Email ?? data.data?.Email,
      loginName: data.LoginName ?? data.data?.LoginName,
    };
  }

  private mapItem = (item: any): ICRFFormItem => {
    const mapped: ICRFFormItem = {
      ...item,
      ContentType: item.ContentType?.Name ?? item.ContentType,
      ContentTypeId: item.ContentTypeId ?? item.ContentType?.Id?.StringValue,
      Submitter: this.mapUser(item.Submitter ?? item.Author),
    } as ICRFFormItem;

    const storeOpsUsers = this.mapUsers(item[STORE_OPS_FIELD]);
    if (storeOpsUsers) {
      (mapped as any)[STORE_OPS_FIELD] = storeOpsUsers;
    }

    return mapped;
  };

  private mapUser(user: any): IUserReference | undefined {
    if (!user) {
      return undefined;
    }

    return {
      id: user.Id ?? user.id,
      text: user.Title ?? user.title ?? user.DisplayText,
      secondaryText: user.EMail ?? user.Email ?? user.Description,
      loginName: user.LoginName ?? user.loginName,
    };
  }

  private mapUsers(users: any): IUserReference[] | undefined {
    if (!users) {
      return undefined;
    }

    const items = Array.isArray(users) ? users : users.results;
    if (!Array.isArray(items)) {
      return undefined;
    }

    const mapped = items
      .map((entry) => this.mapUser(entry))
      .filter((entry): entry is IUserReference => Boolean(entry));

    return mapped.length ? mapped : undefined;
  }
}
