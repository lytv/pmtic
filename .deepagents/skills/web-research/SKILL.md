---
name: browser-automation
description: A comprehensive skill for autonomous web research and interaction using a headless browser.
author: User
version: 2.0.0
---

# Browser Automation Skill

This skill equips you with advanced capabilities to navigate, read, interact with, and visual web pages. Use this skill for **deep research**, **form submission**, **dynamic content extraction**, or when simple text extraction is insufficient.

## Available Tools

1.  **`browser_navigate(url)`**:
    *   **Use when:** You need to start a session or go to a new page.
    *   **Returns:** Page title and status.

2.  **`browser_extract(selector?)`**:
    *   **Use when:** You need to read the content of the page.
    *   **Tip:** If `selector` is omitted, it extracts the whole `<body>` text. Use specific selectors (e.g., `main`, `article`, `.content`) for cleaner data.

3.  **`browser_click(selector)`**:
    *   **Use when:** You need to click a button, link, or tab to reveal more information (e.g., "Load More", "Next Page").
    *   **Tip:** Always `browser_extract` first to find the correct CSS selector for the element you want to click.

4.  **`browser_screenshot(filename?)`**:
    *   **Use when:** You need to "see" the page layout or debug why an element isn't found.
    *   **Tip:** Useful for verifying complex UI states.

## Workflow Patterns

### Pattern 1: Deep Research (Read & Click)
1.  **Navigate:** `browser_navigate(url="https://docs.anthropic.com")`
2.  **Read:** `browser_extract(selector="main")`
3.  **Reason:** "I need to see the section on 'Capabilities'. I see a link with text 'Capabilities' but need the selector."
4.  **Inspect (Optional):** If you can't guess the selector, use `browser_extract` on a parent element or try to infer it. (Note: A true 'inspector' tool isn't available, so rely on standard semantic tags like `a[href*='capabilities']`).
5.  **Interact:** `browser_click(selector="a[href='/en/docs/capabilities']")`
6.  **Read New Page:** `browser_extract()`

### Pattern 2: Visual Verification
1.  **Navigate:** `browser_navigate(url="https://example.com/dashboard")`
2.  **Snapshot:** `browser_screenshot(filename="dashboard_state.png")`
3.  **Report:** "I have captured the current state of the dashboard."

## Best Practices

*   **Be Polite:** Do not spam requests. Wait for pages to load.
*   **Selectors:** Use robust CSS selectors (ids, unique classes). Avoid brittle paths like `div > div > div:nth-child(3)`.
*   **Errors:** If a selector isn't found, try extracting the whole body to see what *is* on the page. It might be a login screen or a captcha.
*   **State:** The browser session is persistent. You don't need to re-login or re-navigate for every step if you are in a sequence.

## Limitations
*   Complex drag-and-drop or hover interactions are not fully supported yet.
*   The browser is headless; visual layout might differ slightly from a real screen.
