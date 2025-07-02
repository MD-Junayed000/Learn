# Calendar MCP Server

An MCP (Model Context Protocol) server that provides calendar integration for Cursor.

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   npm init -y
   npm install @modelcontextprotocol/sdk@latest dotenv node-ical zod
   ```

2. **Create environment file**:
   Create a `.env` file in the project root with your calendar URL:
   ```
   CALENDAR_ICS_URL=https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/public/basic.ics
   ```

3. **Get your Google Calendar ICS URL**:

## Running the Server

```bash
npm start
```

Or directly:
```bash
node server.js
```
## then in cursor>>settings>>Tool and Intregations:
click custom MCP server and 
```bash
{
  "mcpServers": {
    "myCalenderDate": {
      "command": "node",
      "args": [
        "C:\\Users\\ASUS\\Desktop\\Learn\\cursor_add_calender\\server.js"
      ],
      "env": {
        "CALENDAR_ICS_URL": "https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/public/basic.ics"
      }
    }
  }
} 


```






## Available Tools

- `getMyCalendarDataByDate`: Fetches calendar events for a specific date (YYYY-MM-DD format)

## Troubleshooting

- **ES Module Error**: Make sure `"type": "module"` is in package.json (already fixed)
- **Calendar URL Error**: Ensure your `.env` file has a valid `CALENDAR_ICS_URL`
- **No Events**: Check if your calendar has events for the requested date

## Example Usage

The server provides a tool that can be called with a date parameter to get calendar events for that specific date. 