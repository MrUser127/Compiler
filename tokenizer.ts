export interface Token {
    value: string;
    type: TokenType;
}

export enum TokenType {
    Number,
    Identifier,
    Equals,
    BinaryOperator,
    VariableDeclaration,
    OpenParen,
    CloseParen,
    EOF,
}

const keywordToTokenType = new Map<string, TokenType>([["let", TokenType.VariableDeclaration]]);

function createToken(value = "", type: TokenType): Token {
    return { value, type };
}

function isNumber(value: string): boolean {
    return !isNaN(parseFloat(value));
}

function isAlphabetic(value: string): boolean {
    return /^[a-zA-Z]+$/.test(value);
}

function isWhitespace(value: string): boolean {
    return value === " " || value === "\n" || value === "\t";
}

export function tokenize(input: string): Token[] {
    const tokens = new Array<Token>();
    const currentInput = input.split("");

    while (currentInput.length > 0) {
        if (currentInput[0] === "(") {
            tokens.push(createToken(currentInput.shift(), TokenType.OpenParen));
        } else if (currentInput[0] === ")") {
            tokens.push(createToken(currentInput.shift(), TokenType.CloseParen));
        } else if (
            currentInput[0] === "+" ||
            currentInput[0] === "-" ||
            currentInput[0] === "*" ||
            currentInput[0] === "/" ||
            currentInput[0] === "%"
        ) {
            tokens.push(createToken(currentInput.shift(), TokenType.BinaryOperator));
        } else if (isNumber(currentInput[0])) {
            let number = "";
            while (currentInput.length > 0 && isNumber(currentInput[0])) {
                number += currentInput.shift();
            }
            tokens.push(createToken(number, TokenType.Number));
        } else if (currentInput[0] == "=") {
            tokens.push(createToken(currentInput.shift(), TokenType.Equals));
        } else if (isAlphabetic(currentInput[0])) {
            let identifier = "";
            while (currentInput.length > 0 && isAlphabetic(currentInput[0])) {
                identifier += currentInput.shift();
            }

            const keywordType = keywordToTokenType.get(identifier);
            if (keywordType) {
                tokens.push(createToken(identifier, keywordType));
            } else {
                tokens.push(createToken(identifier, TokenType.Identifier));
            }
        } else if (isWhitespace(currentInput[0])) {
            currentInput.shift();
        } else {
            throw new Error(`Unexpected character: ${currentInput[0]}`);
        }
    }

    tokens.push(createToken("", TokenType.EOF));
    return tokens;
}
