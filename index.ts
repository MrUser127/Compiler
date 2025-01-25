import { tokenize } from "./tokenizer.ts";

const tokens = tokenize("skibidi something chat 1 chill (2 rizz 3)");

for (const token of tokens) {
    console.log(token);
}
