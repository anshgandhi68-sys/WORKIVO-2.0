const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

if (process.loadEnvFile) {
  try {
    process.loadEnvFile(path.join(__dirname, '..', '.env.local'));
  } catch (e) {
    // Ignore if not found
  }
}

async function runMigration() {
  const directUrl = process.env.DIRECT_URL;
  const databaseUrl = process.env.DATABASE_URL;
  const cliPassword = process.argv[2];
  const envPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD || cliPassword;

  let client;

  if (directUrl && !directUrl.includes('[YOUR-PASSWORD]')) {
    console.log('Using DIRECT_URL pooler connection...');
    client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  } else if (databaseUrl && !databaseUrl.includes('[YOUR-PASSWORD]')) {
    console.log('Using DATABASE_URL connection...');
    client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  } else {
    if (!envPassword) {
      console.error('Error: Database password is required.');
      console.error('Usage: npm run db:migrate <your-password>');
      console.error('Or set SUPABASE_DB_PASSWORD=<your-password> in .env.local');
      console.error('Or paste DIRECT_URL with your password in .env.local');
      process.exit(1);
    }

    const host = process.env.SUPABASE_DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com';
    const port = parseInt(process.env.SUPABASE_DB_PORT || '5432', 10);
    const database = process.env.SUPABASE_DB_NAME || 'postgres';
    const user = process.env.SUPABASE_DB_USER || 'postgres.vxiyopjjyohcapmtvlef';

    client = new Client({
      host,
      port,
      database,
      user,
      password: envPassword,
      ssl: { rejectUnauthorized: false },
    });
  }

  try {
    console.log('Connecting to Supabase PostgreSQL at db.vxiyopjjyohcapmtvlef.supabase.co:5432...');
    await client.connect();
    console.log('Connected successfully!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema migration from supabase/schema.sql...');
    await client.query(sql);
    console.log('Migration completed successfully!');

    // Verify services
    const resServices = await client.query('SELECT count(*) FROM public.services;');
    console.log(`Verified services count in database: ${resServices.rows[0].count}`);

    // Verify pro_applications table exists
    const resPros = await client.query("SELECT to_regclass('public.pro_applications');");
    console.log(`Verified pro_applications table: ${resPros.rows[0].to_regclass ? 'EXISTS' : 'NOT FOUND'}`);

  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
