import {UsersStore} from "./models/users-store";
import usersController from "./controllers/users-controller";
import * as blegh from "./lib/util";
import "./script";
import $ from "jquery";

console.log("LOADING APPLICATION");

const store = new UsersStore();
const $mount = $("#mount");
usersController($mount, store);

blegh.func1();
blegh.func2();