'use client'

import { useState, useEffect } from 'react'

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
  const [showHistory, setShowHistory] = useState(false)
  const [showLoveNote, setShowLoveNote] = useState(false)
  const [loveNote, setLoveNote] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Get question of the day (cycles through questions)
  const today = new Date().toISOString().split('T')[0]
  const dayOfWeek = new Date().getDay() // 0 = Sunday
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)

  // Use weekly reflection on Sundays, otherwise cycle through questions
  const isWeeklyReflection = dayOfWeek === 0
  const questionIndex = dayOfYear % QUESTIONS.length
  const question = isWeeklyReflection ? WEEKLY_REFLECTION : QUESTIONS[questionIndex]

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

  // Check for love note after user is set
  useEffect(() => {
    if (user) {
      const note = localStorage.getItem(`loveNote_${user}_${today}`)
      if (note && !localStorage.getItem(`loveNote_${user}_${today}_read`)) {
        // Show love note after a brief delay
        setTimeout(() => {
          setShowLoveNote(true)
        }, 1000)
      }
    }
  }, [user, today])

  // Calculate streak
  const calculateStreak = () => {
    if (!user) return 0
    let streak = 0
    let checkDate = new Date()

    while (streak < 365) { // Max 1 year check
      const dateStr = checkDate.toISOString().split('T')[0]
      const hubbyAnswer = localStorage.getItem(`answer_hubby_${dateStr}`)
      const wifeyAnswer = localStorage.getItem(`answer_wifey_${dateStr}`)

      // Both must have answered for the day to count
      if (hubbyAnswer && wifeyAnswer) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  // Get history of past Q&A pairs
  const getHistory = () => {
    const history: Array<{ date: string; question: string; hubbyAnswer: string | null; wifeyAnswer: string | null }> = []
    let checkDate = new Date()

    // Include today if both answered
    for (let i = 0; i < 31; i++) { // Look back 31 days (including today)
      const dateStr = checkDate.toISOString().split('T')[0]
      const hubbyAnswer = localStorage.getItem(`answer_hubby_${dateStr}`)
      const wifeyAnswer = localStorage.getItem(`answer_wifey_${dateStr}`)

      // Show in history if at least one person answered
      if (hubbyAnswer || wifeyAnswer) {
        const pastDayOfYear = Math.floor((checkDate.getTime() - new Date(checkDate.getFullYear(), 0, 0).getTime()) / 86400000)
        const pastDayOfWeek = checkDate.getDay()
        const pastQuestion = pastDayOfWeek === 0 ? WEEKLY_REFLECTION : QUESTIONS[pastDayOfYear % QUESTIONS.length]

        history.push({
          date: dateStr,
          question: pastQuestion,
          hubbyAnswer,
          wifeyAnswer
        })
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    return history
  }

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

  const handleSendLoveNote = () => {
    if (loveNote.trim() && user) {
      const partnerUser = user === 'hubby' ? 'wifey' : 'hubby'
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      localStorage.setItem(`loveNote_${partnerUser}_${tomorrowStr}`, loveNote)
      setLoveNote('')
      alert('Love note sent! Your partner will see it tomorrow 💕')
    }
  }

  const handleCloseLoveNote = () => {
    if (user) {
      localStorage.setItem(`loveNote_${user}_${today}_read`, 'true')
      setShowLoveNote(false)
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-50 to-amber-50 p-4 relative overflow-hidden">
        {/* Animated floating beach elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-sky-300 rounded-full opacity-30 blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-300 rounded-full opacity-30 blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/3 w-44 h-44 bg-blue-300 rounded-full opacity-30 blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-amber-300 rounded-full opacity-25 blur-3xl animate-float"></div>

          {/* Floating beach emojis */}
          <div className="absolute top-20 right-1/3 text-cyan-400 opacity-20 animate-float text-6xl">🌊</div>
          <div className="absolute bottom-40 left-1/4 text-amber-400 opacity-20 animate-float-delayed text-5xl">🏖️</div>
          <div className="absolute top-1/3 right-20 text-sky-400 opacity-15 animate-float-slow text-7xl">☀️</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border-2 border-cyan-200 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500 rounded-2xl mb-4 shadow-xl animate-pulse-slow">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
              Our Story
            </h1>
            <p className="text-gray-600 text-base font-medium">Daily questions, deeper connection 🌊</p>
          </div>

          {!loginUser ? (
            <div className="space-y-3">
              <button
                onClick={() => setLoginUser('hubby')}
                className="w-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-600 hover:to-cyan-500 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                🌊 I'm Hubby
              </button>
              <button
                onClick={() => setLoginUser('wifey')}
                className="w-full bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                🏖️ I'm Wifey
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Welcome, {loginUser === 'hubby' ? 'Hubby 🌊' : 'Wifey 🏖️'}!
                </h2>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition"
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
                  className={`w-full ${loginUser === 'hubby' ? 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-600 hover:to-cyan-500' : 'bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400'} text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg`}
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-amber-50 p-4 relative overflow-hidden">
      {/* Animated floating beach elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-sky-300 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-cyan-300 rounded-full opacity-20 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/3 w-44 h-44 bg-blue-300 rounded-full opacity-20 blur-3xl animate-float-slow"></div>

        {/* Floating beach emojis */}
        <div className="absolute top-32 right-1/4 text-cyan-400 opacity-15 animate-float text-5xl">🌊</div>
        <div className="absolute bottom-1/3 left-20 text-amber-400 opacity-15 animate-float-delayed text-4xl">☀️</div>
      </div>

      <div className="max-w-2xl mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              Welcome, {user === 'hubby' ? '🌊 Hubby' : '🏖️ Wifey'}!
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

        {/* Streak Counter & Navigation */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border-2 border-cyan-200 hover:border-cyan-300 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-1">📖</div>
            <div className="text-xs font-bold text-gray-700">Our Journey</div>
          </button>

          <div className="bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-300 p-4 rounded-2xl shadow-lg border-2 border-amber-300">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-xs font-bold text-white">{calculateStreak()} Day Streak!</div>
          </div>

          <button
            onClick={() => {
              const note = prompt('Write a love note for your partner to see tomorrow:')
              if (note) {
                const partnerUser = user === 'hubby' ? 'wifey' : 'hubby'
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                const tomorrowStr = tomorrow.toISOString().split('T')[0]
                localStorage.setItem(`loveNote_${partnerUser}_${tomorrowStr}`, note)
                alert('Love note sent! Your partner will see it tomorrow 💕')
              }
            }}
            className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border-2 border-cyan-200 hover:border-cyan-300 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-1">💌</div>
            <div className="text-xs font-bold text-gray-700">Send Note</div>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-6 border-2 border-cyan-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-block px-4 py-2 ${isWeeklyReflection ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400' : 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400'} text-white text-sm font-bold rounded-full mb-3 shadow-lg`}>
                {isWeeklyReflection ? '🌟 Weekly Reflection' : '✨ Question of the Day'}
              </span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {isWeeklyReflection ? 'Weekly Reflection' : "Today's Question"}
              </h2>
            </div>
            <span className="text-base text-gray-600 font-medium bg-amber-100 px-3 py-1 rounded-full">{new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
          <p className="text-xl text-gray-800 leading-relaxed font-medium">{question}</p>
        </div>

        {!submitted ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-cyan-200">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-5">Your Answer</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Take your time... share what's on your heart ✨💭"
              className="w-full px-5 py-4 rounded-2xl border-2 border-cyan-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all resize-none text-lg"
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
              className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-600 hover:to-cyan-500' : 'bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400'} text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-lg`}
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
              <div className="bg-gradient-to-br from-sky-50 via-cyan-50 to-amber-50 rounded-2xl p-6 border-2 border-cyan-100 shadow-inner">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{answer}</p>
              </div>
            </div>

            {/* Partner Answer Button */}
            <button
              onClick={() => setShowPartnerModal(true)}
              className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-600 hover:to-cyan-500'} text-white font-bold py-6 px-6 rounded-2xl shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-xl`}
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
                    <div className="inline-block p-4 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl mb-4">
                      <svg className="w-8 h-8 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {partnerName}'s Answer
                    </h3>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 via-cyan-50 to-amber-50 rounded-2xl p-6 mb-6 border border-cyan-100">
                    <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                      {partnerAnswer}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPartnerModal(false)}
                    className={`w-full ${user === 'hubby' ? 'bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-600 hover:to-cyan-500'} text-white font-semibold py-3 px-4 rounded-2xl transition shadow-lg`}
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
                    <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl p-6 mb-4 border border-cyan-100">
                      <p className="text-gray-700 text-lg mb-2 font-medium">Time until unlock:</p>
                      <p className="text-5xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
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

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 my-8 animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">📖 Our Journey</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            {getHistory().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-7xl mb-4">🌱</div>
                <p className="text-xl text-gray-600">Your journey is just beginning!</p>
                <p className="text-gray-500 mt-2">Past conversations will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getHistory().map((entry, index) => (
                  <div key={entry.date} className="bg-gradient-to-br from-sky-50 via-cyan-50 to-amber-50 rounded-2xl p-6 border-2 border-cyan-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}</h3>
                      <span className="text-sm text-gray-600">{getHistory().length - index} days ago</span>
                    </div>
                    <p className="text-sky-700 font-semibold mb-4 text-lg">"{entry.question}"</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/80 rounded-xl p-4 border border-sky-200">
                        <div className="text-sm font-bold text-sky-600 mb-2">🌊 Hubby's Answer:</div>
                        <p className="text-gray-700 whitespace-pre-wrap">{entry.hubbyAnswer || <span className="text-gray-400 italic">Not answered yet</span>}</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
                        <div className="text-sm font-bold text-amber-600 mb-2">🏖️ Wifey's Answer:</div>
                        <p className="text-gray-700 whitespace-pre-wrap">{entry.wifeyAnswer || <span className="text-gray-400 italic">Not answered yet</span>}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Love Note Modal */}
      {showLoveNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={handleCloseLoveNote}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">💌</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Love Note from {partnerName}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl p-6 mb-6 border-2 border-pink-200">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {localStorage.getItem(`loveNote_${user}_${today}`)}
              </p>
            </div>
            <button
              onClick={handleCloseLoveNote}
              className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 hover:from-pink-600 hover:via-rose-600 hover:to-red-500 text-white font-bold py-3 px-4 rounded-2xl transition shadow-lg"
            >
              Close 💕
            </button>
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
