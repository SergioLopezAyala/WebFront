export class GatewayDto{
    constructor(
        public type?: string,
        public archIds?: number[],
        public conditionsJson?: string
    ){}
}