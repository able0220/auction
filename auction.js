// 전역 변수
let highestBid = 0;
let highestTeam = "-";
let currentRound = 1;
let timer = 5;
let interval;
let lastState = null; // 되돌리기용 상태 저장

const teams = {
  A: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
  B: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
  C: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
  D: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
  E: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
  F: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
};

const items = shuffleArray([...Array(15).keys()].map(i => i + 1));
const unsoldItems = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateDisplay() {
  document.getElementById("highestBid").innerText = highestBid;
  document.getElementById("highestTeam").innerText = highestTeam;

  Object.keys(teams).forEach(team => {
    document.getElementById(`balance${team}`).innerText = teams[team].balance;
    document.getElementById(`items${team}`).innerText = teams[team].items.join(", ") || "-";
    document.getElementById(`sum${team}`).innerText = teams[team].items.reduce((sum, num) => sum + num, 0);
  });

  document.getElementById("unsoldItems").innerText = unsoldItems.join(", ") || "-";

  const currentItemElement = document.getElementById("currentItem");
  currentItemElement.innerText = currentRound <= 15 ? items[currentRound - 1] : "종료";
  currentItemElement.style.color = 'red';
}

function startTimer() {
  clearInterval(interval);
  timer = 5;
  document.getElementById("timer").innerText = timer;

  interval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;
    if (timer <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  timer = 5;
  document.getElementById("timer").innerText = timer;

  interval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;
    if (timer <= 0) {
      clearInterval(interval);
      document.getElementById("nextRoundButton").disabled = false;
    }
  }, 1000);
}

function saveLastState() {
  lastState = {
    highestBid,
    highestTeam,
    teams: JSON.parse(JSON.stringify(teams))
  };
}

function undoLastBid() {
  if (lastState) {
    highestBid = lastState.highestBid;
    highestTeam = lastState.highestTeam;
    Object.keys(teams).forEach(team => {
      teams[team] = { ...lastState.teams[team] };
    });
    updateDisplay();
  } else {
    alert("되돌릴 수 있는 이전 입찰이 없습니다.");
  }
}

function customBid(team) {
  saveLastState();
  const input = parseInt(prompt(`팀 ${team}이 입찰할 금액을 입력하세요:`));
  const additionalCost = input - teams[team].lastBid;

  if (!isNaN(input) && input > highestBid) {
    if (teams[team].balance >= additionalCost) {
      teams[team].balance -= additionalCost;
      teams[team].lastBid = input;
      highestBid = input;
      highestTeam = team;
      updateDisplay();
      resetTimer();
    } else {
      alert(`${team} 팀의 잔액이 부족합니다.`);
    }
  } else {
    alert("유효한 금액을 입력하거나 현재 최고 금액보다 높은 금액을 입력하세요.");
  }
}

function nextRound() {
  if (currentRound <= 15) {
    const currentItem = items[currentRound - 1];

    if (highestTeam !== "-") {
      teams[highestTeam].items.push(currentItem);
      teams[highestTeam].totalSpent += highestBid;
    } else {
      unsoldItems.push(currentItem);
    }

    Object.keys(teams).forEach(team => {
      if (team !== highestTeam) {
        teams[team].balance = 1000 - teams[team].totalSpent;
      }
      teams[team].lastBid = 0;
    });

    highestBid = 0;
    highestTeam = "-";

    document.getElementById("currentRound").innerText = `${currentRound}/15`;
    updateDisplay();

    if (currentRound === 15) {
      alert("경매가 종료되었습니다!");
      document.getElementById("nextRoundButton").disabled = true;
      clearInterval(interval);
      document.getElementById("currentItem").innerText = "종료";
    } else {
      currentRound++;
      document.getElementById("currentItem").innerText = items[currentRound - 1];
      resetTimer();
    }
  }
}

function startAuction() {
  document.getElementById("startButton").disabled = true;
  document.getElementById("nextRoundButton").disabled = false;
  document.getElementById("randomOrder").innerText = items.join(", ");
  document.getElementById("currentItem").innerText = items[0];
  document.getElementById("currentItem").style.color = 'red';
  updateDisplay();
  resetTimer();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("randomOrder").innerText = items.join(", ");
  document.getElementById("currentItem").style.color = 'red';
});
