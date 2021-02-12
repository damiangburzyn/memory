export class Card {
    public backImg: string
    public pairGuid: string
    public frontImg='vue.svg'
    public isFlipped= false;
    constructor(obj: { backImg: string; pairGuid: string }) {
        this.backImg = obj.backImg
        this.pairGuid = obj.pairGuid
    }
}
