import _ from "lodash";
import {User} from "./user";

const _users = Symbol("users");

export class UsersStore {
    get users() { return this[_users].slice(); }
    
    constructor() {
        this[_users] = [
            new User(1, "Pedro", "Ferreira"),
            new User(2, "Foo", "Bar")
        ];
    }
    
    add(first, last) {
        const nextId = _.max(this[_users], u => u.id).id + 1;
        const user = new User(nextId, first, last);
        this[_users].push(user);
        return user;
    }
    
    remove(id) {
        _.remove(this[_users], u => u.id == id);
    }
}