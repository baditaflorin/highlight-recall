import { expect, test } from '@playwright/test'

test('imports a local text highlight and reviews it', async ({ page }) => {
  await page.goto('/highlight-recall/')

  await expect(page.getByRole('heading', { name: 'Highlight Recall' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Star on GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/highlight-recall',
  )
  await expect(page.getByText(/Version 0.1.0/)).toBeVisible()

  await page
    .getByPlaceholder('Paste a highlight worth revisiting')
    .fill(
      'A useful reading system should return attention to the right idea at the right moment, because insight without recall quickly becomes archive dust.',
    )
  await page.getByPlaceholder('Optional note').fill('Manual smoke highlight')
  await page.getByRole('button', { name: /Add highlight/ }).click()

  await expect(page.getByText(/1 due highlight/)).toBeVisible()
  await page.getByRole('button', { name: 'Good' }).click()
  await expect(page.getByText(/All caught up/)).toBeVisible()

  await page.getByPlaceholder(/Search highlights/).fill('attention')
  await expect(
    page.getByLabel(/Find the line you almost/).getByText(/right idea at the right moment/),
  ).toBeVisible()
})
