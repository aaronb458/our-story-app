'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SetupDatabase() {
  const [status, setStatus] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : '📝'
    setStatus(prev => [...prev, `${emoji} ${message}`])
  }

  const createTables = async () => {
    setIsRunning(true)
    setStatus([])

    addStatus('Starting database setup...')

    // Test connection first
    addStatus('Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('_test_')
      .select('*')
      .limit(1)

    if (testError && !testError.message.includes('does not exist')) {
      addStatus(`Connection error: ${testError.message}`, 'error')
      setIsRunning(false)
      return
    }

    addStatus('Connection successful!', 'success')

    // Since we can't execute raw SQL via the API, we'll need to manually insert the schema
    // But first, let's check if tables already exist by trying to query them

    addStatus('Checking if submissions table exists...')
    const { error: subCheck } = await supabase
      .from('submissions')
      .select('count')
      .limit(1)

    if (!subCheck) {
      addStatus('Submissions table already exists!', 'success')
    } else if (subCheck.message.includes('does not exist')) {
      addStatus('Submissions table does not exist - needs manual creation', 'error')
      addStatus('', 'info')
      addStatus('⚠️ MANUAL SETUP REQUIRED:', 'error')
      addStatus('1. Open: https://supabase.com/dashboard/project/brxddezkfrstmgthqwdp/sql/new', 'info')
      addStatus('2. Paste the SQL from supabase-setup.sql', 'info')
      addStatus('3. Click RUN', 'info')
      addStatus('', 'info')
      addStatus('The SQL is also shown at the bottom of this page ↓', 'info')
    }

    addStatus('Checking if love_notes table exists...')
    const { error: notesCheck } = await supabase
      .from('love_notes')
      .select('count')
      .limit(1)

    if (!notesCheck) {
      addStatus('Love notes table already exists!', 'success')
    } else if (notesCheck.message.includes('does not exist')) {
      addStatus('Love notes table does not exist - needs manual creation', 'error')
    }

    setIsRunning(false)

    if (!subCheck && !notesCheck) {
      addStatus('', 'info')
      addStatus('🎉 ALL TABLES EXIST! Database is ready!', 'success')
      addStatus('', 'info')
      addStatus('Next step: Visit /migrate-localstorage.html to migrate your data', 'success')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Database Setup
          </h1>
          <p className="text-gray-600 mb-8">
            Check and create database tables for Our Story App
          </p>

          <button
            onClick={createTables}
            disabled={isRunning}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition mb-6"
          >
            {isRunning ? '🔄 Checking...' : '🚀 Check Database'}
          </button>

          {status.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm space-y-2 max-h-96 overflow-y-auto">
              {status.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          )}

          <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Manual Setup Instructions</h2>
            <p className="text-gray-700 mb-4">
              If tables don't exist, you need to run this SQL manually:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
              <li>Click this link: <a href="https://supabase.com/dashboard/project/brxddezkfrstmgthqwdp/sql/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open Supabase SQL Editor</a></li>
              <li>Copy the SQL below</li>
              <li>Paste it into the SQL editor</li>
              <li>Click "RUN" button</li>
              <li>Come back here and click "Check Database" again</li>
            </ol>

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold text-gray-800 hover:text-purple-600">
                📝 Click to show SQL (then copy it)
              </summary>
              <pre className="mt-4 p-4 bg-gray-800 text-green-400 rounded-lg overflow-x-auto text-xs">
{`-- Create submissions table
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
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON submissions
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Enable update for all users" ON submissions
  FOR UPDATE USING (true);

-- Create policies for love_notes
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON love_notes
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON love_notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Enable update for all users" ON love_notes
  FOR UPDATE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(date);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions("user");
CREATE INDEX IF NOT EXISTS idx_love_notes_to_user_date ON love_notes(to_user, date);`}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
