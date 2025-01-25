import { RuntimeValue } from "./values.ts";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parentENV?: Environment) {
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVar(varname: string, value: RuntimeValue, constant: boolean): RuntimeValue {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname}. As it already is defined.'`;
        }

        this.variables.set(varname, value);

        if (constant) {
            this.constants.add(varname);
        }

        return value;
    }

    public assignVar(name: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(name);
        if (env.constants.has(name)) {
            throw `Cannot assign to constant variable ${name}.`;
        }
        env.variables.set(name, value);
        return value;
    }

    public lookupVar(name: string): RuntimeValue {
        const env = this.resolve(name);
        return env.variables.get(name) as RuntimeValue;
    }

    public resolve(name: string): Environment {
        if (this.variables.has(name)) {
            return this;
        }

        if (this.parent == undefined) {
            throw `Variable ${name} is not defined.`;
        }

        return this.parent.resolve(name);
    }
}
