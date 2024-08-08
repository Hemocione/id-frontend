function setCookie(cname, cvalue, exdays, domain = "hemocione.com.br") {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  const _domain = domain ? "domain=" + domain + ";" : "";
  document.cookie = `${cname}=${cvalue};${expires};${_domain}path=/`;
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

function deleteCookie(name, domain = "hemocione.com.br") {
  if (!getCookie(name)) return;
  // delete cookie by setting the expiration date to a past date
  const _domain = domain ? "domain=" + domain + ";" : "";
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${_domain}path=/`;
}

export { setCookie, getCookie, deleteCookie };
