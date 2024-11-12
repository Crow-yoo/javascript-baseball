import * as readline from 'readline';

const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout
});

// 서로 다른 세자리 수 생성 함수 (랜덤값)
function generateThreeUniqueDigits(): number[] {
    const randomNumbers: number[] = [];

    while (randomNumbers.length < 3) {
        const num = Math.floor(Math.random() * 9 + 1);

        if (!randomNumbers.includes(num))
            randomNumbers.push(num);
    }
    return randomNumbers;
}

// 스트라이크, 볼, 낫싱 계산 함수
function calculateStrikeOrBall(computerNumber: number[], userNumber: number[]): [number, number] {
    let strikes: number = 0;
    let balls: number = 0;
    let digit = 0;
    while (digit < 3) {
        if (computerNumber[digit] === userNumber[digit]) {
            strikes++;
        } else if(computerNumber.includes(userNumber[digit])) {
            balls++;
        }
        digit++;
    }
    return [strikes, balls];
}

// 결과 출력 함수
function getHintMessage(computerNumber: number[], userNumber: number[]) : string {
    const [strikes, balls] = calculateStrikeOrBall(computerNumber, userNumber);

    if (strikes === 0 && balls === 0) {
        return '낫싱';
    } else if (strikes === 0 && balls !== 0) {
        return `${balls}볼`;
    } else if (strikes !== 0 && balls === 0) {
        return `${strikes}스트라이크`;
    } else {
        return `${balls}볼 ${strikes}스트라이크`;
    }
}

// 입력 유효성 검사
function isValidInput(userNumber : number[]) : boolean {
    return (
        userNumber.length === 3 &&
        !userNumber.includes(0) &&
        new Set(userNumber).size === 3
    );
}

// 사용자 입력 함수
function getUserInput() : Promise<number[]> {
    return(
        new Promise<number[]>((resolve) =>
            rl.question('숫자를 입력해주세요: ', (userInput) =>
                resolve(userInput.split('').map(Number))
            )
        )
    )
}

// 게임 시작 함수
async function gameStart(): Promise<void> {
    const computerNumber = generateThreeUniqueDigits(); //
    console.log('\n컴퓨터가 숫자를 뽑았습니다.\n');
    while (true) {
        const userNumber = await getUserInput();

        if (!isValidInput(userNumber)) {
            console.log(
                '1~9까지의 숫자 중에서 서로 다른 세자리 수를 입력하세요.\n'
            );
            continue;
        }
        const hint = getHintMessage(computerNumber, userNumber);
        console.log(hint);

        if (hint === '3스트라이크') {
            console.log('\n3개의 숫자를 모두 맞히셨습니다.\n-------게임 종료-------\n');
            break;
        }
    }
}

// 애플리케이션 실행 함수
async function applicationStart(): Promise<void> {

    while (true) {
        const input = await new Promise<string>((resolve) => rl.question(
            '게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n', resolve
        ));

        if (input === '1') {
            await gameStart();
        } else if (input === '9') {
            console.log('\n애플리케이션이 종료되었습니다.');
            rl.close();
            break;
        } else {
            console.log('\n잘못된 입력입니다. 1 또는 9를 입력해주세요.\n');
        }
    }
}

applicationStart();
