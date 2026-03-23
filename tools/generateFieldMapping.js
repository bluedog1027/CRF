const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "..", "CRFColumns.csv");
const OUTPUT_PATH = path.join(__dirname, "..", "src", "config", "CRFFieldMapping.ts");

const FIELD_TYPE_MAP = {
  text: "FieldType.Text",
  note: "FieldType.Note",
  choice: "FieldType.Choice",
  multichoice: "FieldType.MultiChoice",
  datetime: "FieldType.DateTime",
  boolean: "FieldType.Boolean",
  user: "FieldType.User",
  usermulti: "FieldType.UserMulti",
  number: "FieldType.Number",
  url: "FieldType.URL",
};

function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === "\"") {
      if (inQuotes && text[i + 1] === "\"") {
        currentValue += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  if (currentValue.length || currentRow.length) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.length && row.some((value) => value && value.trim().length));
}

function normalizeFieldType(raw) {
  if (!raw) {
    return { typeToken: "FieldType.Text", options: undefined };
  }

  const cleaned = raw.trim();
  const optionStart = cleaned.indexOf("[");
  const basePart = optionStart >= 0 ? cleaned.slice(0, optionStart).trim() : cleaned;
  const optionsPart = optionStart >= 0 ? cleaned.slice(optionStart + 1, cleaned.lastIndexOf("]")) : "";
  const parenMatch = basePart.match(/\(([^)]+)\)/);
  const inferred = (parenMatch ? parenMatch[1] : basePart).trim().toLowerCase().replace(/\s+/g, "");
  const typeToken = FIELD_TYPE_MAP[inferred] || FIELD_TYPE_MAP.text;

  const options = optionsPart
    ? optionsPart
        .split(/\r?\n/)
        .map((option) => option.trim())
        .filter(Boolean)
    : undefined;

  return { typeToken, options };
}

function main() {
  const csv = fs.readFileSync(CSV_PATH, "utf8").replace(/^[\uFEFF]/, "");
  const rows = parseCsv(csv);
  const [headerRow, ...dataRows] = rows;

  const headerIndex = headerRow.reduce((map, header, index) => {
    map[header.trim()] = index;
    return map;
  }, {});

  const contentTypes = ["CRF General", "CRF Marketing", "CRF Transfer", "CRF QA"];
  const mapping = contentTypes.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  dataRows.forEach((row) => {
    const internalName = row[headerIndex.InternalName]?.trim();
    if (!internalName) {
      return;
    }

    const displayName = row[headerIndex.DisplayName]?.trim() || internalName;
    const rawType = row[headerIndex.FieldType]?.trim();
    const usedIn = row[headerIndex.UsedInContentTypes]?.split(";").map((ct) => ct.trim()).filter(Boolean) || [];

    const { typeToken, options } = normalizeFieldType(rawType);
    const config = {
      internalName,
      displayName,
      fieldType: typeToken,
      ...(options && options.length ? { options } : {}),
    };

    usedIn.forEach((contentType) => {
      if (!mapping[contentType]) {
        mapping[contentType] = [];
      }
      mapping[contentType].push({ ...config, ...(options ? { options: [...options] } : {}) });
    });
  });

  const serialized = JSON.stringify(mapping, null, 2).replace(/"FieldType\.(\w+)"/g, "FieldType.$1");
  const output = `import { CRFFieldMap } from "../models/CRFFieldModel";
import { FieldType } from "../models/FieldType";

export const CRF_FIELD_MAPPING: CRFFieldMap = ${serialized};\n`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, output, "utf8");
  console.log(`Generated mapping with ${Object.values(mapping).reduce((sum, list) => sum + list.length, 0)} entries.`);
}

main();
