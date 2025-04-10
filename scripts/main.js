let current = 0;
let score = 0;
let selectedQuiz = [];
let selectedTheme = "";

async function loadQuestions(theme, lang) {
  const path = `questions/${theme}.${lang}.json`;
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load quiz from ${path}`);
  }
  return await res.json();
}

async function startQuiz() {
  const lang = document.getElementById("language").value;
  const theme = document.getElementById("theme").value;
  selectedTheme = theme;

  try {
    selectedQuiz = await loadQuestions(theme, lang);
  } catch (e) {
    alert("Erro ao carregar perguntas: " + e.message);
    return;
  }

  current = 0;
  score = 0;
  document.getElementById("quiz").style.display = "block";
  document.getElementById("result").innerHTML = "";
  document.getElementById("next").style.display = "none";
  loadQuestion();
}

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function loadQuestion() {
  const q = selectedQuiz[current];
  document.getElementById("question").textContent = q.q;
  const opts = document.getElementById("options");
  opts.innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("next").style.display = "none";

  const shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = () => selectAnswer(opt);
    opts.appendChild(btn);
  });
}

function selectAnswer(option) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = option.feedback;
  if (option.isCorrect) score++;

  // Disable all buttons
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(btn => (btn.disabled = true));

  // Show "Next" button
  document.getElementById("next").style.display = "block";
}

function nextQuestion() {
  current++;
  if (current < selectedQuiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const percent = Math.round((score / selectedQuiz.length) * 100);
  let level = "";

  if (percent === 100) level = "Selo Mestre Jedi 🧠";
  else if (percent >= 70) level = "Selo Dev Sênior 💻";
  else if (percent >= 40) level = "Selo Estagiário Valente 👶";
  else level = "Selo Confuso, porém tentando 🤯";

  const themeName = {
    platform: "Engenharia de Plataforma",
    cloud: "Cloud Native",
    ai: "IA Generativa"
  }[selectedTheme] || selectedTheme;

  const result = `
    <p>Você acertou ${score} de ${selectedQuiz.length} em <strong>${themeName}</strong>.</p>
    <div class='badge'>${level}</div>
    <p>
      <a href='https://wa.me/?text=Acabei%20de%20fazer%20um%20quiz%20tech%20sobre%20${encodeURIComponent(themeName)}%20e%20ganhei%20o%20${encodeURIComponent(level)}!%20Tenta%20a%C3%AD%3A%20https%3A%2F%2Fjeanmeira.github.io%2Fquiz%2F' 
      target='_blank'>Compartilhar no WhatsApp</a>
    </p>`;

  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").innerHTML = result;
}
