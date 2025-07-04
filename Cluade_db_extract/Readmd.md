<img src="System.png" alt="Implementation Diagram" width="1000">


1.Install `Claude Desktop`

2.Install uv by running `pip install uv`

3.Run `uv init my-first-mcp-server` to create a project directory

4.Run `uv add "mcp[cli]"` to add mcp cli in your project

5.Few folks may get type errors for which you can run `pip install --upgrade typer` to upgrade typer library to its latest version

6.Write code in `main.py` for leave management server:


``` bash

from mcp.server.fastmcp import FastMCP
from typing import List

# In-memory mock database with 20 leave days to start
employee_leaves = {
    "E001": {"balance": 18, "history": ["2025-01-27", "2025-02-01"]},
    "E002": {"balance": 20, "history": []}
}

# Create MCP server
mcp = FastMCP("LeaveManager")

# Tool: Check Leave Balance
@mcp.tool()
def get_leave_balance(employee_id: str) -> str:
    """Check how many leave days are left for the employee"""
    data = employee_leaves.get(employee_id)
    if data:
        return f"{employee_id} has {data['balance']} leave days remaining."
    return "Employee ID not found."

# Tool: Apply for Leave with specific dates
@mcp.tool()
def apply_leave(employee_id: str, leave_dates: List[str]) -> str:
    """
    Apply leave for specific dates (e.g., ["2025-04-17", "2025-05-01"])
    """
    if employee_id not in employee_leaves:
        return "Employee ID not found."

    requested_days = len(leave_dates)
    available_balance = employee_leaves[employee_id]["balance"]

    if available_balance < requested_days:
        return f"Insufficient leave balance. You requested {requested_days} day(s) but have only {available_balance}."

    # Deduct balance and add to history
    employee_leaves[employee_id]["balance"] -= requested_days
    employee_leaves[employee_id]["history"].extend(leave_dates)

    return f"Leave applied for {requested_days} day(s). Remaining balance: {employee_leaves[employee_id]['balance']}."


# Resource: Leave history
@mcp.tool()
def get_leave_history(employee_id: str) -> str:
    """Get leave history for the employee"""
    data = employee_leaves.get(employee_id)
    if data:
        history = ', '.join(data['history']) if data['history'] else "No leaves taken."
        return f"Leave history for {employee_id}: {history}"
    return "Employee ID not found."

# Resource: Greeting
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}! How can I assist you with leave management today?"

if __name__ == "__main__":
    mcp.run()


```



7.Install this server inside Claude desktop by running `uv run mcp install main.py` in the project directory

8.Kill any running instance of Claude from Task Manager. Restart Claude Desktop

9.In Claude desktop, now you will see tools from this server:
<img src="tool'sin cluade.png" alt="Implementation Diagram" width="1000">