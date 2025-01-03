// src/components/Quiz.jsx
import React, { useState } from "react";
import { questions } from "../questions";

// Material UI
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress
} from "@mui/material";

function Quiz({ onQuizComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // Lorsqu’on choisit une réponse
  const handleAnswerSelect = (answerIndex) => {
    // Met à jour la réponse de l’utilisateur
    setUserAnswers((prev) => {
      const existingAnswer = prev.find(
        (ans) => ans.questionId === currentQuestion.id
      );
      if (existingAnswer) {
        // Mise à jour si la question avait déjà été répondue
        return prev.map((ans) =>
          ans.questionId === currentQuestion.id
            ? { ...ans, userAnswerIndex: answerIndex }
            : ans
        );
      } else {
        // Ajout d’une nouvelle réponse
        return [
          ...prev,
          { questionId: currentQuestion.id, userAnswerIndex: answerIndex }
        ];
      }
    });

    // Petit délai (0ms) pour laisser React mettre à jour le state userAnswers
    setTimeout(() => {
      handleNext();
    }, 0);
  };

  const handleNext = () => {
    // Si pas la dernière question, on passe à la suivante
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Sinon, on calcule le score
      calculateScore();
    }
  };

  // Calcule le score en se basant sur userAnswers
  const calculateScore = () => {
    // Utiliser le dernier état userAnswers via un callback
    setUserAnswers((prevAnswers) => {
      const score = prevAnswers.reduce((acc, ans) => {
        const question = questions.find((q) => q.id === ans.questionId);
        return question && question.correctAnswerIndex === ans.userAnswerIndex
          ? acc + 1
          : acc;
      }, 0);

      onQuizComplete(score, prevAnswers);
      return prevAnswers;
    });
  };

  // Barre de progression
  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Question {currentQuestionIndex + 1} / {totalQuestions}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {currentQuestion.question}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {currentQuestion.options.map((option, index) => {
            // Vérifie si cette option est sélectionnée (juste pour l'effet visuel)
            const isSelected = userAnswers.some(
              (ans) =>
                ans.questionId === currentQuestion.id &&
                ans.userAnswerIndex === index
            );

            return (
              <Button
                key={index}
                variant={isSelected ? "contained" : "outlined"}
                color={isSelected ? "success" : "primary"}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </Button>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

export default Quiz;
