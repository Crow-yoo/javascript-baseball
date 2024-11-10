import * as readline from 'readline';

// 서로 다른 세자리 수 생성 함수 (랜던값)
function generateRandomNumbers(): number[] {
    const randomNumbers: number[] = [];

    while (randomNumbers.length < 3) {
        const num = Math.floor(Math.random() * 9 + 1);

        let checkDuplicate = false;
        let i = 0;
        while (i < randomNumbers.length) {
            if (randomNumbers[i] === num) {
                checkDuplicate = true;
                break;
            }
            i++;
        }

        if (checkDuplicate === false) {
            randomNumbers.push(num);
        }
    }
    return randomNumbers;
}

function getHint(computerNumber: number[], userNumber: number[]): string {
    let strikes: number = 0;
    let balls: number = 0;

    let i = 0;
    while (i < 3) {
        if (computerNumber[i] === userNumber[i]) {
            strikes++;
        } else {
            let j = 0;
            while (j < 3) {
                if (computerNumber[j] === userNumber[i]) {
                    balls++;
                    break;
                }
                j++;
            }
        }
        i++;
    }

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

async function getNumber(rl: readline.Interface): Promise<void> {
    console.log('\n');
    console.log('컴퓨터가 숫자를 뽑았습니다.\n');
    const computerNumber = generateRandomNumbers();

    while (true) {
        const userInput = await new Promise<string>((resolve) =>
            rl.question('숫자를 입력해주세요: ', resolve)
        );

        // 세자리수, 서로다른수, 1~9
        // some()
        // userNumber.some(num => num < 1 || num > 9)

        const userNumber = userInput.split('').map(Number);

        if (
            userNumber.length !== 3 ||
            userNumber.includes(0) ||
            new Set(userNumber).size !== 3
        ) {
            console.log(
                '1~9까지의 숫자 중에서 서로 다른 세자리 수를 입력하세요.\n'
            );
            continue;
        }

        const result = getHint(computerNumber, userNumber);
        console.log(result);

        if (result === '3스트라이크') {
            console.log('\n');
            console.log('3개의 숫자를 모두 맞히셨습니다.');
            console.log('-------게임 종료-------');
            break;
        }
    }
}

async function gameStart(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const input = await new Promise<string>((resolve) =>
            rl.question(
                '게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n',
                resolve
            )
        );

        if (input === '1') {
            await getNumber(rl);
        } else if (input === '9') {
            // console.log('\n');
            console.log('\n애플리케이션이 종료되었습니다.');
            rl.close();
            break;
        } else {
            console.log('잘못된 입력입니다. 1 또는 9를 입력해주세요.');
        }
        console.log('\n');
    }
}

gameStart();
