// src/App.js
import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz"; // Sans .jsx
import WinnerCarousel from "./components/WinnerCarousel"; // Sans .jsx

// Material UI
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";

// Import Firestore services
import { subscribePlayers, addFullPlayer } from "./services/playersFirestore";

// Option 2 : Si le logo est dans src/assets/
import logoSrc from "./assets/logo.png";

function App() {
  // États principaux
  const [participants, setParticipants] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isDetermining, setIsDetermining] = useState(false);
  const [winner, setWinner] = useState(null);

  // États pour la fin du quiz
  const [score, setScore] = useState(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  // Champs du formulaire "fiche joueur"
  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 1) S'abonner à Firestore au montage
  useEffect(() => {
    const unsubscribe = subscribePlayers((data) => {
      setParticipants(data);
    });
    return () => unsubscribe();
  }, []);

  // 2) Callback quand le quiz est terminé
  const handleQuizComplete = (finalScore, answers) => {
    setScore(finalScore);
    setShowQuiz(false);
    setShowPlayerForm(true); // Afficher le formulaire fiche joueur
  };

  // 3) Déterminer le gagnant
  const determineWinner = () => {
    if (participants.length === 0) {
      alert("Aucun participant pour l'instant !");
      return;
    }
    setIsDetermining(true);
    setWinner(null);

    const maxScore = Math.max(...participants.map((p) => p.score));
    const topPlayers = participants.filter((p) => p.score === maxScore);

    // Animation 3s, puis tirage aléatoire
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * topPlayers.length);
      const finalWinner = topPlayers[randomIndex];
      setWinner(finalWinner);

      setTimeout(() => {
        setIsDetermining(false);
      }, 1000);
    }, 3000);
  };

  // 4) Soumission de la fiche joueur
  const handleSubmitPlayerForm = async (e) => {
    e.preventDefault();
    // Validation simple
    if (!playerName || !email || !phone) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await addFullPlayer(playerName, score, email, phone);

      // Réinitialiser les champs
      setPlayerName("");
      setEmail("");
      setPhone("");
      setShowPlayerForm(false);

      alert("Fiche joueur enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur pour enregistrer la fiche joueur :", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Logo centré en haut de page */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <img
          src={logoSrc} // Assurez-vous que logo.png est dans public/
          alt="Mon Logo"
          style={{ maxWidth: "200px" }}
        />
      </Box>

      {/* Affichage conditionnel */}
      {showQuiz ? (
        <Quiz onQuizComplete={handleQuizComplete} />
      ) : showPlayerForm ? (
        // 5) Formulaire “Fiche Joueur”
        <Card sx={{ p: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Formulaire - Fiche Joueur
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Votre score au quiz : {score}
            </Typography>
            <Box component="form" onSubmit={handleSubmitPlayerForm} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nom / Pseudo"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Téléphone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Button type="submit" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        // Sinon, écran principal normal (boutons + table des participants)
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
              <Button variant="contained" onClick={() => setShowQuiz(true)}>
                Démarrer le Quiz
              </Button>
              <Button variant="contained" color="secondary" onClick={determineWinner}>
                Déterminer le gagnant
              </Button>
            </Box>

            <Typography variant="h5" gutterBottom>
              Participants :
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Score</TableCell>
                  {/* Supprimé les colonnes Email et Téléphone */}
                  {/* <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.score}</TableCell>
                    {/* Supprimé les cellules Email et Téléphone */}
                    {/* <TableCell>{p.email}</TableCell>
                    <TableCell>{p.phone}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {isDetermining && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Détermination du gagnant en cours...
                </Typography>
                <WinnerCarousel players={participants} />
              </Box>
            )}

            {winner && !isDetermining && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  Le gagnant est : {winner.name} (score : {winner.score})
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;
