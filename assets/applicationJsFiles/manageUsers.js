
function getUserDetails() {
    $("#manageLoader").removeClass("hide");
    $("#userDetailsTableContainer").html("");
    let url = "https://khazanapay.net/admin/getUsers";
    const headers = {
        "Authorization": "Bearer " + access_token,
    };

    $.ajax({
        url: url,
        type: "GET",
        headers: headers,
        success: function(response) {
            var userList = response;
            usersListPrev = userList;
            $("#manageLoader").addClass("hide");
            createUserDetailsTable(userList);
        },
        error: function(xhr, status, error) {
            alert("Something went wrong. Please login again.");
            window.location.href = "/";
            return;
        },
    });
}


function showHistoryForUser(userName) {
    $("#walletHistoryLoader").removeClass("hide");
    $("#walletDetailsTableContainer").html("");
    let url = "https://khazanapay.net/admin/getWalletHistoryForUser";
    const headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
    };
    const payload = {
        username: userName,
    };

    $.ajax({
        url: url,
        type: "POST",
        headers: headers,
        data: JSON.stringify(payload),
        success: function(response) {
            var userList = response;
            $("#walletHistoryLoader").addClass("hide");
            $(".userNameSpan").text("User Name: " + userName);
            createWalletHistoryTable(userList);
            document.getElementById('walletDetailsTableContainer').scrollIntoView({
                behavior: 'smooth'
            });
        },
        error: function(xhr, status, error) {
            alert("Something went wrong. Please login again.");
            window.location.href = "/";
            if (xhr.responseJSON && xhr.responseJSON.errorMsg) {
                var errorMessage = xhr.responseJSON.errorMsg;
                alert(errorMessage);
            }
            return;
        },
    });
}

function createUserDetailsTable(data) {
    if (data) {
        let headers = ["First Name", "Last Name", "UserName", "Mobile Number", "Wallet Balance", "KYC Status", "Actions", "Wallet History"];

        let $table = $('<table class="highlight" id="userDetailsTable"></table>');

        let $headerRow = $('<thead class="tableheader"></thead>');
        let $headerRowContent = $("<tr></tr>");

        headers.forEach(function(headerText) {
            $headerRowContent.append($("<th></th>").text(headerText));
        });

        $headerRow.append($headerRowContent);
        $table.append($headerRow);

        let $tableBody = $("<tbody></tbody>");
        data.forEach(function(item) {
            let $row = $("<tr></tr>");

            let first_name = item["first_name"];
            let last_name = item["last_name"];
            let username = item["username"];
            let phone_number = item["phone_number"];
            let payout_wallet = item["payout_wallet"];
            let kyc_status = item["kyc_status"];
            let kycForUi = kyc_status === "True" ? "Active" : "Inactive";

            $row.append($("<td></td>").text(first_name));
            $row.append($("<td></td>").text(last_name));
            $row.append($("<td></td>").text(username));
            $row.append($("<td></td>").text(phone_number));
            $row.append($("<td></td>").text(payout_wallet));

            // Create dropdown as a string and set its selected value
            let statusDropDownHtml = `
      <select id="status-${username.replace(/[^a-zA-Z0-9]/g, "_")}" class="browser-default">
        <option value="" disabled>Select status</option>
        <option value="True" ${kyc_status === "True" ? "selected" : ""}>Active</option>
        <option value="False" ${kyc_status === "False" ? "selected" : ""}>Inactive</option>
      </select>
    `;

            $row.append($("<td></td>").html(statusDropDownHtml));
            $row.append($("<td></td>").html("<a class='waves-effect waves-light btn' onclick='updatingUserStatus(\"" + username + "\")'>Update User</a>"));
            $row.append($("<td></td>").html("<a class='waves-effect waves-light btn' id='historyBtn' onclick='showHistoryForUser(\"" + username + "\")'>History</a>"));
            $tableBody.append($row);
        });

        $table.append($tableBody);
        $("#userDetailsTableContainer").html($table);

        // Initialize DataTables
        $('#userDetailsTable').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            pageLength: 5,
        });

        // Attach onChange event handler to dropdowns
        $("#userDetailsTable").on("change", "select[id^='status-']", function() {
            // Get the selected value
            let newStatus = $(this).val();
            // Get the username from the dropdown ID
            let username = $(this).attr("id").replace(/^status-/, "");
            // Call a function to handle the status change (replace with your function)
            updateUserStatus(username, newStatus);
        });
    } else {
        $("#userDetailsTableContainer").html("<p>No Users found.</p>");
    }
}

function updatingUserStatus(userName) {
    var previousUserStatus = "";
    var preWalletBalance = "";
    for (let user of usersListPrev) {
        if (userName === user.username) {
            // Determine KYC status for UI
            const kycForUi = user.kyc_status === "True" ? "Active" : "InActive";
            previousUserStatus = kycForUi;
            // Update form fields
            $("#mobileNumber").val(user.phone_number);
            $("#userName").val(user.username);
            preWalletBalance = user.payout_wallet;
            $("#walletBalance").val(user.payout_wallet);
            $("#currentStatus").val(kycForUi);
            $("#rechargeAmount").val("");
            $("#newStatus").val("");
            $("#transType").val("");

            M.updateTextFields();
            // Exit loop once the user is found
            break;
        }
    }
    if (previousUserStatus === "Active") {
        M.toast({
            html: 'Please do Inactive the user before doing any transaction.'
        });
        return;
    }

    $('#manageUserDetailsModal').modal({
        onOpenEnd: function() {
            console.log('Modal opened. Previous status:', previousUserStatus);
        },
        onCloseEnd: function() {
            if (preWalletBalance != $("#walletBalance").val()) {
                location.reload();
            }
        }
    });

    $('#manageUserDetailsModal').modal('open');
}

$("#transType").on("change", function() {
    var selectval = $(this).val();
    if (selectval == "Credit") {
        $(".rechargeBtn").html("Credit");
    } else if (selectval == "Debit") {
        $(".rechargeBtn").html("Debit");
    }
});

function updateUserStatus(userName, selectVal) {
    let url = "https://khazanapay.net/admin/updateKyc";
    const headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
    };
    const payload = {
        username: userName,
        KYC_Status: selectVal,
    };
    $.ajax({
        url: url,
        type: "POST",
        headers: headers,
        data: JSON.stringify(payload),
        success: function(response) {
            location.reload();
        },
        error: function(xhr, status, error) {
            alert("Something went wrong. Please try again or please login again and try.");
            if (xhr.responseJSON && xhr.responseJSON.errorMsg) {
                var errorMessage = xhr.responseJSON.errorMsg;
                alert(errorMessage);
            }
            return;
        },
    });

}

function creditOrDebitUserWallet() {
    var currentStatus = $("#currentStatus").val();
    var rechargeAmount = $("#rechargeAmount").val();
    var transType = $("#transType").val();
    $("#rechargeAmount").removeClass("invalid");
    if (!$(".progress").hasClass("hide")) {
        $(".progress").addClass("hide");
    }

    if (currentStatus === "Active") {
        M.toast({
            html: 'Please inactive the user before doning any transactions.'
        });
        return;
    } else if (!rechargeAmount) {
        M.toast({
            html: 'Please enter valid amount.'
        });
        $("#rechargeAmount").addClass("invalid");
        return;
    } else if (rechargeAmount < 0) {
        M.toast({
            html: 'Please enter recharge amount greaterthan zero.'
        });
        $("#rechargeAmount").addClass("invalid");
        return;
    } else if (transType === "Credit") {
        if (isProcessing) {
            M.toast({
                html: 'Please wait your previous transaction is processing.'
            });
            return;
        }
        $(".progress").removeClass("hide");
        isProcessing = true;
        let url = "https://khazanapay.net/admin/rechargeWallet";
        const headers = {
            "Authorization": "Bearer " + access_token,
            "Content-Type": "application/json",
        };
        const payload = {
            username: $("#userName").val(),
            amount: rechargeAmount
        };

        $.ajax({
            url: url,
            type: "POST",
            headers: headers,
            data: JSON.stringify(payload),
            success: function(response) {
                isProcessing = false;
                $(".progress").addClass("hide");
                M.toast({
                    html: 'Recharged successfully.'
                });
                setTimeout(function() {
                    location.reload();
                }, 1000);
            },
            error: function(xhr, status, error) {
                $(".progress").addClass("hide");
                isProcessing = false;
                alert("Something went wrong. Please login again.");
                window.location.href = "/";
                return;
            },
        });
    } else {

        if (!transType) {
            M.toast({
                html: 'Please select transaction type'
            });
        } else {
            M.toast({
                html: 'Debit action is under development.'
            });
        }
    }

}


function createWalletHistoryTable(data) {
    data.reverse();
    if (data) {
        let headers = ["Id", "User Name", "Client Id", "Amount", "Transaction Type", "Date", "Reason"];

        let $table = $('<table class="highlight" id="walletHistoryTable"></table>');

        let $headerRow = $('<thead class="tabelheader"></thead>');
        let $headerRowContent = $("<tr></tr>");

        headers.forEach(function(headerText) {
            $headerRowContent.append($("<th></th>").text(headerText));
        });

        $headerRow.append($headerRowContent);
        $table.append($headerRow);

        let $tableBody = $("<tbody></tbody>");
        data.forEach(function(item) {
            let $row = $("<tr></tr>");

            let id = item["id"];
            let username = item["username"];
            let client_id = item["client_id"];
            let amount = item["amount"];
            let transaction_type = item["transaction_type"];
            let date_time = item["date_time"];
            const date = moment(date_time);
            const formattedDate = date.tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
            let reason = item["reason"];

            $row.append($("<td></td>").text(id));
            $row.append($("<td></td>").text(username));
            $row.append($("<td></td>").text(client_id));
            $row.append($("<td></td>").text(amount));
            $row.append($("<td></td>").text(transaction_type));
            $row.append($("<td></td>").text(formattedDate));
            $row.append($("<td></td>").text(reason));
            $tableBody.append($row);
        });

        $table.append($tableBody);
        $("#walletDetailsTableContainer").append($table);

        $table.DataTable({
            paging: true,
            searching: true,
            ordering: true,
            pageLength: 5,
            order: [], // No initial order; displays data as provided
        });
    } else {
        $("#walletDetailsTableContainer").append("<p>No transactions found.</p>");
    }
}