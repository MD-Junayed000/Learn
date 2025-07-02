import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import ical from "node-ical";
import { z } from "zod";

dotenv.config();

(async () => {
  const server = new McpServer({
    name: "Junayed's Calendar (ICS)",
    version: "1.0.0",
  });

  console.log("Registering ping tool...");
  server.registerTool(
    "ping",
    {
      description: "Ping tool",
      inputSchema: z.object({}),
      outputSchema: z.object({ pong: z.string() }),
    },
    async () => ({ pong: "pong" })
  );
  console.log("Ping tool registered.");

  console.log("Registering getMyCalendarDataByDate tool...");
  server.registerTool(
    "getMyCalendarDataByDate",
    {
      description: "Fetches events from ICS calendar for a specific date.",
      inputSchema: z.object({
        date: z.string().describe("Date in YYYY-MM-DD format").refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format.",
        }),
      }),
      outputSchema: z.object({
        meetings: z.array(z.string()),
      }),
    },
    async ({ date }) => {
      const events = await ical.async.fromURL(process.env.CALENDAR_ICS_URL);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const meetings = Object.values(events)
        .filter((evt) => evt.type === "VEVENT" && evt.start >= start && evt.start < end)
        .map((evt) => {
          const when = evt.start.toISOString();
          const title = evt.summary || "(no title)";
          return `${title} at ${when}`;
        });

      return { meetings };
    }
  );
  console.log("getMyCalendarDataByDate tool registered.");

  const transport = new StdioServerTransport();
  console.log("Connecting to Cursor...");
  await server.connect(transport);
  console.log("MCP server started and connected.");
})();
