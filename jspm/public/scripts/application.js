import {UsersStore} from "./models/users-store";
import usersController from "./controllers/users-controller";
import * as blegh from "./lib/util";
import "./script";
import $ from "jquery";

import "jquery-ui/themes/ui-darkness/jquery-ui.css!"; // the ! at the end signals JSPM to use a loader (in this case css loader)

console.log("LOADING APPLICATION");

const store = new UsersStore();
const $mount = $("#mount");
usersController($mount, store);

blegh.func1();
blegh.func2();