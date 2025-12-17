"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react"

interface Question {
  question: string
  correctAnswer: string
  options: string[]
}

const triviaQuestions: Question[] = [
  {
    question: "What are the names of Jackson and Audrey's fish?",
    correctAnswer: "Romulus and Remus",
    options: ["Romulus and Remus", "Romeo and Juliet", "Salt and Pepper", "Bonnie and Clyde"],
  },
  {
    question: "Where was Jackson and Audrey's first date?",
    correctAnswer: "Hahn Horticulture Garden",
    options: ["Hahn Horticulture Garden", "Smithsonian National Zoo", "Central Park", "Botanical Gardens of Virginia"],
  },
  {
    question: "What is Audrey's nickname for her car?",
    correctAnswer: "Gretta the Jetta",
    options: ["Gretta the Jetta", "Betty the Beetle", "Carla the Corolla", "Stella the Sentra"],
  },
  {
    question: "What is Jackson's favorite sports team?",
    correctAnswer: "New York Giants",
    options: ["New York Giants", "Dallas Cowboys", "Philadelphia Eagles", "Washington Commanders"],
  },
  {
    question: "What college did Jackson and Audrey attend together?",
    correctAnswer: "Virginia Tech",
    options: [
      "Virginia Tech",
      "University of Virginia",
      "James Madison University",
      "Virginia Commonwealth University",
    ],
  },
  {
    question: "What is Jackson and Audrey's go-to fast food?",
    correctAnswer: "Chipotle",
    options: ["Chipotle", "Chick-fil-A", "Five Guys", "Panera Bread"],
  },
  {
    question: "What is Jackson and Audrey's favorite game to play?",
    correctAnswer: "Sea of Thieves",
    options: ["Sea of Thieves", "Minecraft", "Fortnite", "Among Us"],
  },
  {
    question: "Where did Jackson and Audrey first move in together?",
    correctAnswer: "Reston",
    options: ["Reston", "Arlington", "Alexandria", "Fairfax"],
  },
  {
    question: "What were Jackson and Audrey's first Halloween costumes together?",
    correctAnswer: "Julius Caesar and Cleopatra",
    options: ["Julius Caesar and Cleopatra", "Romeo and Juliet", "Bonnie and Clyde", "Mario and Princess Peach"],
  },
  {
    question: "When did Jackson and Audrey meet?",
    correctAnswer: "2023",
    options: ["2023", "2022", "2021", "2024"],
  },
]

export default function TriviaPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return // Prevent changing answer

    setSelectedAnswer(answer)
    const isCorrect = answer === triviaQuestions[currentQuestion].correctAnswer
    setAnswers([...answers, isCorrect])

    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestion < triviaQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameComplete(false)
    setAnswers([])
  }

  const progress = ((currentQuestion + 1) / triviaQuestions.length) * 100

  if (gameComplete) {
    const percentage = Math.round((score / triviaQuestions.length) * 100)
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-serif font-bold mb-4">Quiz Complete!</h1>
            <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
            <p className="text-xl mb-6">
              You got {score} out of {triviaQuestions.length} questions correct!
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

            <Button onClick={resetGame} size="lg" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const question = triviaQuestions[currentQuestion]

  return (
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
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : showIncorrect
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary hover:bg-muted"
                  } ${selectedAnswer !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
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
  )
}
