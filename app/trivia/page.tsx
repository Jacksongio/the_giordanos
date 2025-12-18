"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, XCircle, Trophy, Camera, Share2, Medal } from "lucide-react"
import { ProtectedPage } from "@/components/protected-page"
import html2canvas from "html2canvas"
import { toast } from "sonner"

interface Question {
  question: string
  correctAnswer: string
  options: string[]
}

const triviaQuestions: Question[] = [
  {
    question: "What are the names of Jackson and Audrey's fish?",
    correctAnswer: "Romulus and Remus",
    options: ["Bonnie and Clyde", "Romulus and Remus", "Salt and Pepper", "Romeo and Juliet"],
  },
  {
    question: "Where was Jackson and Audrey's first date?",
    correctAnswer: "Hahn Horticulture Garden",
    options: ["Central Park", "Botanical Gardens of Virginia", "Hahn Horticulture Garden", "Smithsonian National Zoo"],
  },
  {
    question: "What is Audrey's nickname for her car?",
    correctAnswer: "Gretta the Jetta",
    options: ["Betty the Beetle", "Carla the Corolla", "Gretta the Jetta", "Stella the Sentra"],
  },
  {
    question: "What is Jackson's favorite sports team?",
    correctAnswer: "New York Giants",
    options: ["Dallas Cowboys", "New York Giants", "Philadelphia Eagles", "Washington Commanders"],
  },
  {
    question: "What college did Jackson and Audrey attend together?",
    correctAnswer: "Virginia Tech",
    options: [
      "James Madison University",
      "University of Virginia",
      "Virginia Commonwealth University",
      "Virginia Tech",
    ],
  },
  {
    question: "What is Jackson and Audrey's go-to fast food?",
    correctAnswer: "Panda Express",
    options: ["Chick-fil-A", "Five Guys", "Panda Express", "Panera Bread"],
  },
  {
    question: "What is Jackson and Audrey's favorite game to play?",
    correctAnswer: "Beerio Kart",
    options: ["Among Us", "Beerio Kart", "Fortnite", "Minecraft"],
  },
  {
    question: "Where did Jackson and Audrey first move in together?",
    correctAnswer: "Reston",
    options: ["Alexandria", "Arlington", "Fairfax", "Reston"],
  },
  {
    question: "What were Jackson and Audrey's first Halloween costumes together?",
    correctAnswer: "Julius Caesar and Cleopatra",
    options: ["Bonnie and Clyde", "Julius Caesar and Cleopatra", "Mario and Princess Peach", "Romeo and Juliet"],
  },
  {
    question: "When did Jackson and Audrey meet?",
    correctAnswer: "2023",
    options: ["2021", "2022", "2023", "2024"],
  },
]

export default function TriviaPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showScoreDialog, setShowScoreDialog] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const existingScore = useQuery(api.trivia.getUserTriviaScore)
  const saveScore = useMutation(api.trivia.saveTriviaScore)
  const leaderboard = useQuery(api.trivia.getLeaderboard)
  const currentUser = useQuery(api.users.getCurrentUser)
  
  // Check if user has completed the trivia (has a score object)
  const hasCompleted = existingScore !== undefined && existingScore !== null

  useEffect(() => {
    if (existingScore) {
      setFinalScore(existingScore.score)
      setGameComplete(true)
    }
  }, [existingScore])

  const scoreCardRef = useRef<HTMLDivElement>(null)
  const scoreCardRefExisting = useRef<HTMLDivElement>(null)

  const shareToFacebook = async (score: number, total: number, percentage: number) => {
    const shareText = `I took the Giordanos Trivia and got a score of: ${score} out of ${total} (${percentage}%)! 🎉`
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)
    
    // Capture the score card as an image (try both refs)
    const cardElement = scoreCardRef.current || scoreCardRefExisting.current
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement, {
          backgroundColor: null,
          scale: 2,
          logging: false,
        })
        
        // Get data URL for image download
        const dataUrl = canvas.toDataURL('image/png')
        
        canvas.toBlob(async (blob) => {
          if (!blob) return
          
          // Try Web Share API first (opens native share sheet on mobile, can select Facebook app)
          if (navigator.share && navigator.canShare) {
            const file = new File([blob], 'trivia-score.png', { type: 'image/png' })
            const shareData: any = {
              title: 'The Giordanos Trivia',
              text: shareText,
              files: [file],
            }
            
            if (navigator.canShare(shareData)) {
              try {
                await navigator.share(shareData)
                return
              } catch (err: any) {
                // User cancelled or error, fall through to Facebook app/URL share
                if (err.name === 'AbortError') {
                  return // User cancelled, don't proceed
                }
                console.log('Web Share failed, trying Facebook app')
              }
            }
          }
          
          // For mobile: Try to open Facebook app directly
          if (isMobile) {
            try {
              // Copy text to clipboard first
              await navigator.clipboard.writeText(shareText)
              
              // Try to open Facebook app
              let facebookAppUrl: string | null = null
              
              if (isIOS) {
                // iOS: Try fb:// URL scheme
                facebookAppUrl = `fb://share?text=${encodeURIComponent(shareText)}`
              } else if (isAndroid) {
                // Android: Use intent URL to open Facebook app
                const intentUrl = `intent://share?text=${encodeURIComponent(shareText)}#Intent;package=com.facebook.katana;scheme=fb;end`
                facebookAppUrl = intentUrl
              }
              
              if (facebookAppUrl) {
                // Try to open Facebook app
                window.location.href = facebookAppUrl
                
                // Fallback to mobile Facebook web after a delay if app doesn't open
                setTimeout(() => {
                  const shareUrl = encodeURIComponent(window.location.href)
                  const mobileFacebookUrl = `https://m.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(shareText)}`
                  window.location.href = mobileFacebookUrl
                }, 500)
                return
              }
            } catch (err) {
              console.error('Error opening Facebook app:', err)
            }
          }
          
          // For desktop: Copy text to clipboard, download image, then open Facebook
          try {
            // Copy text to clipboard
            await navigator.clipboard.writeText(shareText)
          } catch (err) {
            console.error('Failed to copy to clipboard:', err)
            toast.error('Failed to copy message', {
              description: 'Please copy the message manually.',
              duration: 3000,
            })
            return
          }
          
          // Download the image
          const link = document.createElement('a')
          link.download = 'trivia-score.png'
          link.href = dataUrl
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Show toast with instructions immediately (before opening Facebook)
          toast.success('Ready to share!', {
            description: 'Message copied to clipboard and image downloaded. Paste the message (Ctrl+V) and attach the image to your Facebook post.',
            duration: 6000,
          })
          
          // Open Facebook share dialog after a delay to ensure toast is visible
          setTimeout(() => {
            const shareUrl = encodeURIComponent(window.location.href)
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
            window.open(facebookShareUrl, '_blank', 'width=600,height=400')
          }, 800)
        }, 'image/png')
      } catch (error) {
        console.error('Error capturing screenshot:', error)
        // Fallback: copy text and open Facebook
        try {
          await navigator.clipboard.writeText(shareText)
          toast.success('Message copied!', {
            description: 'Paste it into your Facebook post.',
            duration: 3000,
          })
        } catch (err) {
          console.error('Failed to copy to clipboard:', err)
          toast.error('Failed to copy message', {
            description: 'Please copy the message manually.',
            duration: 3000,
          })
        }
        const shareUrl = encodeURIComponent(window.location.href)
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        window.open(facebookShareUrl, '_blank', 'width=600,height=400')
      }
    } else {
      // Fallback if score card ref not available
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success('Message copied!', {
          description: 'Paste it into your Facebook post.',
          duration: 3000,
        })
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
        toast.error('Failed to copy message', {
          description: 'Please copy the message manually.',
          duration: 3000,
        })
      }
      const shareUrl = encodeURIComponent(window.location.href)
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
      window.open(facebookShareUrl, '_blank', 'width=600,height=400')
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || hasCompleted) return // Prevent changing answer or retaking

    setSelectedAnswer(answer)
    const isCorrect = answer === triviaQuestions[currentQuestion].correctAnswer
    const newAnswers = [...answers, isCorrect]
    setAnswers(newAnswers)

    const newScore = isCorrect ? score + 1 : score
    setScore(newScore)

    setShowResult(true)

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestion < triviaQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // Game complete - save score
        const percentage = Math.round((newScore / triviaQuestions.length) * 100)
        saveScore({
          score: newScore,
          total_questions: triviaQuestions.length,
          percentage: percentage,
        }).then(() => {
          setFinalScore(newScore)
          setGameComplete(true)
          setShowScoreDialog(true)
        })
      }
    }, 2000)
  }

  const progress = ((currentQuestion + 1) / triviaQuestions.length) * 100

  // Show completed state if user already took the quiz
  if (existingScore && gameComplete) {
    const percentage = Math.round((existingScore.score / existingScore.total_questions) * 100)
    return (
      <ProtectedPage title="Trivia">
        <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-serif font-bold mb-4">You've Already Completed the Trivia!</h1>
              <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
              <p className="text-xl mb-6">
                Your score: {existingScore.score} out of {existingScore.total_questions} questions correct!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setShowScoreDialog(true)} 
                  size="lg" 
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  View Score Card
                </Button>
                <Button 
                  onClick={() => shareToFacebook(existingScore.score, existingScore.total_questions, percentage)}
                  size="lg"
                  className="gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white"
                >
                  <Share2 className="w-4 h-4" />
                  Share on Facebook
                </Button>
              </div>
            </Card>

            {/* Leaderboard */}
            {leaderboard && leaderboard.length > 0 && (
              <Card className="p-8 mt-6">
                <div className="flex items-center gap-2 mb-6">
                  <Medal className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-bold">Leaderboard</h2>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = currentUser && entry.user_id === currentUser._id
                    return (
                      <div
                        key={entry._id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                          isCurrentUser
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-yellow-950"
                              : index === 1
                              ? "bg-gray-400 text-gray-950"
                              : index === 2
                              ? "bg-amber-600 text-amber-950"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-semibold ${isCurrentUser ? "text-primary" : ""}`}>
                              {entry.userName}
                              {isCurrentUser && " (You)"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{entry.percentage}%</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.score}/{entry.total_questions}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
          <DialogContent className="max-w-md" showCloseButton={true}>
            <div 
              ref={scoreCardRefExisting}
              id="trivia-score-card" 
              className="bg-gradient-to-br from-primary/10 via-background to-muted/20 p-8 rounded-lg border-2 border-primary/20 text-center space-y-6"
            >
              <Trophy className="w-20 h-20 mx-auto text-primary" />
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">The Giordanos Trivia</h2>
                <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
                <p className="text-xl text-muted-foreground">
                  I took the Giordanos Trivia and got a score of: {existingScore.score} out of {existingScore.total_questions}!
                </p>
              </div>
            </div>
            <Button 
              onClick={() => shareToFacebook(existingScore.score, existingScore.total_questions, percentage)}
              size="lg"
              className="gap-2 w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <Share2 className="w-4 h-4" />
              Share on Facebook
            </Button>
          </DialogContent>
        </Dialog>
      </ProtectedPage>
    )
  }

  // Show completion screen after finishing
  if (gameComplete && finalScore !== null) {
    const percentage = Math.round((finalScore / triviaQuestions.length) * 100)
    return (
      <ProtectedPage title="Trivia">
        <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-serif font-bold mb-4">Quiz Complete!</h1>
              <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
              <p className="text-xl mb-6">
                You got {finalScore} out of {triviaQuestions.length} questions correct!
              </p>

              <div className="space-y-2 mb-6 text-left">
                {triviaQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    {answers[idx] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm">{q.question}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setShowScoreDialog(true)} 
                  size="lg" 
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  View Score Card
                </Button>
                <Button 
                  onClick={() => shareToFacebook(finalScore, triviaQuestions.length, percentage)}
                  size="lg"
                  className="gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white"
                >
                  <Share2 className="w-4 h-4" />
                  Share on Facebook
                </Button>
              </div>
            </Card>

            {/* Leaderboard */}
            {leaderboard && leaderboard.length > 0 && (
              <Card className="p-8 mt-6">
                <div className="flex items-center gap-2 mb-6">
                  <Medal className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-bold">Leaderboard</h2>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = currentUser && entry.user_id === currentUser._id
                    return (
                      <div
                        key={entry._id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                          isCurrentUser
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-yellow-950"
                              : index === 1
                              ? "bg-gray-400 text-gray-950"
                              : index === 2
                              ? "bg-amber-600 text-amber-950"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-semibold ${isCurrentUser ? "text-primary" : ""}`}>
                              {entry.userName}
                              {isCurrentUser && " (You)"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{entry.percentage}%</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.score}/{entry.total_questions}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
          <DialogContent className="max-w-md" showCloseButton={true}>
            <div 
              ref={scoreCardRef}
              id="trivia-score-card" 
              className="bg-gradient-to-br from-primary/10 via-background to-muted/20 p-8 rounded-lg border-2 border-primary/20 text-center space-y-6"
            >
              <Trophy className="w-20 h-20 mx-auto text-primary" />
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">The Giordanos Trivia</h2>
                <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
                <p className="text-xl text-muted-foreground">
                  I took the Giordanos Trivia and got a score of: {finalScore} out of {triviaQuestions.length}!
                </p>
              </div>
            </div>
            <Button 
              onClick={() => shareToFacebook(finalScore, triviaQuestions.length, percentage)}
              size="lg"
              className="gap-2 w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <Share2 className="w-4 h-4" />
              Share on Facebook
            </Button>
          </DialogContent>
        </Dialog>
      </ProtectedPage>
    )
  }

  const question = triviaQuestions[currentQuestion]

  return (
    <ProtectedPage title="Trivia">
      <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {triviaQuestions.length}
              </span>
              <span className="text-sm font-semibold">Score: {score}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <h2 className="text-2xl font-serif font-bold mb-8 text-balance">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option
              const isCorrect = option === question.correctAnswer
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null || hasCompleted}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : showIncorrect
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary hover:bg-muted"
                  } ${selectedAnswer !== null || hasCompleted ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-center text-sm">
                {selectedAnswer === question.correctAnswer ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    ✓ Correct! Moving to next question...
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    ✗ Incorrect. The correct answer is: {question.correctAnswer}
                  </span>
                )}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
    </ProtectedPage>
  )
}
