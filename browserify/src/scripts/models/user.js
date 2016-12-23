const _first = Symbol("first"),
    _last = Symbol("last"),
    _id = Symbol("id");

export class User {
    get id() { return this[_id]; }
    get first() { return this[_first]; }
    get last() { return this[_last]; }
    
    constructor(id, first, last) {
        this[_id] = id;
        this[_first] = first;
        this[_last] = last;
    }
    
    toString() {
        return `${this.id}: ${this.first} ${this.last}`;
    }
}