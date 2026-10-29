AI tools can help with a research brief, a first draft or a small software change. The useful habit is to connect each tool to a specific task and a way to check the result. An impressive answer is only a starting point if nobody can verify its facts or use it in the actual workflow.

This guide focuses on practical working habits rather than a ranking of models or a promise of time savings. Features and organizational access can vary, so use the tools and workspace settings your team has approved.

## Choose the task before choosing the tool

Write down the output you need. A one-page project update, a comparison of supplied documents and a tested code change are different tasks. Each requires different context and a different review.

- Use a conversational assistant such as **ChatGPT** for drafting, restructuring information and developing a brief through follow-up questions.
- Use an editor-integrated coding assistant such as **GitHub Copilot** when the task depends on repository context and the development workflow.
- Use a source-grounded research workspace such as **Gemini Notebook** when you need to ask questions across a selected document collection and inspect the supporting passages.

These are examples of task fit, not guarantees that a tool will produce a correct result without review.

## Tip 1: give the assistant a usable brief

State the result, the relevant background and the format you want. Add the boundaries that matter, such as keeping approved dates unchanged or leaving a message as a draft. The [official OpenAI prompting guidance](https://learn.chatgpt.com/docs/prompting) describes this approach for ChatGPT.

Here is an original prompt for a routine project update:

```text
Prepare a short update for the delivery team from the notes below.
List confirmed decisions, next actions and missing information.
Keep the dates and task owners exactly as written.
If an owner is missing, mark it as unassigned.
Use a concise table followed by questions for the next meeting.
Do not send the update.
```

Keep a copy of the input and the reviewed output for recurring work. That makes it easier to see whether the same prompt still produces a useful result when the source material changes.

## Tip 2: separate information gathering from writing

For a research task, first ask for the relevant evidence and unresolved questions. Then ask for the draft based on that evidence. This makes it easier to catch unsupported claims before they become polished prose.

For example, when comparing two product proposals, build a list of their stated requirements, assumptions and missing costs. Only then ask for a decision brief. Mark unknown information as unknown rather than allowing the assistant to fill the gap with a plausible estimate.

## Tip 3: inspect the cited passage

Google's source-grounded notebook documentation explains how selected notes and imported sources can support answers and citations. See [working with sources](https://support.google.com/gemininotebook/answer/16215270) and [notes with supporting citations](https://support.google.com/gemininotebook/answer/16262519?hl=en).

A citation makes review easier; it does not finish the review. Open the passage, confirm that it supports the claim and check whether the document is current. For conflicting sources, record the disagreement and identify who can resolve it.

Use a small, relevant collection for a focused question. A folder containing unrelated drafts, outdated policies and final documents creates avoidable ambiguity even when the tool can process all of them.

## Tip 4: keep coding requests small and reviewable

Before asking a coding assistant to make a change, identify the affected behavior and the files that explain it. Request one bounded improvement with an observable result. GitHub recommends providing relevant context and treating generated suggestions as work that still needs review; see its [Copilot best-practices guide](https://docs.github.com/en/copilot/get-started/best-practices-for-using-github-copilot).

For a contact form, a useful request might be to fix one validation error and explain how to reproduce it. Review the diff, run the relevant checks and try both valid and invalid submissions. A successful build does not prove that the user-facing behavior is correct.

Avoid accepting a large rewrite simply because it is easier to generate. Smaller changes are easier to understand, test and maintain.

## Tip 5: ask for alternatives only when you can compare them

When a draft misses the mark, explain what should change. For example, ask for a shorter opening, clearer next steps or a version for a technical audience. Name the criterion rather than asking for an undefined improvement.

If you request multiple options, compare them against the same requirements. A concise option may omit necessary context; a detailed option may hide the action people need to take. Pick the version that serves the reader and edit it into one coherent result.

## Tip 6: build a verification checklist for each workflow

Different outputs need different checks. A meeting summary needs correct names, decisions and task ownership. A research note needs supported claims and working sources. A code change needs review of behavior, inputs and failure cases.

For an AI-assisted business document, a simple review can ask:

1. Does the output answer the actual request?
2. Are names, dates, quantities and references correct?
3. Can another person distinguish facts from assumptions?
4. Are important omissions clearly marked?
5. Has a responsible person approved any external action?

Do the checks against the original material, not only against the assistant's explanation of its own output.

## Tip 7: measure the entire task

Track the effort from the original request to a result that is ready to use. Include prompt preparation, review, corrections and handover. A quickly generated draft that needs extensive repair may be less useful than a smaller, more structured output.

For a team trial, choose a few representative tasks and define quality before comparing results. Keep examples of failures as well as successes. Use what you learn to update the template and decide where human judgment remains essential.

## A repeatable working routine

- **Prepare:** choose one outcome and gather the relevant material.
- **Request:** provide a clear brief and useful boundaries.
- **Inspect:** check facts, omissions and supporting evidence.
- **Test:** validate the result in its real context.
- **Finish:** edit, approve and hand over the final output.

Start with one recurring task this week and improve the routine through actual use. If a workflow needs deeper access to business systems, our [AI assistant development team](ai-agent-development.html) can help define the integration and its review points.

## Further reading

- [OpenAI: prompting guidance for ChatGPT](https://learn.chatgpt.com/docs/prompting)
- [GitHub: using Copilot effectively](https://docs.github.com/en/copilot/get-started/best-practices-for-using-github-copilot)
- [Google: sources in Gemini Notebook](https://support.google.com/gemininotebook/answer/16215270)
