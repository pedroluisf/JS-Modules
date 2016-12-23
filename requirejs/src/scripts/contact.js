import _ from "lodash";
import $ from "jquery";

const array = [1,2,3,4];

_.each(array, i => $(`<span>${i}</span>`).appendTo("body"));

console.log("CONTACT");