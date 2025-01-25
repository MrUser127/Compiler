import { tokenize } from "./tokenizer.ts";

const tokens = tokenize("let something = 1 + (2 * 3)");

for (const token of tokens) {
    console.log(token);
}
