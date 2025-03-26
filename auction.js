// 전역 변수
let highestBid = 0;
let highestTeam = "-";
let currentRound = 1;
let timer = 5;
let interval;

// 팀별 상태
const teams = {
    A: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
    B: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
    C: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
    D: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
    E: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
    F: { balance: 1000, totalSpent: 0, items: [], lastBid: 0 },
};

// 랜덤 경매 아이템
const items = shuffleArray([...Array(15).keys()].map(i => i + 1));
const unsoldItems = [];

// 랜덤 배열 섞기 함수
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
        document.getElementById(`sum${team}`).innerText = teams[team].items.reduce((sum, num) => sum + num, 0); // 숫자 합계 계산
    });

    document.getElementById("unsoldItems").innerText = unsoldItems.join(", ") || "-";

    // 현재 경매 항목을 빨간색으로 표시
    const currentItemElement = document.getElementById("currentItem");
    currentItemElement.innerText = currentRound <= 15 ? items[currentRound - 1] : "종료";
    currentItemElement.style.color = 'red';  // 현재 경매 항목 빨간색으로 변경
}


// 타이머 시작 버튼 기능
function startTimer() {
    clearInterval(interval); // 기존 타이머 정지
    timer = 5; // 타이머 5초로 초기화
    document.getElementById("timer").innerText = timer;

    interval = setInterval(() => {
        timer--;
        document.getElementById("timer").innerText = timer;

        if (timer <= 0) {
            clearInterval(interval); // 타이머 종료
        }
    }, 1000);
}


// 타이머 리셋
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

// 입찰 처리 함수
function placeBid(team, increment) {
    const newBid = highestBid + increment;
    const additionalCost = newBid - teams[team].lastBid;

    if (teams[team].balance >= additionalCost) {
        teams[team].balance -= additionalCost;
        teams[team].lastBid = newBid;
        highestBid = newBid;
        highestTeam = team;
        updateDisplay();
        resetTimer();
    } else {
        alert(`${team} 팀의 잔액이 부족합니다.`);
    }
}

// 금액 입력 처리 함수
function customBid(team) {
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
    if (currentRound < 15) {
        const currentItem = items[currentRound - 1];

        // 최고 입찰 팀이 있으면 항목 추가
        if (highestTeam !== "-") {
            teams[highestTeam].items.push(currentItem); // 최고 입찰 팀이 아이템을 획득
            teams[highestTeam].totalSpent += highestBid; // 낙찰 금액을 totalSpent에 반영
        } else {
            unsoldItems.push(currentItem); // 유찰된 항목 추가
        }

        // 모든 팀의 상태 초기화
        Object.keys(teams).forEach(team => {
            if (team !== highestTeam) {
                // 낙찰되지 않은 팀은 잔액을 초기 상태로 복원
                teams[team].balance = 1000 - teams[team].totalSpent;
            }
            // 모든 팀의 마지막 입찰 금액 초기화
            teams[team].lastBid = 0;
        });

        // 최고 입찰 금액 및 팀 초기화
        highestBid = 0;
        highestTeam = "-";
        currentRound++;

        // 화면 업데이트
        document.getElementById("currentRound").innerText = `${currentRound}/15`; // /15 추가
        document.getElementById("currentItem").innerText =
            currentRound <= 15 ? items[currentRound - 1] : "종료";

        updateDisplay();
        resetTimer();
    } else {
        alert("경매가 종료되었습니다!");
        document.getElementById("nextRoundButton").disabled = true;
        clearInterval(interval);
    }
}




// 경매 시작
function startAuction() {
    document.getElementById("startButton").disabled = true;
    document.getElementById("nextRoundButton").disabled = false;

    document.getElementById("randomOrder").innerText = items.join(", ");
    document.getElementById("currentItem").innerText = items[0];
    document.getElementById("currentItem").style.color = 'red';  // 경매 시작 시 첫 번째 항목 빨간색으로
    resetTimer();
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("randomOrder").innerText = items.join(", ");
    document.getElementById("currentItem").style.color = 'red';  // 초기 항목 빨간색으로 설정
});
