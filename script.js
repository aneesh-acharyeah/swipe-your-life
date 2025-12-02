// Simple Gen Z life simulator
// Stats: career, relationships, mentalHealth

const stats = {
  career: 50,
  relationships: 50,
  mental: 50,
};

let currentIndex = 0;
let gameOver = false;

// Each card: scenario + two choices with stat impacts
const cards = [
  {
    tag: "College",
    title: "Your friends are going on a spontaneous road trip the night before an exam.",
    text: "You’re tired, stressed, and kinda done with everything.",
    left: {
      label: "Go anyway, memories > marks",
      effects: { career: -10, relationships: +12, mental: +5 },
    },
    right: {
      label: "Stay in and study",
      effects: { career: +12, relationships: -6, mental: -4 },
    },
  },
  {
    tag: "Side Hustle",
    title: "You get an idea to start a small online business.",
    text: "It’ll take time away from Netflix + sleep.",
    left: {
      label: "Start the hustle",
      effects: { career: +14, relationships: -4, mental: -6 },
    },
    right: {
      label: "Nah, too much effort",
      effects: { career: -4, relationships: 0, mental: +6 },
    },
  },
  {
    tag: "Mental Health",
    title: "You’ve been doom-scrolling till 3 AM for the 5th day.",
    text: "Your brain feels like fried chips.",
    left: {
      label: "Delete apps for a week",
      effects: { career: +4, relationships: -4, mental: +14 },
    },
    right: {
      label: "Whatever, one more reel",
      effects: { career: -4, relationships: +2, mental: -10 },
    },
  },
  {
    tag: "Career",
    title: "A startup offers you an unpaid internship with good learning.",
    text: "Your parents are worried about money.",
    left: {
      label: "Accept and grind",
      effects: { career: +16, relationships: -5, mental: -6 },
    },
    right: {
      label: "Reject, focus on safe path",
      effects: { career: +4, relationships: +2, mental: +2 },
    },
  },
  {
    tag: "Relationships",
    title:
      "Your best friend says you’re always 'online but unavailable' when they need you.",
    text: "You’ve been too busy with work and side projects.",
    left: {
      label: "Pause work, spend time with them",
      effects: { career: -6, relationships: +14, mental: +4 },
    },
    right: {
      label: "Tell them to understand your grind",
      effects: { career: +6, relationships: -12, mental: -4 },
    },
  },
  {
    tag: "Self Care",
    title: "You’re running on instant noodles, coffee, and vibes.",
    text: "Gym membership is basically a donation.",
    left: {
      label: "Start a basic routine",
      effects: { career: +2, relationships: 0, mental: +12 },
    },
    right: {
      label: "Skip, future me will fix it",
      effects: { career: 0, relationships: 0, mental: -10 },
    },
  },
  {
    tag: "Social Media",
    title: "One of your posts randomly goes semi-viral.",
    text: "People are asking for more content.",
    left: {
      label: "Go full 'creator mode'",
      effects: { career: +8, relationships: -4, mental: -6 },
    },
    right: {
      label: "Cool, but stay low-key",
      effects: { career: +4, relationships: +2, mental: +4 },
    },
  },
  {
    tag: "Family",
    title: "Your parents want you to attend a family function.",
    text: "You had planned a full day of work + rest.",
    left: {
      label: "Go and be present",
      effects: { career: -4, relationships: +10, mental: +2 },
    },
    right: {
      label: "Skip and say you’re busy",
      effects: { career: +4, relationships: -10, mental: -2 },
    },
  },
];

// DOM elements
const careerValueEl = document.getElementById("career-value");
const relationshipsValueEl = document.getElementById("relationships-value");
const mentalValueEl = document.getElementById("mental-value");

const careerBarEl = document.getElementById("career-bar");
const relationshipsBarEl = document.getElementById("relationships-bar");
const mentalBarEl = document.getElementById("mental-bar");

const cardEl = document.getElementById("card");
const cardCountEl = document.getElementById("card-count");
const cardTagEl = document.getElementById("card-tag");
const cardTitleEl = document.getElementById("card-title");
const cardTextEl = document.getElementById("card-text");

const leftBtnEl = document.getElementById("left-btn");
const rightBtnEl = document.getElementById("right-btn");
const leftLabelEl = document.getElementById("left-label");
const rightLabelEl = document.getElementById("right-label");

const endScreenEl = document.getElementById("end-screen");
const endTitleEl = document.getElementById("end-title");
const endReasonEl = document.getElementById("end-reason");
const endCareerEl = document.getElementById("end-career");
const endRelationshipsEl = document.getElementById("end-relationships");
const endMentalEl = document.getElementById("end-mental");
const endSummaryEl = document.getElementById("end-summary");
const restartBtnEl = document.getElementById("restart-btn");

// Helpers
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateStatsUI() {
  careerValueEl.textContent = stats.career;
  relationshipsValueEl.textContent = stats.relationships;
  mentalValueEl.textContent = stats.mental;

  careerBarEl.style.width = `${stats.career}%`;
  relationshipsBarEl.style.width = `${stats.relationships}%`;
  mentalBarEl.style.width = `${stats.mental}%`;

  // Color hint if very low
  if (stats.career <= 20) {
    careerBarEl.style.background = `linear-gradient(90deg, #f97373, #fb7185)`;
  } else {
    careerBarEl.style.background =
      "linear-gradient(90deg, #38bdf8, #8b5cf6, #f973c7)";
  }

  if (stats.relationships <= 20) {
    relationshipsBarEl.style.background = `linear-gradient(90deg, #f97373, #fb7185)`;
  } else {
    relationshipsBarEl.style.background =
      "linear-gradient(90deg, #38bdf8, #8b5cf6, #f973c7)";
  }

  if (stats.mental <= 20) {
    mentalBarEl.style.background = `linear-gradient(90deg, #f97373, #fb7185)`;
  } else {
    mentalBarEl.style.background =
      "linear-gradient(90deg, #38bdf8, #8b5cf6, #f973c7)";
  }
}

function renderCard() {
  if (currentIndex >= cards.length) {
    // No more cards: natural ending
    handleEnd("You reached the end of this chapter of life.", false);
    return;
  }

  const card = cards[currentIndex];
  cardCountEl.textContent = `${currentIndex + 1} / ${cards.length}`;
  cardTagEl.textContent = card.tag;
  cardTitleEl.textContent = card.title;
  cardTextEl.textContent = card.text;
  leftLabelEl.textContent = card.left.label;
  rightLabelEl.textContent = card.right.label;
}

function applyEffects(effects) {
  stats.career = clamp(stats.career + (effects.career || 0), 0, 100);
  stats.relationships = clamp(
    stats.relationships + (effects.relationships || 0),
    0,
    100
  );
  stats.mental = clamp(stats.mental + (effects.mental || 0), 0, 100);
}

function checkGameOverByStats() {
  return stats.career <= 0 || stats.relationships <= 0 || stats.mental <= 0;
}

function computeEndingSummary() {
  const { career, relationships, mental } = stats;
  const maxStat = Math.max(career, relationships, mental);

  if (maxStat === career) {
    return "You became the ultimate grinder – career first, everything else second. LinkedIn bio stays updated, sleep schedule does not.";
  } else if (maxStat === relationships) {
    return "You chose people over hustle. Your group chat is alive, your phone gallery is full of memories, and somehow life still moves forward.";
  } else {
    return "You protected your peace. Not richest, not most popular, but you wake up without instantly checking your phone, and that’s a flex.";
  }
}

function handleEnd(reason, isCrash) {
  gameOver = true;

  // Hide card, show end screen
  cardEl.parentElement.classList.add("hidden");
  endScreenEl.classList.remove("hidden");

  endReasonEl.textContent = reason;
  endCareerEl.textContent = stats.career;
  endRelationshipsEl.textContent = stats.relationships;
  endMentalEl.textContent = stats.mental;

  if (isCrash) {
    endTitleEl.textContent = "Game Over 💥";
  } else {
    endTitleEl.textContent = "Chapter Complete ✅";
  }

  endSummaryEl.textContent = computeEndingSummary();
}

function handleChoice(direction) {
  if (gameOver) return;

  const card = cards[currentIndex];
  const choice = direction === "left" ? card.left : card.right;

  // Trigger swipe animation
  cardEl.classList.remove("swipe-left", "swipe-right");
  void cardEl.offsetWidth; // Force reflow
  cardEl.classList.add(direction === "left" ? "swipe-left" : "swipe-right");

  // After animation, apply effects & move to next card
  setTimeout(() => {
    applyEffects(choice.effects);
    updateStatsUI();

    if (checkGameOverByStats()) {
      handleEnd(
        "One part of your life completely burned out. That’s your sign to rebalance.",
        true
      );
      return;
    }

    currentIndex += 1;

    // Reset animation position
    cardEl.classList.remove("swipe-left", "swipe-right");
    cardEl.style.opacity = 1;
    cardEl.style.transform = "translateX(0) rotate(0)";

    renderCard();
  }, 260);
}

function restartGame() {
  stats.career = 50;
  stats.relationships = 50;
  stats.mental = 50;
  currentIndex = 0;
  gameOver = false;

  updateStatsUI();
  renderCard();

  endScreenEl.classList.add("hidden");
  cardEl.parentElement.classList.remove("hidden");
}

// Event listeners
leftBtnEl.addEventListener("click", () => handleChoice("left"));
rightBtnEl.addEventListener("click", () => handleChoice("right"));

restartBtnEl.addEventListener("click", restartGame);

// Optional keyboard controls: ← / →
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft") handleChoice("left");
  if (e.key === "ArrowRight") handleChoice("right");
});

// Init
updateStatsUI();
renderCard();
