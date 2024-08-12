function getAdminUsers() {
    $("#adminLoader").removeClass("hide");
    $("#adminTableContainer").html("");
    if (!token || !username) {
      M.toast({
        html: 'Your session expired. Please login again.'
      });
      window.location.href = "/";
    }
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    };
    const payload = {
      username: username
    };
    let url = "https://khazanapay.net/admin/getUsers";
    $.ajax({
      url: url,
      type: "GET",
      data: JSON.stringify(payload),
      headers: headers,
      success: function(response) {
        $("#adminLoader").addClass("hide");
        createAdminUserTable(response);
      },
      error: function(xhr, status, error) {
        M.toast({
          html: 'Your session expired. Please login again.'
        });
        window.location.href = "/";
        if (xhr.responseJSON && xhr.responseJSON.errorMsg) {
          var errorMessage = xhr.responseJSON.errorMsg;
          console.log("Error message from backend:", errorMessage);
        }
      },
    });
  }

  function createAdminUserTable(data) {
    var activeUserCount = 0;
    var unActiveUserCount = 0;
    var activeUsersTotalWallet = 0;
    var inActiveTotalWallet = 0;
    if (data) {
      let headers = ["User Name", "First Name", "Last Name", "Phone No.", "Wallet", "Status"];

      let $table = $('<table class=" centered highlight" id="adminUsersTable"></table>');
      let $headerRow = $('<thead class="tabelheader"></thead>');
      let $headerRowContent = $("<tr></tr>");

      headers.forEach(function(headerText) {
          $headerRowContent.append($("<th></th>").text(headerText));
      });
      $headerRow.append($headerRowContent);
      $table.append($headerRow);

      let $tableBody = $("<tbody></tbody>");
      var dataObj = data;
      dataObj.forEach(function(transaction) {
          let $row = $("<tr></tr>");
          $row.append($("<td></td>").text(transaction["username"]));
          $row.append($("<td></td>").text(transaction["first_name"]));
          $row.append($("<td></td>").text(transaction["last_name"]));
          $row.append($("<td></td>").text(transaction["phone_number"]));
          $row.append($("<td></td>").text(transaction["payout_wallet"]));
          var status = transaction["kyc_status"];
          if (status == "True"){
            $row.append($("<td></td>").text("Active"));
            activeUsersTotalWallet += parseFloat(transaction["payout_wallet"]);
            activeUserCount++;
          } else {
            $row.append($("<td></td>").text("Not Active"));
            inActiveTotalWallet += parseFloat(transaction["payout_wallet"]);
            unActiveUserCount++;
          }
          $tableBody.append($row);
      });
      $table.append($tableBody);
      $("#adminTableContainer").append($table);

      // Initialize DataTable
      $('#adminUsersTable').DataTable({
        paging: true, // Enable pagination
        searching: true, // Enable search
        ordering: false, // Enable column ordering
        pageLength: 5, // Set the number of rows per page
        responsive: true
      });
    } else {
      $("#adminTableContainer").append("<p>No transactions found.</p>");
    }
  }

  function getWalletHistory() {
    $("#walletLoader").removeClass("hide");
    if (!token || !username) {
      M.toast({
          html: 'Your session expired. Please login again.'
        });
        window.location.href = "/";
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
    const payload = {
        username: username
    };
    let url = "https://khazanapay.net/admin/getWalletHistory";
    $.ajax({
        url: url,
        type: "GET",
        data: JSON.stringify(payload),
        headers: headers,
        success: function(response) {
            $("#walletLoader").addClass("hide");
            createWalletHistoryTable(response);
        },
        error: function(xhr, status, error) {
          M.toast({
            html: 'Your session expired. Please login again.'
          });
          window.location.href = "/";
            if (xhr.responseJSON && xhr.responseJSON.errorMsg) {
                var errorMessage = xhr.responseJSON.errorMsg;
                console.log("Error message from backend:", errorMessage);
            }
        },
    });
}



function createWalletHistoryTable(data) {
  data.reverse();
  var rechargeCount = 0;
  var refoundCount = 0;
  var totalRechargeAmount = 0;
  var totalRefoundAmount = 0;
  if (data) {
      let headers = ["Username", "Amount", "Transaction Type", "Reason", "Date"];

      let $table = $('<table class="centered highlight" id="walletHistoryTable"></table>');
      let $headerRow = $('<thead class="tabelheader"></thead>');
      let $headerRowContent = $("<tr></tr>");

      headers.forEach(function(headerText) {
          $headerRowContent.append($("<th></th>").text(headerText));
      });
      $headerRow.append($headerRowContent);
      $table.append($headerRow);

      let $tableBody = $("<tbody></tbody>");
      var dataObj = data;
      dataObj.forEach(function(transaction) {
          let $row = $("<tr></tr>");
          $row.append($("<td></td>").text(transaction["username"]));
          $row.append($("<td></td>").text(transaction["amount"]));
          var transaction_type = transaction["transaction_type"];
          var amount = transaction["amount"];
          if (transaction_type == "RECHARGE") {
            totalRechargeAmount += parseFloat(amount);
            rechargeCount++;
          } else {
            totalRefoundAmount +=  parseFloat(amount);
            refoundCount++;
          }
          $row.append($("<td></td>").text(transaction_type));
          $row.append($("<td></td>").text(transaction["reason"]));
          const date = moment(transaction["date_time"]);
          const formattedDate = date.tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
           $row.append($("<td></td>").text(formattedDate));
          $tableBody.append($row);
      });
      $table.append($tableBody);
      // Initialize DataTable
      $("#walletTableContainer").append($table);
      $('#walletHistoryTable').DataTable({
          "pageLength": 5,
          "ordering": false, 
          "lengthMenu": [ // Options available in the "Show entries" dropdown
            [5, 10, 25, 50, 100, 500, 1000], // Values that determine page length
            [5, 10, 25, 50, 100, 500, "All"] // Display text for each value
        ]
      });
      $(".rechargeCount").html(rechargeCount);
      $(".totalRechargeAmount").html(totalRechargeAmount);
      $(".refoundCount").html(refoundCount);
      $(".totalRefoundAmount").html(totalRefoundAmount);

  } else {
      $("#walletTableContainer").append("<p>No transactions found.</p>");
  }
}
