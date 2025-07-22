const express = require("express");
const cors = require("cors");
const studentsRoutes = require("./routes/students");
const teachersRoutes = require("./routes/teachers");
const libraryRoutes = require("./routes/library");
const communicationsRoutes = require("./routes/communications");
const calendarRoutes = require("./routes/calendar");
const gradesRoutes = require("./routes/grades");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/students", studentsRoutes);
app.use("/teachers", teachersRoutes);
app.use("/library", libraryRoutes);
app.use("/communications", communicationsRoutes);
app.use("/calendar", calendarRoutes);
app.use("/grades", gradesRoutes);

app.get("/", (req, res) => {
  res.send("API School Backend");
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
