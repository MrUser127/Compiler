import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, NullLiteral } from "./ast.ts";
import { tokenize, Token, TokenType } from "./tokenizer.ts";

export default class Parser {
    private tokens: Token[] = [];

    public buildAST(input: string): Program {
        this.tokens = tokenize(input);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.tokens[0].type !== TokenType.EOF) {
            program.body.push(this.parseStatement());
        }

        return program;
    }

    private getCurrentToken(): Token {
        return this.tokens.shift() as Token;
    }

    private parseStatement(): Statement {
        return this.parseExpression();
    }

    private parseExpression(): Expression {
        return this.parseAdditiveExpression();
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression();

        while (this.tokens[0].value === "+" || this.tokens[0].value === "-") {
            const operator = this.getCurrentToken().value;
            const right = this.parseMultiplicativeExpression();
            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right,
            } as BinaryExpression;
        }

        return left;
    }

    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression();

        while (this.tokens[0].value === "*" || this.tokens[0].value === "/" || this.tokens[0].value === "%") {
            const operator = this.getCurrentToken().value;
            const right = this.parsePrimaryExpression();
            left = {
                kind: "BinaryExpression",
                operator,
                left,
                right,
            } as BinaryExpression;
        }

        return left;
    }

    private parsePrimaryExpression(): Expression {
        const token = this.tokens[0].type;

        switch (token) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.getCurrentToken().value } as Identifier;
            case TokenType.Null:
                this.getCurrentToken();
                return { kind: "NullLiteral", value: "null" } as NullLiteral;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.getCurrentToken().value) } as NumericLiteral;
            case TokenType.OpenParen:
                this.getCurrentToken();
                const expression = this.parseExpression();
                if (this.tokens[0].type !== TokenType.CloseParen) {
                    throw new Error("Expected closing parenthesis");
                }
                this.getCurrentToken();
                return expression;
            default:
                throw new Error(`Unexpected token: ${token}`);
        }
    }
}
