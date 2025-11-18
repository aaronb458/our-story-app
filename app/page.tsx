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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 p-4 relative overflow-hidden">
        {/* Animated floating hearts and orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-rose-300 rounded-full opacity-30 blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-300 rounded-full opacity-30 blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/3 w-44 h-44 bg-pink-300 rounded-full opacity-30 blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-fuchsia-300 rounded-full opacity-25 blur-3xl animate-float"></div>

          {/* Floating hearts */}
          <div className="absolute top-20 right-1/3 text-rose-300 opacity-20 animate-float text-6xl">💕</div>
          <div className="absolute bottom-40 left-1/4 text-pink-300 opacity-20 animate-float-delayed text-5xl">💖</div>
          <div className="absolute top-1/3 right-20 text-purple-300 opacity-15 animate-float-slow text-7xl">💗</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border-2 border-rose-200 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500 rounded-2xl mb-4 shadow-xl animate-pulse-slow">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
              Our Story
            </h1>
            <p className="text-gray-600 text-base font-medium">Daily questions, deeper connection 💕</p>
          </div>

          {!loginUser ? (
            <div className="space-y-3">
              <button
                onClick={() => setLoginUser('hubby')}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                💙 I'm Hubby
              </button>
              <button
                onClick={() => setLoginUser('wifey')}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-600 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                💕 I'm Wifey
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
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 p-4 relative overflow-hidden">
      {/* Animated floating hearts and orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-rose-300 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-300 rounded-full opacity-20 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/3 w-44 h-44 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float-slow"></div>

        {/* Floating hearts */}
        <div className="absolute top-32 right-1/4 text-rose-300 opacity-15 animate-float text-5xl">💕</div>
        <div className="absolute bottom-1/3 left-20 text-pink-300 opacity-15 animate-float-delayed text-4xl">💖</div>
      </div>

      <div className="max-w-2xl mx-auto py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm">
              Welcome, {user === 'hubby' ? '💙 Hubby' : '💕 Wifey'}!
            </h1>
            <p className="text-gray-700 text-base mt-2 font-medium">Let's grow closer together ✨</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 underline font-medium transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-6 border-2 border-rose-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 text-white text-sm font-bold rounded-full mb-3 shadow-lg">
                ✨ Question of the Day
              </span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Today's Question</h2>
            </div>
            <span className="text-base text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">{new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
          <p className="text-xl text-gray-800 leading-relaxed font-medium">{question}</p>
        </div>

        {!submitted ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-rose-200">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-5">Your Answer</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Take your time... share what's on your heart ✨💭"
              className="w-full px-5 py-4 rounded-2xl border-2 border-rose-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all resize-none text-lg"
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-3 mb-5">
              <span className={`text-sm font-medium ${answer.length > 1800 ? 'text-orange-600' : 'text-gray-600'}`}>
                {answer.length} / 2000 characters
              </span>
            </div>
            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
              className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600' : 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-600'} text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-lg`}
            >
              ✓ Submit Answer
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-6 border-2 border-green-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Answer Submitted!</h3>
                </div>
                <button
                  onClick={handleEditAnswer}
                  className="text-sm text-blue-600 hover:text-blue-700 underline font-bold transition"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-700 mb-5 text-base font-medium">Your partner will see your answer at 9pm tonight 🌙✨</p>
              <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-rose-100 shadow-inner">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{answer}</p>
              </div>
            </div>

            {/* Partner Answer Button */}
            <button
              onClick={() => setShowPartnerModal(true)}
              className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-600' : 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600'} text-white font-bold py-6 px-6 rounded-2xl shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-xl`}
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
