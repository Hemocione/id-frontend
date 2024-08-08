function setCookie(cname, cvalue, exdays, domain) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  let _domain = "domain=" + domain;
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";" + _domain + ";" + ";path=/";
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
  return undefined;
}

function deleteCookie(name) {
  if (!getCookie(name)) return;
  // delete cookie by setting the expiration date to a past date
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export { setCookie, getCookie, deleteCookie };
