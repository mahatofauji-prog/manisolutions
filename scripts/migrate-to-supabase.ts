import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gyxhbcowrhubfsoqjtuu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tcvoR4pkbdw0WFvHi6oMBg_UeVbFxgz';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface MigrationResult {
  collection: string;
  sourceCount: number;
  migratedCount: number;
  status: 'PASS' | 'FAIL' | 'SKIPPED' | 'WAITING_TABLE';
  error?: string;
}

async function runMigration() {
  console.log('=== STARTING FIRESTORE TO SUPABASE MIGRATION ===');
  console.log('Destination Supabase URL:', SUPABASE_URL);

  // 1. Verify Backup
  if (!fs.existsSync('./firestore-backup.json')) {
    console.error('ERROR: Backup file ./firestore-backup.json not found! Halting.');
    process.exit(1);
  }

  const backupPayload = JSON.parse(fs.readFileSync('./firestore-backup.json', 'utf8'));
  console.log('Backup verified. Exported at:', backupPayload.exportedAt);

  const results: MigrationResult[] = [];

  // Migration mapping definition
  const tableMapping: Record<string, string> = {
    settings: 'settings',
    digital_settings: 'digital_settings',
    digital_products: 'digital_products',
    digital_categories: 'digital_categories',
    digital_orders: 'digital_orders',
    digital_access: 'digital_access',
    coupons: 'coupons',
    portfolio_solutions: 'portfolio_solutions',
    business_ai_solutions: 'business_ai_solutions',
    ready_solutions: 'ready_solutions',
    ready_solution_requests: 'ready_solution_requests',
    custom_solution_orders: 'custom_solution_orders',
    website_categories: 'website_categories',
    website_templates: 'website_templates',
    template_orders: 'template_orders',
    enquiries: 'enquiries',
    work_applications: 'work_applications'
  };

  for (const [colName, tableName] of Object.entries(tableMapping)) {
    const docs = backupPayload.data[colName] || [];
    console.log(`\n--- Processing collection: '${colName}' -> Table: '${tableName}' (${docs.length} docs) ---`);

    if (docs.length === 0) {
      results.push({
        collection: colName,
        sourceCount: 0,
        migratedCount: 0,
        status: 'PASS'
      });
      continue;
    }

    let successCount = 0;
    let tableError = '';

    for (const docData of docs) {
      try {
        const { id, ...rest } = docData;
        const payload = { id, ...rest };

        const { error } = await supabase
          .from(tableName)
          .upsert(payload, { onConflict: 'id' });

        if (error) {
          tableError = error.message;
          console.warn(`Upsert notice for doc '${id}' in '${tableName}':`, error.message);
        } else {
          successCount++;
        }
      } catch (err: any) {
        tableError = err.message;
        console.warn(`Exception for doc in '${tableName}':`, err.message);
      }
    }

    results.push({
      collection: colName,
      sourceCount: docs.length,
      migratedCount: successCount,
      status: successCount === docs.length ? 'PASS' : (tableError.includes('schema cache') ? 'WAITING_TABLE' : 'FAIL'),
      error: tableError || undefined
    });
  }

  console.log('\n==================================================');
  console.log('MIGRATION VALIDATION REPORT');
  console.log('==================================================');
  console.table(results);

  // Write report to file
  fs.writeFileSync('./migration-report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    results
  }, null, 2));

  console.log('Report saved to ./migration-report.json');
}

runMigration().catch(console.error);
