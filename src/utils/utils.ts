export class Guid {
    public static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r, v;
            r = Math.random() * 16 | 0;
            v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16)
        });
    }
}

export class Randomizer {
    public static randomInRange(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }
}