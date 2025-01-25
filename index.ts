import Parser from "./parser.ts";
import { evaluate } from "./interpreter.ts";

repl();

async function repl() {
    const parser = new Parser();

    while (true) {
        const input = prompt("> ");

        if (!input || input.includes("exit")) {
            return;
        }

        try {
            const ast = parser.buildAST(input);
            const result = evaluate(ast);
            console.log(result);
        } catch (e) {
            console.error(e);
        }
    }
}
