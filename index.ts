import * as readline from 'readline';

const CONFIG = {
    NUMBER_LENGTH: 3,
    START_GAME: '1',
    END_GAME: '9',
    ANSWER: '3스트라이크',
} as const;

const inputInterface = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout
});

const generateThreeRandomNumber = (): number[] => {
    const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const shuffledArray = numberArray.sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, CONFIG.NUMBER_LENGTH); 
};

const getUserInput = () : Promise<number[]> => {
    return(
        new Promise<number[]>((resolve) =>
            inputInterface.question('숫자를 입력해주세요: ', (userInput) =>
                resolve(userInput.split('').map(Number))
            )
        )
    )
}

const isValidInput = (userNumber : number[]) : boolean => {
    return (
        userNumber.length === CONFIG.NUMBER_LENGTH &&
        !userNumber.includes(0) &&
        new Set(userNumber).size === CONFIG.NUMBER_LENGTH
    );
}

const getStrikeNumber = (randomNumber: number[], userNumber: number[]): number => {
    let strikeCount = 0;

    randomNumber.map((number, index) => {
        if (number === userNumber[index]) {
            strikeCount++;
        }
    });

    return strikeCount;
}

const getBallNumber = (randomNumber: number[], userNumber: number[]): number => {
    let ballCount = 0;

    randomNumber.map((number, index) => {
        if (number !== userNumber[index] && userNumber.includes(number)) {
            ballCount++;
        }
    });

    return ballCount;
}

const getHintMessage = (randomNumber: number[], userNumber: number[]) : string => {
    const strikeNumber = getStrikeNumber(randomNumber, userNumber);
    const ballNumber = getBallNumber(randomNumber, userNumber);

    if (strikeNumber === 0 && ballNumber === 0) {
        return '낫싱';
    } else if (strikeNumber === 0 && ballNumber !== 0) {
        return `${ballNumber}볼`;
    } else if (strikeNumber !== 0 && ballNumber === 0) {
        return `${strikeNumber}스트라이크`;
    } else {
        return `${ballNumber}볼 ${strikeNumber}스트라이크`;
    }
}

async function gameStart(): Promise<void> {
    const randomNumber = generateThreeRandomNumber(); //
    console.log('\n컴퓨터가 숫자를 뽑았습니다.\n');

    while (true) {
        const userNumber = await getUserInput();

        if (isValidInput(userNumber)) {
            const hint = getHintMessage(randomNumber, userNumber);
            console.log(hint);

            if (hint === CONFIG.ANSWER) {
                console.log('\n3개의 숫자를 모두 맞히셨습니다.\n-------게임 종료-------\n');
                break;
            }
        } else {
            console.log(
                '1~9까지의 숫자 중에서 서로 다른 세자리 수를 입력하세요.\n'
            );
            continue;
        }
    }
}

async function applicationStart(): Promise<void> {
    while (true) {
        const input = await new Promise<string>((resolve) => inputInterface.question(
            '게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n', resolve
        ));

        if (input === CONFIG.START_GAME) {
            await gameStart();
        } else if (input === CONFIG.END_GAME) {
            console.log('\n애플리케이션이 종료되었습니다.');
            inputInterface.close();
            break;
        } else {
            console.log('\n잘못된 입력입니다. 1 또는 9를 입력해주세요.\n');
        }
    }
}

applicationStart();
