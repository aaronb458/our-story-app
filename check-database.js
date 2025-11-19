const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://brxddezkfrstmgthqwdp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGRkZXprZnJzdG1ndGhxd2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDk4MjAsImV4cCI6MjA3ODk4NTgyMH0.xbW33jaoEhkFLb71FUU-lfNYp0mxhDZzo4kAdCAV590'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking database...\n')

  // Check submissions
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('*')
    .order('date', { ascending: false })

  if (subError) {
    console.error('❌ Error fetching submissions:', subError.message)
  } else {
    console.log(`📝 Total submissions in database: ${submissions.length}`)

    if (submissions.length > 0) {
      console.log('\n📅 Recent submissions:')
      submissions.slice(0, 5).forEach(sub => {
        console.log(`  - ${sub.date} (${sub.user}): ${sub.answer.substring(0, 50)}...`)
      })
    } else {
      console.log('  ⚠️  No submissions found in database yet')
    }
  }

  // Check love notes
  const { data: notes, error: notesError } = await supabase
    .from('love_notes')
    .select('*')
    .order('date', { ascending: false })

  if (notesError) {
    console.error('\n❌ Error fetching love notes:', notesError.message)
  } else {
    console.log(`\n💌 Total love notes in database: ${notes.length}`)

    if (notes.length > 0) {
      console.log('\n📅 Recent love notes:')
      notes.slice(0, 3).forEach(note => {
        console.log(`  - ${note.date} (from ${note.from_user} to ${note.to_user})`)
      })
    } else {
      console.log('  ⚠️  No love notes found in database yet')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n💡 To migrate your localStorage data:')
  console.log('1. Open your deployed app in your browser')
  console.log('2. Visit: https://your-app-url.vercel.app/migrate-localstorage.html')
  console.log('3. Click "Scan LocalStorage" then "Migrate to Database"')
  console.log('\n' + '='.repeat(60))
}

checkDatabase().catch(console.error)
