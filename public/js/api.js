function login() {
  let userid = document.getElementById("form2Example1").value;
  let password = document.getElementById("form2Example2").value;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    eid: userid,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/auth/login", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        //Redirect to dashboard
        window.location.href = "http://localhost:5000/orders";
      } else {
        document.getElementById("loginresponse").innerHTML =
          "<div class='alert alert-danger'><strong>Error!</strong> " +
          result.error +
          "</div>";
      }
    })
    .catch((error) => console.log("error", error));
}

function logout() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/auth/logout", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        //Redirect to dashboard
        window.location.href = "http://localhost:5000";
      } else {
        alert(result.error);
      }
    })
    .catch((error) => console.log("error", error));
}

function processorder(status, count) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    order_id: "" + Math.floor(Math.random() * 100000) + 10000,
    order_status: "" + status,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/order/processorder", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success && result.is_incentive_eligible == 1) {
        document.getElementById("deliverMore").innerHTML =
          '<div><button onclick="getrewards()"><i class="bi bi-star"></i>' +
          result.msg +
          '<i class="bi bi-caret-right"></i></button></div>';
      } else {
        document.getElementById("deliverMore").innerHTML =
          '<div><i class="bi bi-star"></i>' +
          result.msg +
          '<i class="bi bi-caret-right"></i></div>';
      }

      if (result.success) {
        if (status == "6") {
          document.getElementById("delivered").innerText =
            parseInt(count.innerText) + 1;
        } else {
          document.getElementById("returned").innerText =
            parseInt(count.innerText) + 1;
        }
      }
    })
    .catch((error) => console.log("error", error));
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getrewards() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/rewards/getreward", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        document.getElementById("cardtext").innerText = result.incentive_won;
        if (result.is_cash === 1) {
          //increment total value in master
        } else {
        }
      } else {
        alert(result.error);
      }
    })
    .catch((error) => console.log("error", error));
}

function loginadmin() {
  let userid = document.getElementById("form2Example1").value;
  let password = document.getElementById("form2Example2").value;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    eid: userid,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/auth/loginadmin", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        //Redirect to dashboard
        window.location.href = "http://localhost:5000/configuration";
      } else {
        document.getElementById("loginresponse").innerHTML =
          "<div class='alert alert-danger'><strong>Error!</strong> " +
          result.error +
          "</div>";
      }
    })
    .catch((error) => console.log("error", error));
}

function scratch(id, msg) {
  var htmlcode =
    "<div class='container' id='js-container'><canvas class='canvas' id='js-canvas' width='300' height='300'></canvas><form class='form' style='text-align: center;'><h1 style='margin-top: 30%;'>" +
    msg +
    "</h1><button type='button' class='btn btn-primary' style='margin-top: 10%;' onclick=redeem('" +
    id +
    "')>Redeem</button></form></div>";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlcode;

  swal({
    title: "Reward",
    text: "Scratch Card",
    content: wrapper,
  });
  ("use strict");

  var isDrawing, lastPoint;
  var container = document.getElementById("js-container"),
    canvas = document.getElementById("js-canvas"),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext("2d"),
    image = new Image(),
    brush = new Image();
  // base64 Workaround because Same-Origin-Policy
  image.src =
    "data:image/jpeg;base64,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";
  image.onload = function () {
    ctx.drawImage(image, 0, 0);
    // Show the form when Image is loaded.
    document.querySelectorAll(".form")[0].style.visibility = "visible";
  };
  brush.src =
    "data:image/png;base64,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";

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("touchstart", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("touchmove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);
  canvas.addEventListener("touchend", handleMouseUp, false);

  function distanceBetween(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }

  // Only test every `stride` pixel. `stride`x faster,
  // but might lead to inaccuracy
  function getFilledInPixels(stride) {
    if (!stride || stride < 1) {
      stride = 1;
    }

    var pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
      pdata = pixels.data,
      l = pdata.length,
      total = l / stride,
      count = 0;

    // Iterate over all pixels
    for (var i = (count = 0); i < l; i += stride) {
      if (parseInt(pdata[i]) === 0) {
        count++;
      }
    }

    return Math.round((count / total) * 100);
  }

  function getMouse(e, canvas) {
    var offsetX = 0,
      offsetY = 0,
      mx,
      my;

    if (canvas.offsetParent !== undefined) {
      do {
        offsetX += canvas.offsetLeft;
        offsetY += canvas.offsetTop;
      } while ((canvas = canvas.offsetParent));
    }

    mx = (e.pageX || e.touches[0].clientX) - offsetX;
    my = (e.pageY || e.touches[0].clientY) - offsetY;

    return { x: mx, y: my };
  }

  function handlePercentage(filledInPixels) {
    filledInPixels = filledInPixels || 0;
    console.log(filledInPixels + "%");
    if (filledInPixels > 50) {
      canvas.parentNode.removeChild(canvas);
    }
  }

  function handleMouseDown(e) {
    isDrawing = true;
    lastPoint = getMouse(e, canvas);
  }

  function handleMouseMove(e) {
    if (!isDrawing) {
      return;
    }

    e.preventDefault();

    var currentPoint = getMouse(e, canvas),
      dist = distanceBetween(lastPoint, currentPoint),
      angle = angleBetween(lastPoint, currentPoint),
      x,
      y;

    for (var i = 0; i < dist; i++) {
      x = lastPoint.x + Math.sin(angle) * i - 25;
      y = lastPoint.y + Math.cos(angle) * i - 25;
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(brush, x, y);
    }

    lastPoint = currentPoint;
    handlePercentage(getFilledInPixels(32));
  }

  function handleMouseUp(e) {
    isDrawing = false;
  }
}

function redeem(id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    incentiveid: id,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/rewards/redeem", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        //Redirect to dashboard
        window.location.href = "http://localhost:5000/rewards";
      } else {
        alert(result.error);
      }
    })
    .catch((error) => console.log("error", error));
}

function editconf(rewardId){
  let inputField = document.getElementById(rewardId);
  let editButton = document.getElementById("edit"+rewardId);
  inputField.removeAttribute('disabled');
  inputField.style.border = "1";
  inputField.focus();
  editButton.innerText = "Save";
  editButton.setAttribute("onclick", "saveconf('"+rewardId+"')");
}

function saveconf(rewardId){
  let rewardTrigger = document.getElementById(rewardId).value;
  // let editButton = document.getElementById("edit"+rewardId);
  //inputField.setAttribute("disabled","disabled");  
  //editButton.innerText = "Edit";
  //editButton.setAttribute("onclick", "editconf('"+rewardId+"')");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    rewardId,
    rewardTrigger
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5000/api/v1/configuration/save", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {

      } else {

      }
    })
    .catch((error) => console.log("error", error));
}

function inputFieldOnFocusOut(rewardId){
  setTimeout(function() {
  let inputField = document.getElementById(rewardId);
  let editButton = document.getElementById("edit"+rewardId);
  inputField.setAttribute("disabled","disabled");
  editButton.innerText = "Edit";
  editButton.setAttribute("onclick", "editconf('"+rewardId+"')");
}, 300);
}