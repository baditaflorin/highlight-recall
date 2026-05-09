import { expect, test } from '@playwright/test'

const backupState = {
  schemaVersion: 2,
  app: {
    name: 'highlight-recall',
    version: '0.2.0',
    commit: 'test',
  },
  exportedAt: '2026-05-09T10:00:00.000Z',
  documents: [
    {
      id: 'doc_restore',
      title: 'Restored Notes',
      fileName: 'restored-notes.txt',
      kind: 'text',
      importedAt: '2026-05-09T10:00:00.000Z',
      highlightCount: 1,
      checksum: 'restore',
    },
  ],
  highlights: [
    {
      id: 'hl_restore',
      documentId: 'doc_restore',
      text: 'Restored highlights prove that backup files can move a local reading library between browsers without asking for an account.',
      tags: ['restore'],
      createdAt: '2026-05-09T10:00:00.000Z',
      updatedAt: '2026-05-09T10:00:00.000Z',
      review: {
        dueAt: '2026-05-09T10:00:00.000Z',
        intervalDays: 0,
        ease: 2.5,
        repetitions: 0,
        lapses: 0,
      },
    },
  ],
  activity: [],
}

test('restores state, imports clipboard text, reviews, searches, and clears', async ({ page }) => {
  await page.goto('/highlight-recall/')

  await expect(page.getByRole('heading', { name: 'Highlight Recall' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Star on GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/highlight-recall',
  )
  await expect(page.getByText(/Version \d+\.\d+\.\d+/)).toBeVisible()
  await expect(page.getByText(/Commit [a-z0-9]+/i)).toBeVisible()

  await page.locator('#file-import').setInputFiles({
    name: 'highlight-recall-state.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backupState)),
  })
  await expect(page.getByText(/Restored 1 documents, 1 highlights/)).toBeVisible()

  await page.getByPlaceholder(/Search highlights/).fill('between browsers')
  await expect(page.getByText(/without asking for an account/)).toBeVisible()

  page.once('dialog', (dialog) => void dialog.accept())
  await page.getByRole('button', { name: /Clear local library/ }).click()
  await expect(page.getByText(/Local library cleared/)).toBeVisible()

  await page.evaluate(() =>
    navigator.clipboard.writeText(
      'A useful reading system should return attention to the right idea at the right moment, because insight without recall quickly becomes archive dust.',
    ),
  )
  await page.getByRole('button', { name: /Import clipboard/ }).click()

  await expect(page.getByText(/1 due highlight/)).toBeVisible()
  await page.getByRole('button', { name: /Copy card/ }).click()
  await expect(page.getByRole('button', { name: /Copied/ })).toBeVisible()
  await page.getByRole('button', { name: 'Good' }).click()
  await expect(page.getByText(/All caught up/)).toBeVisible()

  await page.getByPlaceholder(/Search highlights/).fill('attention')
  await expect(
    page.getByLabel(/Find the line you almost/).getByText(/right idea at the right moment/),
  ).toBeVisible()

  await page.getByLabel('Confirm before clearing the local library').uncheck()
  await page.reload()
  await expect(page.getByLabel('Confirm before clearing the local library')).not.toBeChecked()
})
