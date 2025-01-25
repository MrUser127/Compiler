import Parser from "./parser.ts";

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
            console.log(ast);
        } catch (e) {
            console.error(e);
        }
    }
}
