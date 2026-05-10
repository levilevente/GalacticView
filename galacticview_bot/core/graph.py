from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from galacticview_bot.core.state import AgentState
from galacticview_bot.nodes.reasoner import reasoner
from galacticview_bot.nodes.tool_node import custom_tool_node
from galacticview_bot.nodes.formatter import formatter
from galacticview_bot.edges.router import should_continue

workflow = StateGraph(AgentState)

workflow.add_node("agent", reasoner)
workflow.add_node("tools", custom_tool_node)
workflow.add_node("formatter", formatter)

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        "formatter": "formatter",
    },
)

workflow.add_edge("tools", "agent")
workflow.add_edge("formatter", END)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)