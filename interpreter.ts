import { NullValue, NumberValue, RuntimeValue, ValueType } from "./values.ts";
import {
    NumericLiteral,
    Statement,
    BinaryExpression,
    Program,
    Identifier,
    VariableDeclaration,
    AssignmentExpression,
} from "./ast.ts";
import Environment from "./environment.ts";

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number",
            } as NumberValue;

        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, env);

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env);

        case "Program":
            return evaluateProgram(astNode as Program, env);

        case "AssignmentExpression":
            return evaluateAssignmentExpression(astNode as AssignmentExpression, env);

        case "VariableDeclaration":
            return evaluateVariableDeclaration(astNode as VariableDeclaration, env);

        default:
            throw new Error("Unknown AST node: " + JSON.stringify(astNode));
    }
}

function evaluateVariableDeclaration(declaration: VariableDeclaration, env: Environment): RuntimeValue {
    const value = declaration.value ? evaluate(declaration.value, env) : ({ type: "null", value: "null" } as NullValue);
    return env.declareVar(declaration.identifier, value, declaration.constant);
}

function evaluateAssignmentExpression(expression: AssignmentExpression, env: Environment): RuntimeValue {
    if (expression.assigne.kind != "Identifier") {
        throw new Error("Expected identifier in assignment expression");
    }

    return env.assignVar((expression.assigne as Identifier).symbol, evaluate(expression.value, env));
}

function evaluateIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
    return env.lookupVar(identifier.symbol);
}

function evaluateBinaryExpression(expression: BinaryExpression, env: Environment): RuntimeValue {
    const lhs = evaluate(expression.left, env);
    const rhs = evaluate(expression.right, env);

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

function evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue;

    for (let statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}
