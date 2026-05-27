import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:5173'
const outputDir = path.resolve('artifacts', 'viewport-audit-1920x1080')

const routes = [
  { name: 'home', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'signup', path: '/signup' },
  { name: 'user-type', path: '/user-type' },
  { name: 'recommendations', path: '/recommendations' },
  { name: 'map', path: '/map' },
  { name: 'shelters', path: '/shelters' },
  { name: 'shelter-detail', path: '/shelters/safeway-shelter-001' },
  { name: 'feedback', path: '/feedback/log-safeway-001' },
  { name: 'admin-dashboard', path: '/admin' },
  { name: 'admin-climate-risk-map', path: '/admin/climate-risk-map' },
  { name: 'admin-shelter-gaps', path: '/admin/shelter-gaps' },
  { name: 'admin-temporary-shelters', path: '/admin/temporary-shelters' },
  { name: 'admin-recommendation-logs', path: '/admin/recommendation-logs' },
  { name: 'admin-feedback', path: '/admin/feedback' },
  { name: 'admin-data-status', path: '/admin/data-status' },
  { name: 'admin-reports', path: '/admin/reports' },
  { name: 'admin-settings', path: '/admin/settings' },
]

mkdirSync(outputDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
})

const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
})

const results = []

for (const route of routes) {
  const url = `${baseUrl}${route.path}`

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
  await page.waitForTimeout(900)

  const screenshotPath = path.join(outputDir, `${route.name}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: false })

  const metrics = await page.evaluate(() => {
    const body = document.body
    const doc = document.documentElement
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollWidth = Math.max(body.scrollWidth, doc.scrollWidth)
    const scrollHeight = Math.max(body.scrollHeight, doc.scrollHeight)
    const visibleElements = [...document.body.querySelectorAll('*')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        const area =
          Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0)) *
          Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0))

        return {
          tag: element.tagName.toLowerCase(),
          className:
            typeof element.className === 'string'
              ? element.className
              : String(element.className.baseVal ?? ''),
          role: element.getAttribute('role'),
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80),
          rect: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          area: Math.round(area),
          backgroundColor: styles.backgroundColor,
          display: styles.display,
          visibility: styles.visibility,
        }
      })
      .filter(
        (item) =>
          item.area > 25_000 &&
          item.display !== 'none' &&
          item.visibility !== 'hidden' &&
          item.rect.width > 80 &&
          item.rect.height > 40,
      )
      .sort((left, right) => right.area - left.area)
      .slice(0, 12)

    const bottomCandidates = [...document.body.querySelectorAll('main, section, article, aside, form')]
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 120 && rect.height > 60 && rect.top < viewportHeight)

    const maxVisibleBottom = bottomCandidates.length
      ? Math.max(...bottomCandidates.map((rect) => Math.min(rect.bottom, viewportHeight)))
      : 0

    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      viewportWidth,
      viewportHeight,
      scrollWidth,
      scrollHeight,
      needsVerticalScroll: scrollHeight > viewportHeight + 2,
      verticalOverflowPx: Math.max(0, scrollHeight - viewportHeight),
      hasHorizontalOverflow: scrollWidth > viewportWidth + 2,
      horizontalOverflowPx: Math.max(0, scrollWidth - viewportWidth),
      maxVisibleBottom: Math.round(maxVisibleBottom),
      bottomGapPx: Math.max(0, Math.round(viewportHeight - maxVisibleBottom)),
      largeVisibleElements: visibleElements,
    }
  })

  results.push({
    ...route,
    url,
    screenshot: screenshotPath,
    ...metrics,
  })
}

await browser.close()

writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(results, null, 2))

const markdown = [
  '# 1920x1080 Viewport Audit',
  '',
  `Base URL: ${baseUrl}`,
  '',
  '| Route | Scroll H | Scroll V | Bottom gap | H1 | Screenshot |',
  '| --- | ---: | ---: | ---: | --- | --- |',
  ...results.map(
    (result) =>
      `| ${result.path} | ${result.horizontalOverflowPx}px | ${result.verticalOverflowPx}px | ${result.bottomGapPx}px | ${result.h1.replaceAll('|', '\\|')} | ${path.basename(result.screenshot)} |`,
  ),
  '',
]

writeFileSync(path.join(outputDir, 'report.md'), markdown.join('\n'))

console.table(
  results.map((result) => ({
    path: result.path,
    hOverflow: result.horizontalOverflowPx,
    vOverflow: result.verticalOverflowPx,
    bottomGap: result.bottomGapPx,
    h1: result.h1,
  })),
)
