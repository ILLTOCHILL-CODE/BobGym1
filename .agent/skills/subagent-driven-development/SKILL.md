---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session or facing 3+ independent issues - dispatches fresh subagent for each task with code review between tasks.
---

# Subagent-Driven Development

Create and execute plan by dispatching fresh subagent per task or issue, with code and output review after each or batch of tasks.

**Core principle:** Fresh subagent per task + review between or after tasks = high quality, fast iteration.

## Execution Models

### Sequential Execution
When tasks are tightly coupled or must be executed in order.
- Dispatch one agent per task.
- Review output and code after each task.
- Apply feedback before moving to next task.

### Parallel Execution (Independent Domains)
When tasks involve different files, subsystems, or unrelated bugs.
- Dispatch one agent per independent problem domain.
- Let them work concurrently.
- Integrate and run full test suite after all return.

## Sequential Execution Process

1. **Load Plan**: Read plan file, create Todo list.
2. **Execute Task**: Dispatch fresh subagent with focused prompt. 
   - **Tip**: Load the appropriate **[Expert Persona](file:///c:/CafeGuru/.agent/skills/expert-personas/)** for the current task type (e.g., `developer` for coding, `tech-writer` for docs).
3. **Review Work**: Dispatch `qa-engineer` or `reviewer` subagent to judge implementation.
4. **Apply Feedback**: Fix any Critical or Important issues found.
5. **Mark Complete**: Move to next task.
6. **Final Review**: Holistic check after all tasks complete.

## Parallel Investigation Process

For unrelated failures:
1. **Identify Independent Domains** (e.g., UI tests vs. API tests).
2. **Create Focused Agent Tasks** with clear scope and constraints.
3. **Dispatch in Parallel**.
4. **Review and Integrate** changes, checking for conflicts.

## Red Flags
- Skipping code review between tasks.
- Proceeding with unfixed Critical issues.
- Dispatching multiple implementation agents for the SAME files (conflicts).
- Implementing without reading the plan task.

## Agent Prompt Structure
- **Focused**: One clear problem domain.
- **Self-contained**: All context needed provided.
- **Specific about output**: What exactly should the agent return?

---
**Verification**: After agents return, review each summary, check for conflicts, and run the full test suite.
