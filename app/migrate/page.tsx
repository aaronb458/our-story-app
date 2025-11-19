'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const QUESTIONS = [
  "What's something I do that makes you feel truly loved?",
  "If you could relive one memory with me, which would it be?",
  "What's a way I could support you better when you're overwhelmed?",
  "What's your favorite thing about our relationship?",
  "What's a small thing I do that makes your day better?",
  "What's one of your favorite memories of us laughing together?",
  "What do you think our life will look like in 5 years?",
  "What's something new you'd like us to try together?",
  "What song reminds you of us and why?",
  "What's your favorite way I show you I care?",
  "What's something you're grateful for about us today?",
  "If we could go anywhere together right now, where would it be?",
  "What's one thing you love about how we communicate?",
  "What's a challenge we've overcome together that you're proud of?",
  "What's your favorite tradition we've created together?",
  "What makes you feel most connected to me?",
  "What's something about me that always makes you smile?",
  "What's a dream you have for our future?",
  "What's one way our relationship has helped you grow?",
  "What's your favorite way we spend quality time together?",
  "What's something I've done recently that meant a lot to you?",
  "What do you think is our biggest strength as a couple?",
  "What's a goal you'd like us to work on together?",
  "What's your favorite inside joke we share?",
  "What do you appreciate most about how I support your dreams?",
  "What's a moment when you felt especially close to me?",
  "What's something you'd like to learn or experience with me?",
  "What quality of mine do you admire most?",
  "What's your favorite thing about coming home to me?",
  "What makes you feel most appreciated in our relationship?",
  "What's a lesson our relationship has taught you?",
  "What's something simple that always reminds you of me?",
  "What's your favorite way we've celebrated something together?",
  "What's one thing you never want to change about us?",
  "What makes our relationship special to you?",
]

const WEEKLY_REFLECTION = "What made you smile this week when you thought of us?"

export default function MigratePage() {
  const [foundSubmissions, setFoundSubmissions] = useState<any[]>([])
  const [foundLoveNotes, setFoundLoveNotes] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : '📝'
    setLogs(prev => [...prev, `${emoji} ${message}`])
  }

  const getQuestionForDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    const dayOfWeek = date.getDay()
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)

    if (dayOfWeek === 0) {
      return WEEKLY_REFLECTION
    }
    return QUESTIONS[dayOfYear % QUESTIONS.length]
  }

  const scanLocalStorage = () => {
    setIsScanning(true)
    setLogs([])
    addLog('Starting localStorage scan...', 'info')

    const submissions: any[] = []
    const loveNotes: any[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key && key.startsWith('answer_')) {
        const parts = key.split('_')
        if (parts.length === 3) {
          const user = parts[1]
          const date = parts[2]
          const answer = localStorage.getItem(key)

          if (answer && (user === 'hubby' || user === 'wifey')) {
            const question = getQuestionForDate(date)
            submissions.push({ user, date, answer, question })
            addLog(`Found answer from ${user} on ${date}`, 'success')
          }
        }
      }

      if (key && key.startsWith('loveNote_') && !key.endsWith('_read')) {
        const parts = key.split('_')
        if (parts.length === 3) {
          const toUser = parts[1]
          const date = parts[2]
          const note = localStorage.getItem(key)

          if (note && (toUser === 'hubby' || toUser === 'wifey')) {
            const fromUser = toUser === 'hubby' ? 'wifey' : 'hubby'
            const isRead = localStorage.getItem(`${key}_read`) === 'true'
            loveNotes.push({ fromUser, toUser, date, note, read: isRead })
            addLog(`Found love note for ${toUser} on ${date}`, 'success')
          }
        }
      }
    }

    setFoundSubmissions(submissions)
    setFoundLoveNotes(loveNotes)
    setIsScanning(false)

    addLog(`\nScan complete! Found ${submissions.length} submissions and ${loveNotes.length} love notes.`, 'success')

    if (submissions.length > 0 || loveNotes.length > 0) {
      addLog('Click "Migrate to Database" to transfer your data.', 'info')
    } else {
      addLog('No data found in localStorage.', 'info')
    }
  }

  const migrateData = async () => {
    setIsMigrating(true)
    addLog('\nStarting migration...', 'info')

    let successCount = 0
    let errorCount = 0

    for (const submission of foundSubmissions) {
      try {
        const { error } = await supabase
          .from('submissions')
          .upsert({
            user: submission.user,
            date: submission.date,
            question: submission.question,
            answer: submission.answer
          }, {
            onConflict: 'user,date'
          })

        if (error) throw error

        addLog(`✓ Migrated ${submission.user}'s answer from ${submission.date}`, 'success')
        successCount++
      } catch (error: any) {
        addLog(`✗ Failed to migrate ${submission.user}'s answer from ${submission.date}: ${error.message}`, 'error')
        errorCount++
      }
    }

    for (const note of foundLoveNotes) {
      try {
        const { error } = await supabase
          .from('love_notes')
          .insert({
            from_user: note.fromUser,
            to_user: note.toUser,
            date: note.date,
            note: note.note,
            read: note.read
          })

        if (error && !error.message.includes('duplicate')) throw error

        addLog(`✓ Migrated love note from ${note.fromUser} to ${note.toUser} for ${note.date}`, 'success')
        successCount++
      } catch (error: any) {
        addLog(`✗ Failed to migrate love note: ${error.message}`, 'error')
        errorCount++
      }
    }

    setIsMigrating(false)
    addLog(`\n🎉 Migration complete! ${successCount} items successfully migrated, ${errorCount} errors.`, successCount > 0 ? 'success' : 'error')

    if (successCount > 0) {
      addLog('\n✨ Your data is now in the database! You can refresh the app to see it.', 'success')
      addLog('💡 TIP: You can now clear your localStorage if you want (it\'s backed up in the database).', 'info')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🚀 Migrate LocalStorage Data
          </h1>
          <p className="text-gray-600 mb-8">
            Transfer your existing answers and love notes to the database
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center">
              <div className="text-sm opacity-90">Submissions Found</div>
              <div className="text-4xl font-bold mt-2">{foundSubmissions.length}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-2xl text-center">
              <div className="text-sm opacity-90">Love Notes Found</div>
              <div className="text-4xl font-bold mt-2">{foundLoveNotes.length}</div>
            </div>
          </div>

          <button
            onClick={scanLocalStorage}
            disabled={isScanning}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition mb-4"
          >
            {isScanning ? '🔄 Scanning...' : '📊 Scan LocalStorage'}
          </button>

          <button
            onClick={migrateData}
            disabled={isMigrating || (foundSubmissions.length === 0 && foundLoveNotes.length === 0)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isMigrating ? '🔄 Migrating...' : '🔄 Migrate to Database'}
          </button>

          {logs.length > 0 && (
            <div className="mt-6 bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
