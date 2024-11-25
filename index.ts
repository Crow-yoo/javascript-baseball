import * as readline from 'readline';

// BallNumber 타입 선언
type BallNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// 게임 상태 관리
enum GameState {
    runningGame = 'RUNNING',
    startGame = '1',
    showRecords = '2',
    showStats = '3',
    endGame = '9'
};

// 컴퓨터 인터페이스
interface Computer {
    numbers: BallNumber[];
};

// 사용자 인터페이스
interface User {
    numbers: BallNumber[];
    submitCount: number;
    attempts: number; // 시도 횟수
    history: { userInput: BallNumber[]; hint: string }[];
};

// 게임 결과 인터페이스
interface GameResult {
    id: number;
    startTime: string;
    endTime: string;
    attempts: number;
    winner: 'User' | 'Computer';
    history: { userInput: BallNumber[]; hint: string }[];
};

// 게임 기록 인터페이스 
interface GameRecord {
    totalGames: number;
    userWins: number;
    computerWins: number;
    results: GameResult[];
};

// 전역 변수 설정
const gameRecord: GameRecord = {
    totalGames: 0,
    userWins: 0,
    computerWins: 0,
    results: [],
};

// 입력 필드
const inputInterface = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout
});

// 랜덤 숫자 생성
const generateThreeRandomNumbers = (): BallNumber[] => {
    const shuffledArray = Array.from({ length: 9 }, (_, i) => i + 1 as BallNumber).sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, 3);
};

// 사용자 입력 받기
const getUserInput = () : Promise<BallNumber[]> => {
    return new Promise((resolve) => {
        inputInterface.question('숫자를 입력해주세요 : ', (userInput) => {
            const userNumbers = userInput.split('').map(Number) as BallNumber[];
            resolve(userNumbers);
        });
    });
};

// 입력값 유효성 검사
const isValidInput = (userNumbers : BallNumber[]) : boolean => {
    return (
        userNumbers.length === 3 &&
        userNumbers.every(num => num >= 1 && num <= 9) && // 0이 들어가면 오류가 나서 로직 변경
        new Set(userNumbers).size === 3
    );
};

// 스트라이크 계산
const getStrikeCount = (computerNumbers: BallNumber[], userNumbers: BallNumber[]): number => {
    return userNumbers.filter((num, index) => num === computerNumbers[index]).length;
};

// 볼 계산
const getBallCount = (computerNumbers: BallNumber[], userNumbers: BallNumber[]): number => {
    return userNumbers.filter((num, index) => num !== computerNumbers[index] && computerNumbers.includes(num)).length;
};

// 힌트 메시지 생성
const getHintMessage = (computerNumbers: BallNumber[], userNumbers: BallNumber[]): string => {
    const strikes = getStrikeCount(computerNumbers, userNumbers);
    const balls = getBallCount(computerNumbers, userNumbers);

    if (strikes === 0 && balls === 0) return '낫싱';
    if (strikes === 3) return '3스트라이크';
    return `${balls ? `${balls}볼` : ''} ${strikes ? `${strikes}스트라이크` : ''}`.trim();
};

// 날짜 및 시간 포맷팅 함수
const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}. ${month}. ${day} ${hours}:${minutes}`;
};

// 승패 결정 함수
const finishGame = (startTime: Date, user : User, winner : 'User' | 'Computer'): void => {
    const endTime = new Date();

    gameRecord.totalGames++;

    if (winner === 'User') {
        const userMessage = '사용자가 승리하였습니다.\n\n3개의 숫자를 모두 맞히셨습니다.\n-------게임 종료-------'
        console.log(userMessage);
        gameRecord.userWins++;
        user.history.push({ userInput: [], hint: userMessage });
    } else {
        const computerMessage = '컴퓨터가 승리하였습니다.\n-------게임 종료-------'
        console.log(computerMessage);
        gameRecord.computerWins++;
        user.history.push({ userInput: [], hint: computerMessage });
    }

    // 게임 기록 저장
    gameRecord.results.push({
        id: gameRecord.results.length + 1,
        startTime: formatDateTime(startTime), 
        endTime: formatDateTime(endTime),     
        attempts : user.submitCount,
        winner,
        history : user.history,
    });

    applicationStart(); // 게임 종료 후 다시 입력 받기
};

// 게임 진행
const playGame = async (computer: Computer, user: User, startTime: Date): Promise<void> => {
    const userNumbers = await getUserInput();
    if (!isValidInput(userNumbers)) {
        console.log('유효하지 않은 입력입니다. 다시 입력해주세요.');
        return playGame(computer, user, startTime); // 재귀로 재입력 유도
    }
    user.submitCount++;
    const hint = getHintMessage(computer.numbers, userNumbers);
    console.log(hint);
    user.history.push({ userInput: userNumbers, hint });

    if (hint === '3스트라이크') {
        finishGame(startTime, user, 'User');
    } else if (user.submitCount >= user.attempts) {
        finishGame(startTime, user, 'Computer');
    } else {
        return playGame(computer, user, startTime); // 계속 진행
    }
};

// 게임 시작
const start = async (): Promise<void> => {
    const computer: Computer = { numbers: generateThreeRandomNumbers() };
    const user: User = { numbers: [], submitCount: 0 , attempts : 0, history : []};

    // 최대 시도 횟수 입력 받기
    const userAttempts = await new Promise<number>((resolve) => {
        inputInterface.question('\n컴퓨터에게 승리하기 위해 몇번만에 성공해야 하나요?\n', (input) => {
            resolve(parseInt(input, 10));
        });
    });

    user.attempts = userAttempts;
    const startTime = new Date();

    console.log('\n컴퓨터가 숫자를 뽑았습니다.\n');
    await playGame(computer, user, startTime);
};

// 기록 함수
const showRecords = (): void => {
    if (gameRecord.results.length === 0) {
        console.log('\n아직 진행된 게임이 없습니다.\n');
        applicationStart();
        return;
    }

    // 게임 진행 내역 (선택적으로 출력 가능)
    const recordsDetails = gameRecord.results
        .map(
            (result) =>
        `\n[게임 회차: ${result.id}] \n시작: ${result.startTime} | 종료: ${result.endTime} | 총 시도: ${result.attempts}회 \n승리자: ${result.winner === 'User' ? '사용자' : '컴퓨터'} \n진행 내역: \n${result.history
        .filter(({ userInput }) => userInput.length > 0) // 입력값이 있는 경우만 출력
        .map(({ userInput, hint }, index) =>
        ` ${index + 1}. 입력: ${userInput.join('')} | 결과: ${hint}`).join('\n')} \n결과 메시지: ${result.history[result.history.length - 1]?.hint || ''}`)
        .join('\n-------------------------\n');

    console.log('\n------- 게임 진행 상세 내역 -------');
    console.log(recordsDetails.trim());
    console.log('-------------------------\n------- 기록 종료 -------\n');

    applicationStart();
};

// 통계 기능 구현
const showStats = (): void => {
    if (gameRecord.results.length === 0) {
        console.log('\n아직 진행된 게임이 없습니다.\n');
        applicationStart();
        return;
    }
    const userWinCounts = gameRecord.results
        .filter(result => result.winner === 'User')
        .map(result => result.attempts);
    const computerWinCounts = gameRecord.results
        .filter(result => result.winner === 'Computer')
        .map(result => result.attempts);
    const maxAttemptCounts = gameRecord.results.map(result => result.attempts); // 입력한 최대 시도 횟수 데이터
    const calculateAverage = (values: number[]): string =>
        values.length > 0
            ? (values.reduce((sum, count) => sum + count, 0) / values.length).toFixed(2)
            : '0.00';
    const safeMin = (values: number[]): number =>
        values.length > 0 ? Math.min(...values) : 0;
    const safeMax = (values: number[]): number =>
        values.length > 0 ? Math.max(...values) : 0;
    const calculateMostFrequent = (values: number[]): number => {
        if (values.length === 0) return 0;
        const frequency: Record<number, number> = {};
        values.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
        });
        const maxFrequency = Math.max(...Object.values(frequency));
        return parseInt(Object.keys(frequency).find(key => frequency[parseInt(key)] === maxFrequency) || '0', 10);
    };
    const stats = {
        maxAttempts: safeMax(maxAttemptCounts),
        minAttempts: safeMin(maxAttemptCounts),
        mostAppliedUserWins: userWinCounts.length,
        mostAppliedComputerWins: computerWinCounts.length,
        maxUserWins: Math.max(...userWinCounts, 0),
        maxComputerWins: Math.max(...computerWinCounts, 0),
        minUserWins: safeMin(userWinCounts),
        minComputerWins: safeMin(computerWinCounts),
        avgUserWins: calculateAverage(userWinCounts),
        avgComputerWins: calculateAverage(computerWinCounts),
        mostFrequentUserWin: calculateMostFrequent(userWinCounts),
        mostFrequentComputerWin: calculateMostFrequent(computerWinCounts),
    };
    console.log('\n------- 통계 -------');
    console.log(`가장 적은 횟수: ${stats.minAttempts}회`);
    console.log(`가장 많은 횟수: ${stats.maxAttempts}회`);
    console.log(`가장 많이 적용된 승리 횟수: ${stats.mostAppliedUserWins}`);
    console.log(`가장 많이 적용된 패배 횟수: ${stats.mostAppliedComputerWins}`);
    console.log(`가장 큰 값으로 적용된 승리 횟수: ${stats.maxUserWins}`);
    console.log(`가장 큰 값으로 적용된 패배 횟수: ${stats.maxComputerWins}`);
    console.log(`가장 적은 값으로 적용된 승리 횟수: ${stats.minUserWins}`);
    console.log(`가장 적은 값으로 적용된 패배 횟수: ${stats.minComputerWins}`);
    console.log(`적용된 승리 횟수 평균: ${stats.avgUserWins}`);
    console.log(`적용된 패배 횟수 평균: ${stats.avgComputerWins}`);
    console.log(`컴퓨터가 가장 많이 승리한 승리 횟수: ${stats.mostFrequentComputerWin}회`);
    console.log(`사용자가 가장 많이 승리한 승리 횟수: ${stats.mostFrequentUserWin}회`);
    console.log('-------------------\n');
    applicationStart();
};

// 애플리케이션 실행
const applicationStart = async (): Promise<void> => {
    const input = await new Promise<string>((resolve) =>
        inputInterface.question(
            '\n게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9를 입력하세요.\n',
            resolve
        )
    );

    if (input === GameState.startGame) {
        await start();
    } else if (input === GameState.showRecords) {
        showRecords();
    } else if (input === GameState.showStats) {
        showStats();
    } else if (input === GameState.endGame) {
        console.log('\n애플리케이션이 종료되었습니다.');
        inputInterface.close();
    } else {
        console.log('잘못된 입력입니다. 1, 2, 3, 9를 입력해주세요.');
        applicationStart(); // 게임 기록을 확인한 후 다시 입력 받기
    }
};

applicationStart();
