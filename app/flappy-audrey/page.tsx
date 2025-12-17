"use client"

import { useEffect, useRef, useState } from "react"
import { ProtectedPage } from "@/components/protected-page"

export default function FlappyAudreyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const birdImageRef = useRef<HTMLImageElement | null>(null)
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const gameStateRef = useRef({
    bird: { y: 250, velocity: 0 },
    pipes: [] as { x: number; topHeight: number; scored: boolean }[],
    score: 0,
    frame: 0,
  })

  useEffect(() => {
    const savedHighScore = localStorage.getItem("flappyAudreyHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    const birdImage = new Image()
    birdImage.src = "/audrey-bird.png"
    birdImage.onload = () => {
      birdImageRef.current = birdImage
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const GRAVITY = 0.05
    const JUMP_STRENGTH = -2.5
    const PIPE_WIDTH = 80
    const PIPE_HITBOX_WIDTH = 60 // Hitbox is narrower than visual pipe
    const PIPE_HITBOX_OFFSET = (PIPE_WIDTH - PIPE_HITBOX_WIDTH) / 2 // Center the hitbox
    const PIPE_GAP = 250
    const PIPE_SPEED = 1.5
    const BIRD_SIZE = 125 // Increased bird size from 50 to 125 (2.5x bigger)
    const BIRD_HITBOX_SIZE = 87 // Hitbox is smaller than visual size for fairer gameplay
    const PIPE_SPAWN_INTERVAL = 300

    let animationFrameId: number

    const resetGame = () => {
      gameStateRef.current = {
        bird: { y: canvas.height / 2, velocity: 0 },
        pipes: [],
        score: 0,
        frame: 0,
      }
      setScore(0)
      gameOverRef.current = false
    }

    const jump = () => {
      if (!gameStartedRef.current) {
        gameStartedRef.current = true
        resetGame()
        gameStateRef.current.bird.velocity = JUMP_STRENGTH
      } else if (!gameOverRef.current) {
        gameStateRef.current.bird.velocity = JUMP_STRENGTH
      } else {
        if (gameStateRef.current.score > highScore) {
          setHighScore(gameStateRef.current.score)
          localStorage.setItem("flappyAudreyHighScore", gameStateRef.current.score.toString())
        }
        gameStartedRef.current = true
        resetGame()
        gameStateRef.current.bird.velocity = JUMP_STRENGTH
      }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => {
      jump()
    }

    window.addEventListener("keydown", handleKeyPress)
    canvas.addEventListener("click", handleClick)

    const drawBackground = () => {
      if (!ctx || !canvas) return

      // Sky
      ctx.fillStyle = "#87CEEB"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Clouds
      ctx.fillStyle = "#FFFFFF"
      // Cloud 1
      ctx.beginPath()
      ctx.ellipse(80, 100, 60, 30, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(100, 85, 40, 25, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(110, 105, 50, 25, 0, 0, Math.PI * 2)
      ctx.fill()

      // Cloud 2
      ctx.beginPath()
      ctx.ellipse(280, 150, 70, 35, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(310, 135, 45, 30, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(320, 160, 55, 30, 0, 0, Math.PI * 2)
      ctx.fill()

      // Hills
      ctx.fillStyle = "#228B22"
      ctx.beginPath()
      ctx.ellipse(100, canvas.height - 25, 40, 25, 0, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(300, canvas.height - 30, 50, 30, 0, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.stroke()

      // Bushes
      ctx.fillStyle = "#00FF00"
      ctx.beginPath()
      ctx.ellipse(200, canvas.height - 25, 20, 15, 0, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(215, canvas.height - 27, 15, 12, 0, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.stroke()

      // Ground
      ctx.fillStyle = "#8B4513"
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10)
    }

    const gameLoop = () => {
      if (!ctx || !canvas) return

      const state = gameStateRef.current

      drawBackground()

      if (!gameStartedRef.current) {
        if (birdImageRef.current) {
          ctx.drawImage(birdImageRef.current, 100 - BIRD_SIZE / 2, canvas.height / 2, BIRD_SIZE, BIRD_SIZE)
        }

        ctx.fillStyle = "#000"
        ctx.font = "bold 32px serif"
        ctx.textAlign = "center"
        ctx.fillText("FlappyAudrey", canvas.width / 2, canvas.height / 2 - 80)
        ctx.font = "20px sans-serif"
        ctx.fillText("Click or Press Space to Start", canvas.width / 2, canvas.height / 2 + 80)
        animationFrameId = requestAnimationFrame(gameLoop)
        return
      }

      if (gameOverRef.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3
        ctx.fillStyle = "#FF4444"
        ctx.font = "bold 60px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", canvas.width / 2, 100)
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(50, 200, 300, 150)
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 3
        ctx.strokeRect(50, 200, 300, 150)

        ctx.fillStyle = "#333"
        ctx.font = "32px sans-serif"
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 250)
        ctx.font = "28px sans-serif"
        ctx.fillStyle = "#666"
        ctx.fillText(`Best: ${highScore}`, canvas.width / 2, 310)

        const gradient = ctx.createLinearGradient(100, 400, 100, 450)
        gradient.addColorStop(0, "#2d7a2d")
        gradient.addColorStop(1, "#1e5a1e")
        ctx.fillStyle = gradient
        ctx.fillRect(100, 400, 200, 50)

        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 3
        ctx.strokeRect(100, 400, 200, 50)

        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 3
        ctx.shadowOffsetY = 2
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 24px sans-serif"
        ctx.fillText("PLAY AGAIN", canvas.width / 2, 430)
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        animationFrameId = requestAnimationFrame(gameLoop)
        return
      }

      state.bird.velocity += GRAVITY
      state.bird.y += state.bird.velocity

      if (state.bird.y + BIRD_SIZE > canvas.height) {
        gameOverRef.current = true
        if (state.score > highScore) {
          setHighScore(state.score)
          localStorage.setItem("flappyAudreyHighScore", state.score.toString())
        }
      }

      state.frame++
      if (state.frame % PIPE_SPAWN_INTERVAL === 0) {
        const topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50
        state.pipes.push({ x: canvas.width, topHeight, scored: false })
      }

      for (let i = state.pipes.length - 1; i >= 0; i--) {
        const pipe = state.pipes[i]
        pipe.x -= PIPE_SPEED

        ctx.fillStyle = "#90EE90"
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
        ctx.strokeStyle = "#228B22"
        ctx.lineWidth = 3
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)

        ctx.fillStyle = "#32CD32"
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20)
        ctx.strokeStyle = "#228B22"
        ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20)

        const bottomY = pipe.topHeight + PIPE_GAP
        const bottomHeight = canvas.height - bottomY

        ctx.fillStyle = "#32CD32"
        ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20)
        ctx.strokeStyle = "#228B22"
        ctx.strokeRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20)

        ctx.fillStyle = "#90EE90"
        ctx.fillRect(pipe.x, bottomY + 20, PIPE_WIDTH, bottomHeight - 20)
        ctx.strokeStyle = "#228B22"
        ctx.strokeRect(pipe.x, bottomY + 20, PIPE_WIDTH, bottomHeight - 20)

        const birdX = 100
        const hitboxOffset = (BIRD_SIZE - BIRD_HITBOX_SIZE) / 2
        const birdRect = {
          x: birdX + hitboxOffset,
          y: state.bird.y + hitboxOffset,
          width: BIRD_HITBOX_SIZE,
          height: BIRD_HITBOX_SIZE,
        }
        const topPipeRect = { x: pipe.x + PIPE_HITBOX_OFFSET, y: 0, width: PIPE_HITBOX_WIDTH, height: pipe.topHeight }
        const bottomPipeRect = {
          x: pipe.x + PIPE_HITBOX_OFFSET,
          y: bottomY,
          width: PIPE_HITBOX_WIDTH,
          height: bottomHeight,
        }

        if (
          (birdRect.x + birdRect.width > topPipeRect.x &&
            birdRect.x < topPipeRect.x + topPipeRect.width &&
            birdRect.y < topPipeRect.height) ||
          (birdRect.x + birdRect.width > bottomPipeRect.x &&
            birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
            birdRect.y + birdRect.height > bottomPipeRect.y)
        ) {
          gameOverRef.current = true
          if (state.score > highScore) {
            setHighScore(state.score)
            localStorage.setItem("flappyAudreyHighScore", state.score.toString())
          }
        }

        if (pipe.x + PIPE_WIDTH < birdX && !pipe.scored) {
          state.score++
          setScore(state.score)
          pipe.scored = true
        }

        if (pipe.x + PIPE_WIDTH < 0) {
          state.pipes.splice(i, 1)
        }
      }

      if (birdImageRef.current) {
        ctx.drawImage(birdImageRef.current, 100 - BIRD_SIZE / 2, state.bird.y, BIRD_SIZE, BIRD_SIZE)
      }

      ctx.fillStyle = "#000"
      ctx.font = "bold 24px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${state.score}  High: ${highScore}`, 10, 30)

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("keydown", handleKeyPress)
      canvas.removeEventListener("click", handleClick)
    }
  }, [highScore])

  return (
    <ProtectedPage title="Flappy Audrey">
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">FlappyAudrey</h1>
        <p className="text-gray-600">A fun game for wedding guests!</p>
      </div>

      <div className="bg-white rounded-lg shadow-2xl p-4">
        <canvas ref={canvasRef} width={400} height={600} className="border-4 border-gray-300 rounded cursor-pointer" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-700 font-medium">
          High Score: <span className="text-primary font-bold">{highScore}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">Click or press Space to jump</p>
      </div>
    </div>
    </ProtectedPage>
  )
}
