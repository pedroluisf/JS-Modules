import {UsersStore} from "./models/users-store";
import usersController from "./controllers/users-controller";
import * as blegh from "./lib/util";
import "./script";
import $ from "jquery";

import "../styles/site.less";
import "jquery-ui/themes/ui-darkness/jquery-ui.css"

console.log("LOADING APPLICATION");

const store = new UsersStore();
const $mount = $("#mount");
usersController($mount, store);

blegh.func1();
blegh.func2();

console.log(`We are in ${env} mode`);