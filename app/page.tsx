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
  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Get question of the day (cycles through questions)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const questionIndex = dayOfYear % QUESTIONS.length
  const question = QUESTIONS[questionIndex]
  const today = new Date().toISOString().split('T')[0]

  // Update time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

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

  // Check if it's after 9pm
  const isAfter9pm = () => {
    const now = new Date()
    return now.getHours() >= 21
  }

  // Get time until 9pm
  const getTimeUntil9pm = () => {
    const now = new Date()
    const today9pm = new Date()
    today9pm.setHours(21, 0, 0, 0)

    if (now >= today9pm) {
      return null // Already past 9pm
    }

    const diff = today9pm.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { hours, minutes }
  }

  // Get partner's answer
  const getPartnerAnswer = () => {
    if (!user) return null
    const partnerUser = user === 'hubby' ? 'wifey' : 'hubby'
    return localStorage.getItem(`answer_${partnerUser}_${today}`)
  }

  const partnerName = user === 'hubby' ? 'Wifey' : 'Hubby'
  const partnerAnswer = getPartnerAnswer()
  const canView9pm = isAfter9pm()
  const timeUntil = getTimeUntil9pm()

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full border border-rose-100 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Our Story
            </h1>
            <p className="text-gray-600 text-sm">Daily questions, deeper connection</p>
          </div>

          {!loginUser ? (
            <div className="space-y-3">
              <button
                onClick={() => setLoginUser('hubby')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                I'm Hubby
              </button>
              <button
                onClick={() => setLoginUser('wifey')}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                I'm Wifey
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Welcome, {loginUser === 'hubby' ? 'Hubby' : 'Wifey'}! 💙
                </h2>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="submit"
                  className={`w-full ${loginUser === 'hubby' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg`}
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
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition text-sm"
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-rose-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Welcome, {user === 'hubby' ? 'Hubby' : 'Wifey'}!
            </h1>
            <p className="text-gray-600 text-sm mt-1">Let's grow closer together 💕</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 border border-rose-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-xs font-semibold rounded-full mb-2">
                Question of the Day
              </span>
              <h2 className="text-2xl font-bold text-gray-800">Today's Question</h2>
            </div>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">{question}</p>
        </div>

        {!submitted ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-rose-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Answer</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Take your time... share what's on your heart ✨"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition resize-none"
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
              className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white font-semibold py-4 px-6 rounded-2xl transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
            >
              Submit Answer ✓
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 border border-green-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-600">Answer Submitted!</h3>
                </div>
                <button
                  onClick={handleEditAnswer}
                  className="text-sm text-blue-500 hover:text-blue-600 underline font-medium"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-600 mb-4 text-sm">Your partner will see your answer at 9pm tonight 🌙</p>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{answer}</p>
              </div>
            </div>

            {/* Partner Answer Button */}
            <button
              onClick={() => setShowPartnerModal(true)}
              className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white font-bold py-5 px-6 rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2 text-lg`}
            >
              {canView9pm && partnerAnswer ? (
                <>💕 View {partnerName}'s Answer</>
              ) : canView9pm && !partnerAnswer ? (
                <>⏳ {partnerName} hasn't answered yet</>
              ) : (
                <>🔒 {partnerName}'s Answer (Unlocks at 9pm)</>
              )}
            </button>
          </>
        )}
      </div>

      {/* Partner Answer Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={() => setShowPartnerModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            {canView9pm ? (
              // After 9pm - show answer or waiting message
              partnerAnswer ? (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl mb-4">
                      <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {partnerName}'s Answer
                    </h3>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-2xl p-6 mb-6 border border-rose-100">
                    <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                      {partnerAnswer}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPartnerModal(false)}
                    className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white font-semibold py-3 px-4 rounded-2xl transition shadow-lg`}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4">⏳</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Waiting for {partnerName}
                    </h3>
                    <p className="text-gray-600">
                      {partnerName} hasn't answered today's question yet. Check back later!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPartnerModal(false)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-2xl transition shadow-lg"
                  >
                    Close
                  </button>
                </>
              )
            ) : (
              // Before 9pm - show countdown
              <>
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Locked Until 9pm
                  </h3>
                  {timeUntil && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 mb-4 border border-orange-100">
                      <p className="text-gray-700 text-lg mb-2 font-medium">Time until unlock:</p>
                      <p className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {timeUntil.hours}h {timeUntil.minutes}m
                      </p>
                    </div>
                  )}
                  <p className="text-gray-600 leading-relaxed">
                    You'll be able to see {partnerName}'s answer at 9pm tonight. This gives both of you time to think and answer honestly! 💭
                  </p>
                </div>
                <button
                  onClick={() => setShowPartnerModal(false)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-2xl transition shadow-lg"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
