'use client'

import { useState, useEffect } from 'react'

const QUESTIONS = [
  "What's something I do that makes you feel truly loved?",
  "If you could relive one memory with me, which would it be?",
  "What's a way I could support you better when you're overwhelmed?",
]

export default function Home() {
  const [user, setUser] = useState<'hubby' | 'wifey' | null>(null)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Get question of the day (cycles through questions)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const questionIndex = dayOfYear % QUESTIONS.length
  const question = QUESTIONS[questionIndex]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Story</h1>
          <div className="space-y-4">
            <button
              onClick={() => setUser('hubby')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              I'm Hubby
            </button>
            <button
              onClick={() => setUser('wifey')}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              I'm Wifey
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user === 'hubby' ? 'Hubby' : 'Wifey'}!
          </h1>
          <button
            onClick={() => setUser(null)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Switch User
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Question</h2>
          <p className="text-lg text-gray-700">{question}</p>
        </div>

        {!submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Answer</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share what's on your heart..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={6}
            />
            <button
              onClick={() => {
                if (answer.trim()) {
                  setSubmitted(true)
                  // In real app, save to database here
                }
              }}
              disabled={!answer.trim()}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-green-600 mb-4">✓ Answer Submitted!</h3>
            <p className="text-gray-700 mb-4">Your partner will see your answer at 9pm tonight.</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-blue-500 hover:text-blue-600 underline"
            >
              Edit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
