const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://brxddezkfrstmgthqwdp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGRkZXprZnJzdG1ndGhxd2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQwOTgyMCwiZXhwIjoyMDc4OTg1ODIwfQ.n8cxOA9NAsElKAY-E-EtjzStSemnB86VgYAeCI-c1Es'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Setting up database tables...\n')

  try {
    // Create submissions table
    console.log('📝 Creating submissions table...')
    const { error: submissionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "user" TEXT NOT NULL CHECK ("user" IN ('hubby', 'wifey')),
          date DATE NOT NULL,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE("user", date)
        );

        CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(date);
        CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions("user");
      `
    })

    if (submissionsError) {
      console.log('⚠️  Submissions table might already exist or RPC not available')
      console.log('   Trying direct approach...')
    } else {
      console.log('✅ Submissions table created')
    }

    // Create love_notes table
    console.log('💌 Creating love_notes table...')
    const { error: notesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS love_notes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          from_user TEXT NOT NULL CHECK (from_user IN ('hubby', 'wifey')),
          to_user TEXT NOT NULL CHECK (to_user IN ('hubby', 'wifey')),
          date DATE NOT NULL,
          note TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_love_notes_to_user_date ON love_notes(to_user, date);
      `
    })

    if (notesError) {
      console.log('⚠️  Love notes table might already exist or RPC not available')
    } else {
      console.log('✅ Love notes table created')
    }

    console.log('\n✅ Database setup complete!')
    console.log('\n📊 Checking tables...')

    // Verify tables exist
    const { data: submissions, error: checkError } = await supabase
      .from('submissions')
      .select('count')
      .limit(1)

    if (checkError) {
      console.log('\n❌ Tables not created. You need to run the SQL manually:')
      console.log('1. Go to: https://supabase.com/dashboard/project/brxddezkfrstmgthqwdp/editor')
      console.log('2. Click SQL Editor')
      console.log('3. Copy and paste the contents of supabase-setup.sql')
      console.log('4. Click Run')
    } else {
      console.log('✅ Tables verified!')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📝 Manual setup required:')
    console.log('1. Go to: https://supabase.com/dashboard/project/brxddezkfrstmgthqwdp/editor')
    console.log('2. Click SQL Editor')
    console.log('3. Copy and paste the contents of supabase-setup.sql')
    console.log('4. Click Run')
  }
}

setupDatabase()
