-- Allow anyone (including anonymous users) to read charts that are marked as shared.
-- This powers the public /share/:token pages.

CREATE POLICY "read_shared_charts" ON charts FOR SELECT
  TO anon, authenticated
  USING (is_shared = true);

-- Keep shared_link unique and non-empty when a chart is shared.
CREATE UNIQUE INDEX IF NOT EXISTS idx_charts_shared_link ON charts (shared_link)
  WHERE is_shared = true;
