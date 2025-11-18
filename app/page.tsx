'use client'

import { useState, useEffect } from 'react'

const QUESTIONS = [
  "What's something I do that makes you feel truly loved?",
  "If you could relive one memory with me, which would it be?",
  "What's a way I could support you better when you're overwhelmed?",
]

// Simple password check
const CREDENTIALS = {
  hubby: 'beadles14',
  wifey: 'beadles14'
}

export default function Home() {
  const [user, setUser] = useState<'hubby' | 'wifey' | null>(null)
  const [loginUser, setLoginUser] = useState<'hubby' | 'wifey' | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Get question of the day (cycles through questions)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const questionIndex = dayOfYear % QUESTIONS.length
  const question = QUESTIONS[questionIndex]
  const today = new Date().toISOString().split('T')[0]

  // Load saved answer and user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser') as 'hubby' | 'wifey' | null
    if (savedUser) {
      setUser(savedUser)
      const savedAnswer = localStorage.getItem(`answer_${savedUser}_${today}`)
      if (savedAnswer) {
        setAnswer(savedAnswer)
        setSubmitted(true)
      }
    }
  }, [today])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginUser) return

    if (CREDENTIALS[loginUser] === password) {
      localStorage.setItem('currentUser', loginUser)
      setUser(loginUser)
      setLoginError('')
      setPassword('')

      // Load this user's answer if they have one
      const savedAnswer = localStorage.getItem(`answer_${loginUser}_${today}`)
      if (savedAnswer) {
        setAnswer(savedAnswer)
        setSubmitted(true)
      } else {
        setAnswer('')
        setSubmitted(false)
      }
    } else {
      setLoginError('Incorrect password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setLoginUser(null)
    setAnswer('')
    setSubmitted(false)
    setPassword('')
    setLoginError('')
  }

  const handleSubmitAnswer = () => {
    if (answer.trim() && user) {
      localStorage.setItem(`answer_${user}_${today}`, answer)
      setSubmitted(true)
    }
  }

  const handleEditAnswer = () => {
    setSubmitted(false)
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Story</h1>

          {!loginUser ? (
            <div className="space-y-4">
              <button
                onClick={() => setLoginUser('hubby')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                I'm Hubby
              </button>
              <button
                onClick={() => setLoginUser('wifey')}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                I'm Wifey
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Welcome, {loginUser === 'hubby' ? 'Hubby' : 'Wifey'}!
                </h2>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-red-600 text-sm text-center">{loginError}</p>
              )}

              <div className="space-y-2">
                <button
                  type="submit"
                  className={`w-full ${loginUser === 'hubby' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600'} text-white font-semibold py-3 px-4 rounded-lg transition`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUser(null)
                    setPassword('')
                    setLoginError('')
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user === 'hubby' ? 'Hubby' : 'Wifey'}!
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Today's Question</h2>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
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
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2 mb-4">
              <span className={`text-sm ${answer.length > 1800 ? 'text-orange-600' : 'text-gray-500'}`}>
                {answer.length} / 2000 characters
              </span>
            </div>
            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
              className={`w-full ${user === 'hubby' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600'} text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-600">✓ Answer Submitted!</h3>
              <button
                onClick={handleEditAnswer}
                className="text-sm text-blue-500 hover:text-blue-600 underline"
              >
                Edit
              </button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">Your partner will see your answer at 9pm tonight.</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
