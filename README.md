<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15RHP5sPJB0jPGct3T9xuDQ6GyAL7nY5L

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## LINE OA → Google Sheets (Apps Script)

Use the Google Apps Script in `apps-script/lineWebhook.gs` to receive LINE group messages, format the data with Gemini, and append to Google Sheets.

1. Create a new Apps Script project and paste the file contents.
2. Fill in the constants:
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `GEMINI_API_KEY`
   - `SPREADSHEET_ID`
   - `SHEET_NAME`
3. Deploy as Web App and set the LINE webhook URL to the deployment URL.
4. Ensure the Google Sheet has (or will create) the header:
   `Chat Time | วันที่นัด | ผู้ดูแล | นัดสาขา | โปรแกรม | ช่องทาง | ประเภท | เบอร์โทร | หมายเหตุ`
