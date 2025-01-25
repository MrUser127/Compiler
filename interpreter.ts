import { NullValue, NumberValue, RuntimeValue, ValueType } from "./values.ts";
import { NumericLiteral, Statement, BinaryExpression, Program } from "./ast.ts";

export function evaluate(astNode: Statement): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number",
            } as NumberValue;

        case "NullLiteral":
            return { value: "null", type: "null" } as NullValue;

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression);

        case "Program":
            return evaluateProgram(astNode as Program);

        default:
            throw new Error("Unknown AST node");
    }
}

function evaluateBinaryExpression(expression: BinaryExpression): RuntimeValue {
    const lhs = evaluate(expression.left);
    const rhs = evaluate(expression.right);

    if (lhs.type == "number" && rhs.type == "number") {
        return evaluateNumericBinaryExpression(lhs as NumberValue, rhs as NumberValue, expression.operator);
    }

    return { type: "null", value: "null" } as NullValue;
}

function evaluateNumericBinaryExpression(lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue {
    let result: number;

    if (operator == "+") {
        result = lhs.value + rhs.value;
    } else if (operator == "-") {
        result = lhs.value - rhs.value;
    } else if (operator == "*") {
        result = lhs.value * rhs.value;
    } else if (operator == "/") {
        result = lhs.value / rhs.value;
    } else if (operator == "%") {
        result = lhs.value % rhs.value;
    } else {
        throw new Error("Unknown operator");
    }

    return { value: result, type: "number" };
}

function evaluateProgram(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue;

    for (let statement of program.body) {
        lastEvaluated = evaluate(statement);
    }

    return lastEvaluated;
}
