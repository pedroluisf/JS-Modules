import $ from "jquery";
import "jquery-ui";
import _ from "lodash";

import {APPLICATION_NAME} from "../lib/constants";

export default function usersController($mount, usersStore) {
    $mount.empty();
    
    const $parent = $(`
        <div class='users-controller'>
            <h1>${APPLICATION_NAME}</h1>
            <ul class='users-list' />
            <a href='#' class='add-user'>Add User</a>
        </div>
    `).appendTo($mount);
    
    const $userList = $parent.find(".users-list"),
        $addUserButton = $parent.find(".add-user");
        
    function createUserRow(user) {
        const $row = $("<li />")
            .text(user.toString())
            .click(() => {
                $("<div title='Confirm'>Are you sure</div>").dialog({
                    modal: true,
                    buttons: {
                        Delete() {
                            usersStore.remove(user.id);
                            $row.remove();
                            $(this).dialog("close");
                        },
                        
                        Cancel() {
                            $(this).dialog("close");
                        }
                    }
                });
            })
            .appendTo($userList);
            
        return $row;
    }
    
    $addUserButton
        .click(e => {
            e.preventDefault();
            createUserRow(usersStore.add("FIRST", "LAST"));
        })
        .appendTo($parent);
		
	_.each(usersStore.users, u => createUserRow(u));
		
    return {
        destroy() {
            $parent.remove();
        }
    };
}