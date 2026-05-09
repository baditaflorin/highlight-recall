# Phase 3 Output Audit

| Output pathway              | Status before | Evidence                                                                                                        | User impact                                             | Phase 3 decision                                        |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| JSON export                 | yellow        | Exports documents/highlights with timestamp, but no import path and no provenance fields beyond schema version. | Useful as a download, not a real backup.                | Make canonical state file and round-trip it.            |
| JSON import/restore         | red           | No UI or parser for exported JSON.                                                                              | Users cannot restore or move devices.                   | Add import path and validation.                         |
| Copy highlight to clipboard | gray          | No copy control.                                                                                                | Review/search output is harder to use in notes.         | Add copy on current review and search results.          |
| Copy full export            | gray          | No copy output.                                                                                                 | Small libraries cannot be moved without file download.  | Add copy state JSON.                                    |
| Shareable URL               | gray          | Not built.                                                                                                      | Large local library cannot safely fit in URL.           | Out of scope for state; document limit.                 |
| Print-friendly review       | gray          | Browser print works poorly with full app chrome.                                                                | Users cannot make a paper review list.                  | Add minimal print CSS for existing view, no new screen. |
| CSV export                  | gray          | Not claimed.                                                                                                    | Useful later but not required for a reading review app. | Out of scope.                                           |
| API/curl-ready output       | gray          | Static app has no API.                                                                                          | Not relevant to Mode A.                                 | Out of scope; JSON schema is automation-ready.          |
| Downloadable state file     | yellow        | Existing JSON is close but incomplete for future compatibility.                                                 | Backup exists but trust is low.                         | Upgrade export contract and docs.                       |

Before counts: green 0, yellow 2, red 1, gray 6.

## After Implementation

| Output pathway              | Status after | Evidence                                                                                  |
| --------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| JSON export                 | green        | Canonical state export includes schema version, app version, commit, timestamp, activity. |
| JSON import/restore         | green        | File picker accepts `.json`; incompatible files fail before persistence.                  |
| Copy highlight to clipboard | green        | Review card and search results expose copy controls with visible status.                  |
| Copy full export            | green        | Copy state serializes the same canonical JSON as download.                                |
| Shareable URL               | gray         | Out of scope; no shipped claim.                                                           |
| Print-friendly review       | green        | Print CSS strips chrome and keeps panels readable.                                        |
| CSV export                  | gray         | Out of scope; no shipped claim.                                                           |
| API/curl-ready output       | gray         | Mode A has no API; state JSON is the automation-ready artifact.                           |
| Downloadable state file     | green        | State file round-trips through unit and smoke tests.                                      |

After counts: green 6, yellow 0, red 0, gray 3 documented out of scope.
