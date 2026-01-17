import { StructuredTool } from '@langchain/core/tools'
import { z } from 'zod'

/**
 * Advanced Browser Skills for OpenWork Agent
 * Inspired by 'Browser-Use' and Anthropic's computer capability.
 */

// Shared state for the browser session
let browserInstance: any = null
let pageInstance: any = null

async function getPage() {
  if (pageInstance) return pageInstance

  try {
    const puppeteer = await import('puppeteer')
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }
    const pages = await browserInstance.pages()
    pageInstance = pages.length > 0 ? pages[0] : await browserInstance.newPage()
    return pageInstance
  } catch (e) {
    throw new Error("Puppeteer is not installed. Please run `npm install puppeteer`.")
  }
}

class BrowserNavigateTool extends StructuredTool {
  name = 'browser_navigate'
  description = 'Navigate to a specific URL in the browser.'
  schema = z.object({ url: z.string().url() })

  async _call({ url }: { url: string }) {
    const page = await getPage()
    console.log(`[Browser] Navigating to ${url}`)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    return `Navigated to ${url}. Page title: ${await page.title()}`
  }
}

class BrowserExtractTool extends StructuredTool {
  name = 'browser_extract'
  description = 'Extract text content from the current page or a specific selector.'
  schema = z.object({
    selector: z.string().optional().describe('CSS selector to extract. Defaults to body.')
  })

  async _call({ selector }: { selector?: string }) {
    const page = await getPage()
    const content = await page.evaluate((sel: string) => {
      const el = sel ? document.querySelector(sel) : document.body
      return el ? (el as HTMLElement).innerText : 'Element not found'
    }, selector || 'body')
    return content
  }
}

class BrowserScreenshotTool extends StructuredTool {
  name = 'browser_screenshot'
  description = 'Take a screenshot of the current page state. Returns the path to the file.'
  schema = z.object({
    filename: z.string().optional().describe('Filename for the screenshot')
  })

  async _call({ filename }: { filename?: string }) {
    const page = await getPage()
    const path = require('path').resolve(process.cwd(), filename || `screenshot-${Date.now()}.png`)
    await page.screenshot({ path })
    return `Screenshot saved to ${path}`
  }
}

class BrowserClickTool extends StructuredTool {
  name = 'browser_click'
  description = 'Click an element on the page identified by a CSS selector.'
  schema = z.object({ selector: z.string() })

  async _call({ selector }: { selector: string }) {
    const page = await getPage()
    try {
      await page.click(selector)
      return `Clicked element: ${selector}`
    } catch (e: any) {
      return `Failed to click ${selector}: ${e.message}`
    }
  }
}

export function createBrowserTools() {
  return [
    new BrowserNavigateTool(),
    new BrowserExtractTool(),
    new BrowserScreenshotTool(),
    new BrowserClickTool()
  ]
}
