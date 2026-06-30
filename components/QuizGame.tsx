"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const QUESTIONS = [
  {
    question: "What is the largest cryptocurrency by market cap?",
    options: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
    correct: 0
  },
  {
    question: "What does 'HODL' mean in crypto?",
    options: ["Hold On for Dear Life", "Hold On Don't Leave", "Help Our Digital Lives", "High On Digital Luck"],
    correct: 0
  },
  {
    question: "What year was Bitcoin created?",
    options: ["2008", "2009", "2010", "2011"],
    correct: 1
  },
  {
    question: "Who created Bitcoin?",
    options: ["Vitalik Buterin", "Satoshi Nakamoto", "Elon Musk", "Charlie Lee"],
    correct: 1
  },
  {
    question: "What is a blockchain?",
    options: ["A type of cryptocurrency", "A digital wallet", "A distributed ledger", "A mining hardware"],
    correct: 2
  }
];

interface QuizGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function QuizGame({ onComplete, onBack }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  function handleAnswer(index: number) {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 20);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameOver(true);
        onComplete(score + (index === QUESTIONS[currentQuestion].correct ? 20 : 0));
      }
    }, 1500);
  }

  function restart() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
  }

  if (gameOver) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">📝 Quiz Complete!</h2>
        
        <div className="text-6xl mb-4">{score >= 80 ? "🎉" : score >= 40 ? "👍" : "😢"}</div>
        
        <p className="text-3xl font-bold text-white mb-2">{score}/100</p>
        <p className="text-zinc-500 mb-6">
          {score >= 80 ? "Excellent!" : score >= 60 ? "Good job!" : score >= 40 ? "Not bad!" : "Keep trying!"}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={restart} className="bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold">
            Play Again
          </button>
          <button onClick={onBack} className="bg-zinc-700 hover:bg-zinc-600 rounded-xl py-3 font-bold">
            Back
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-zinc-400 hover:text-white">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-purple-400">📝 Quiz</h2>
        <div className="text-zinc-400">
          {currentQuestion + 1}/{QUESTIONS.length}
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
          <motion.div
            className="bg-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <h3 className="text-xl font-bold text-white mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
              whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
              className={`w-full p-4 rounded-xl text-left font-medium transition ${
                selectedAnswer === null
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : index === question.correct
                  ? "bg-green-600"
                  : selectedAnswer === index
                  ? "bg-red-600"
                  : "bg-zinc-800 opacity-50"
              }`}
            >
              <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
              {showResult && index === question.correct && " ✓"}
              {showResult && selectedAnswer === index && index !== question.correct && " ✗"}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="text-center text-zinc-500 text-sm">
        <p>Current Score: {score}</p>
      </div>
    </div>
  );
}
