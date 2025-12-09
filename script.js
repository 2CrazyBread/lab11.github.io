$(document).ready(function() {
  const wordDictionary = [
    { english: "hello", ukrainian: "привіт" },
    { english: "goodbye", ukrainian: "до побачення" },
    { english: "thank you", ukrainian: "дякую" },
    { english: "please", ukrainian: "будь ласка" },
    { english: "yes", ukrainian: "так" },
    { english: "no", ukrainian: "ні" },
    { english: "house", ukrainian: "дім" },
    { english: "car", ukrainian: "автомобіль" },
    { english: "book", ukrainian: "книга" },
    { english: "water", ukrainian: "вода" },
    { english: "food", ukrainian: "їжа" },
    { english: "friend", ukrainian: "друг" },
    { english: "family", ukrainian: "сім'я" },
    { english: "school", ukrainian: "школа" },
    { english: "work", ukrainian: "робота" }
  ];
  
  let currentStep = 1;
  const totalSteps = 10;
  let correctCount = 0;
  let incorrectCount = 0;
  let currentWordIndex = 0;
  let shuffledWords = [];
  
  function Shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  function createButtons() {
    const buttonsContainer = $("#buttonsContainer");
    buttonsContainer.empty();
    
    const checkBtn = $("<button>")
      .attr("id", "checkBtn")
      .addClass("primary-btn")
      .text("Перевірити");
    
    const nextBtn = $("<button>")
      .attr("id", "nextBtn")
      .addClass("secondary-btn")
      .text("Наступне слово")
      .prop("disabled", true);
    
    buttonsContainer.append(checkBtn, nextBtn);
    
    checkBtn.click(checkAnswer);
    nextBtn.click(nextWord);
  }
  
  function initializeGame() {
    shuffledWords = Shuffle(wordDictionary).slice(0, totalSteps);
    
    currentStep = 1;
    correctCount = 0;
    incorrectCount = 0;
    
    createButtons();
    
    updateStats();
    showNextWord();
    
    $("#translationInput").val("").prop("disabled", false);
    $("#inputError").text("");
    $("#resultMessage").removeClass("correct-msg incorrect-msg").text("");
    $("#checkBtn").prop("disabled", false);
    $("#nextBtn").prop("disabled", true);
    $("#resultsModal").hide();
  }
  
  function updateStats() {
    $("#currentStep").text(currentStep);
    $("#totalSteps").text(totalSteps);
    $("#correctCount").text(correctCount);
    $("#incorrectCount").text(incorrectCount);
  }
  
  function showNextWord() {
    if (currentStep > totalSteps) {
      endGame();
      return;
    }
    
    currentWordIndex = currentStep - 1;
    const currentWord = shuffledWords[currentWordIndex];
    
    $("#wordToTranslate").text(currentWord.english);
    
    $("#translationInput").val("").prop("disabled", false).focus();
    $("#inputError").text("");
    $("#resultMessage").removeClass("correct-msg incorrect-msg").text("");
    $("#nextBtn").prop("disabled", true);
    $("#checkBtn").prop("disabled", false);
    
    updateStats();
  }
  
  function checkAnswer() {
    const userAnswer = $("#translationInput").val().trim().toLowerCase();
    const currentWord = shuffledWords[currentWordIndex];
    const correctAnswer = currentWord.ukrainian.toLowerCase();
    
    if (!userAnswer) {
      $("#inputError").text("Введіть переклад");
      return;
    }
    
    $("#inputError").text("");
    
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      correctCount++;
      $("#resultMessage")
        .addClass("correct-msg")
        .text(`Вірно! Правильно: ${correctAnswer}`);
    } else {
      incorrectCount++;
      $("#resultMessage")
        .addClass("incorrect-msg")
        .text(`Невірно! Правильно: ${correctAnswer}`);
    }
    
    updateStats();
    
    $("#translationInput").prop("disabled", true);
    $("#checkBtn").prop("disabled", true);
    $("#nextBtn").prop("disabled", false);
  }
  
  function nextWord() {
    currentStep++;
    showNextWord();
  }
  
  function calculateKnowledgeLevel(score) {
    if (score >= 90) return { title: "Експерт"};
    if (score >= 70) return { title: "Просунутий",};
    if (score >= 40) return { title: "Середній",};
    return { title: "Початківець"};
  }
  
  function endGame() {
    const score = Math.round((correctCount / totalSteps) * 100);
    const level = calculateKnowledgeLevel(score);
    
    $("#levelScore").text(score + "%");
    $("#levelTitle").text(level.title);
    $("#finalCorrect").text(correctCount);
    $("#finalIncorrect").text(incorrectCount);
    $("#finalTotal").text(totalSteps);
    
    $("#resultsModal").show();
    
    $("#restartModalBtn").off("click").on("click", function() {
      $("#resultsModal").hide();
      initializeGame();
    });
  }
  
  $("#translationInput").keypress(function(e) {
    if (e.which === 13 && !$("#checkBtn").prop("disabled")) {
      checkAnswer();
    }
  });
  
  $(".card").click(function() {
    if (!$("#checkBtn").prop("disabled") && $("#translationInput").val().trim()) {
      checkAnswer();
    }
  });
  
  initializeGame();
});