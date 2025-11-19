const https = require('https')

const supabaseUrl = 'brxddezkfrstmgthqwdp.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGRkZXprZnJzdG1ndGhxd2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQwOTgyMCwiZXhwIjoyMDc4OTg1ODIwfQ.n8cxOA9NAsElKAY-E-EtjzStSemnB86VgYAeCI-c1Es'

const sql = `
-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user" TEXT NOT NULL CHECK ("user" IN ('hubby', 'wifey')),
  date DATE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("user", date)
);

-- Create love_notes table
CREATE TABLE IF NOT EXISTS love_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user TEXT NOT NULL CHECK (from_user IN ('hubby', 'wifey')),
  to_user TEXT NOT NULL CHECK (to_user IN ('hubby', 'wifey')),
  date DATE NOT NULL,
  note TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Enable read access for all users') THEN
    CREATE POLICY "Enable read access for all users" ON submissions FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Enable insert for all users') THEN
    CREATE POLICY "Enable insert for all users" ON submissions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Enable update for all users') THEN
    CREATE POLICY "Enable update for all users" ON submissions FOR UPDATE USING (true);
  END IF;
END $$;

-- Create policies for love_notes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'love_notes' AND policyname = 'Enable read access for all users') THEN
    CREATE POLICY "Enable read access for all users" ON love_notes FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'love_notes' AND policyname = 'Enable insert for all users') THEN
    CREATE POLICY "Enable insert for all users" ON love_notes FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'love_notes' AND policyname = 'Enable update for all users') THEN
    CREATE POLICY "Enable update for all users" ON love_notes FOR UPDATE USING (true);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(date);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions("user");
CREATE INDEX IF NOT EXISTS idx_love_notes_to_user_date ON love_notes(to_user, date);
`

function executeSQL(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query })

    const options = {
      hostname: supabaseUrl,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Length': data.length
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body)
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function createTables() {
  console.log('🚀 Creating database tables via API...\n')

  // Split SQL into individual statements
  const statements = sql.split(';').filter(s => s.trim().length > 0)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim() + ';'
    try {
      console.log(`📝 Executing statement ${i + 1}/${statements.length}...`)
      await executeSQL(statement)
      console.log(`✅ Success`)
    } catch (error) {
      // Ignore errors for "already exists" - that's fine
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log(`⚠️  Already exists (ok)`)
      } else {
        console.log(`❌ Error: ${error.message}`)
      }
    }
  }

  console.log('\n✅ Database setup complete!\n')
  console.log('🔍 Verifying tables...')

  // Try to query the tables
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(`https://${supabaseUrl}`, serviceRoleKey)

  const { data, error } = await supabase.from('submissions').select('count').limit(1)

  if (error) {
    console.log('❌ Verification failed:', error.message)
  } else {
    console.log('✅ Tables verified and ready!')
    console.log('\n📊 Database is ready to receive data!')
    console.log('\n💡 Next steps:')
    console.log('1. Visit your app: https://our-story-app.vercel.app')
    console.log('2. Go to: https://our-story-app.vercel.app/migrate-localstorage.html')
    console.log('3. Scan and migrate your localStorage data')
  }
}

createTables().catch(console.error)
