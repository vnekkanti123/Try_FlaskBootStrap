function submitLogin() {
    $(".progress").removeClass("hide");
    var mobile = $("#mobileNumber").val();
    var password = $("#password").val();
    if (!mobile || !password) {
      M.toast({html: 'Please enter your login details.'});
      $("#mobileNumber").addClass("invalid");
      $("#password").addClass("invalid");
      $(".progress").addClass("hide");
      return;
    } else {
      $("#mobileNumber").addClass("valid");
      $("#password").addClass("valid");
      const headers = {
        "Content-Type": "application/json",
      };
      const payload = {
        phone_number: mobile,
        password: password,
      };
      $.ajax({
        url: "/login",
        type: "POST",
        headers: headers,
        data: JSON.stringify(payload),
        success: function(response) {
          sessionStorage.setItem("access_token", response.access_token);
          sessionStorage.setItem("username", response.userName);
          window.location.href = "/admin/dashBoard"
        },
        error: function(xhr, status, error) {
          M.toast({html: 'Please check mobile number or password was incorrect.'});
          $("#mobileNumber").addClass("invalid");
          $("#password").addClass("invalid");
          $(".progress").addClass("hide");
          return;
        },
      });
    }
  }