const LINE_CHANNEL_ACCESS_TOKEN = "PUT_LINE_CHANNEL_ACCESS_TOKEN_HERE";
const GEMINI_API_KEY = "PUT_GEMINI_API_KEY_HERE";
const SPREADSHEET_ID = "PUT_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Sheet1";

const BRANCH_MAP = {
  L1: "L1 สยามสแควร์วัน",
  L2: "L2 เซ็นทรัลพระราม 9",
  L3: "L3 เซ็นทรัลเวสเกต",
  L4: "L4 สีลมคอมเพล็กซ์",
  L5: "L5 เซ็นทรัลปิ่นเกล้า",
  L6: "L6 เซ็นทรัลลาดพร้าว",
  L7: "L7 มาร์เช่ ทองหล่อ",
  L8: "L8 ฟิวเจอร์พาร์ค รังสิต",
  L9: "L9 เซ็นทรัลพระราม 2",
  L10: "L10 เซ็นทรัลพัทยาบีช",
  L12: "L12 เดอะมอลล์ บางกะปิ",
  L13: "L13 เดอะมอลล์ บางแค",
  L14: "L14 เซ็นทรัลเวสต์วิลล์",
  L15: "L15 พรอมานาด",
  L16: "L16 เอสพลานาด รัชดา",
  L17: "L17 ซีคอนสแควร์ ศรีนครินทร์",
  L20: "L20 ซีคอนบางแค",
  L21: "L21 เมกาบางนา",
  L22: "L22 แจ้งวัฒนะ",
  L23: "L23 One Bangkok",
  L24: "L24 เทอมินอล อโศก",
  L25: "L25 เดอะมอลล์งามวงศ์วาน",
  L26: "L26 เซ็นทรัลขอนแก่น",
  L27: "L27 เซ็นทรัลเวิลด์",
  L28: "L28 เอ็มควอเทียร์",
  L29: "L29 ชิดลม",
  L30: "L30 เซ็นทรัลอีสวิลล์",
};

const BRANCH_NAME_TO_CODE = {
  "สยามสแควร์วัน": "L1",
  "เซ็นทรัลพระราม 9": "L2",
  "เซ็นทรัลเวสเกต": "L3",
  "สีลมคอมเพล็กซ์": "L4",
  "เซ็นทรัลปิ่นเกล้า": "L5",
  "เซ็นทรัลลาดพร้าว": "L6",
  "มาร์เช่ ทองหล่อ": "L7",
  "ฟิวเจอร์พาร์ค รังสิต": "L8",
  "เซ็นทรัลพระราม 2": "L9",
  "เซ็นทรัลพัทยาบีช": "L10",
  "เดอะมอลล์ บางกะปิ": "L12",
  "เดอะมอลล์ บางแค": "L13",
  "เซ็นทรัลเวสต์วิลล์": "L14",
  "พรอมานาด": "L15",
  "เอสพลานาด รัชดา": "L16",
  "ซีคอนสแควร์ ศรีนครินทร์": "L17",
  "ซีคอนบางแค": "L20",
  "เมกาบางนา": "L21",
  "แจ้งวัฒนะ": "L22",
  "One Bangkok": "L23",
  "เทอมินอล อโศก": "L24",
  "เดอะมอลล์งามวงศ์วาน": "L25",
  "เซ็นทรัลขอนแก่น": "L26",
  "เซ็นทรัลเวิลด์": "L27",
  "เอ็มควอเทียร์": "L28",
  "ชิดลม": "L29",
  "เซ็นทรัลอีสวิลล์": "L30",
};

const HEADER_ROW = [
  "Chat Time",
  "วันที่นัด",
  "ผู้ดูแล",
  "นัดสาขา",
  "โปรแกรม",
  "ช่องทาง",
  "ประเภท",
  "เบอร์โทร",
  "หมายเหตุ",
];

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput("No content");
  }

  const payload = JSON.parse(e.postData.contents);
  const events = payload.events || [];

  events.forEach((event) => {
    if (event.type === "message" && event.message && event.message.type === "text") {
      handleMessage(event);
    }
  });

  return ContentService.createTextOutput("OK");
}

function handleMessage(event) {
  const chatTime = new Date(event.timestamp || Date.now());
  const messageText = event.message.text || "";
  const structured = extractStructuredData(messageText);
  const normalized = normalizeRecord(structured, chatTime, messageText);
  appendToSheet(normalized);
}

function extractStructuredData(messageText) {
  const prompt = [
    "ช่วยจัดเรียงข้อมูลลงตาราง โดยมีหัวตาราง:",
    "Chat Time | วันที่นัด | ผู้ดูแล | นัดสาขา | โปรแกรม | ช่องทาง | ประเภท | เบอร์โทร | หมายเหตุ",
    "ให้ตอบกลับเป็น JSON เท่านั้น โดยใช้คีย์:",
    "appointment_date, manager, branch, program, channel, customer_type, phone, note",
    "หมายเหตุสำหรับข้อมูลอื่นๆ เช่น เลื่อนนัด เลื่อนวัน เพิ่มโปรแกรม เปลี่ยนสาขา ย้ายสาขา",
    "ข้อความต้นฉบับ:",
    messageText,
  ].join("\n");

  const response = UrlFetchApp.fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const raw = response.getContentText();
  const data = JSON.parse(raw);
  const text =
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts[0]
      ? data.candidates[0].content.parts[0].text
      : "{}";

  return JSON.parse(text);
}

function normalizeRecord(structured, chatTime, fallbackText) {
  const appointmentDate = normalizeDate(structured.appointment_date || "");
  const manager = normalizeManager(structured.manager || "");
  const branch = normalizeBranch(structured.branch || "");
  const program = String(structured.program || "");
  const channel = String(structured.channel || "");
  const customerType = String(structured.customer_type || "");
  const phone = normalizePhone(structured.phone || "");
  const note = String(structured.note || "") || fallbackText;

  return {
    chatTime: Utilities.formatDate(chatTime, "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss"),
    appointmentDate,
    manager,
    branch,
    program,
    channel,
    customerType,
    phone,
    note,
  };
}

function normalizeDate(input) {
  if (!input) return "";
  const cleaned = String(input).trim().split(" ")[0];
  const match = cleaned.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (!match) return cleaned;
  const day = Number(match[1]);
  const month = Number(match[2]);
  if (!day || !month) return cleaned;
  return `${month}/${day}/2026`;
}

function normalizeManager(input) {
  const code = extractBranchCode(input);
  if (code && BRANCH_MAP[code]) {
    return BRANCH_MAP[code];
  }
  return String(input || "").trim();
}

function normalizeBranch(input) {
  const code = extractBranchCode(input);
  if (code && BRANCH_MAP[code]) {
    return BRANCH_MAP[code];
  }
  const normalized = String(input || "").trim();
  const mappedCode = BRANCH_NAME_TO_CODE[normalized];
  if (mappedCode && BRANCH_MAP[mappedCode]) {
    return BRANCH_MAP[mappedCode];
  }
  return normalized;
}

function extractBranchCode(input) {
  const match = String(input || "").toUpperCase().match(/L\d{1,2}/);
  return match ? match[0] : "";
}

function normalizePhone(input) {
  if (!input) return "";
  const text = String(input).trim();
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 6) {
    return `'${digits}`;
  }
  return text;
}

function appendToSheet(record) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  ensureHeader(sheet);
  sheet.appendRow([
    record.chatTime,
    record.appointmentDate,
    record.manager,
    record.branch,
    record.program,
    record.channel,
    record.customerType,
    record.phone,
    record.note,
  ]);
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
}

function doGet() {
  return ContentService.createTextOutput("LINE webhook is running");
}
