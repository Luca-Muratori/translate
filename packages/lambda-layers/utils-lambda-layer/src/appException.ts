export class MissingEnvironmentVariable extends Error{
    constructor(variableName: string){
        super(`Environment variable not passed: ${variableName}`)
    }
}
export class MissingBodyData extends Error{
    constructor(){
        super(`Body data missing`)
    }
}
export class MissingParameters extends Error{
    constructor(parameterName: string){
        super(`Parameter not passed: ${parameterName}`)
    }
}