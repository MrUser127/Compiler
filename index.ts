import Parser from "./parser.ts";
import { evaluate } from "./interpreter.ts";
import Environment from "./environment.ts";
import { BooleanValue, NullValue } from "./values.ts";

repl();

async function repl() {
    const parser = new Parser();
    const env = new Environment();

    env.declareVar("true", { value: true, type: "boolean" } as BooleanValue, true);
    env.declareVar("false", { value: false, type: "boolean" } as BooleanValue, true);
    env.declareVar("null", { value: "null", type: "null" } as NullValue, true);

    while (true) {
        const input = prompt("> ");

        if (!input || input.includes("exit")) {
            return;
        }

        try {
            const ast = parser.buildAST(input);
            const result = evaluate(ast, env);
            console.log(result);
        } catch (e) {
            console.error(e);
        }
    }
}
