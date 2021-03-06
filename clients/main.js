const socket = io.connect('http://localhost:3000/notification',{
  withCredentials: true,
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDAwNywiZW1haWwiOiJlbmNoYW50ZXVyQHlvbWVkaWEudm4iLCJwYXNzd29yZCI6IiQyYiQxMCRIRVh2eVdFbGtVVFhGZ00zUUtid1VPakJJTTBTQWtHNlk5WTdqLldyRUtSYi5UNVdWWDFraSIsImZpcnN0TmFtZSI6IkVuY2hhbnRldXIiLCJsYXN0TmFtZSI6IldpcHJvIiwiaXNTdXBlckFkbWluIjpmYWxzZSwiaXNTd2l0Y2hlZEFjY291bnQiOmZhbHNlLCJvcmlnaW5hbEFjY291bnQiOnsiaWQiOjUzMDAwMDAwNiwibmFtZSI6IkVuY2hhbnRldXIiLCJlbWFpbCI6ImVuY2hhbnRldXJAeW9tZWRpYS52biIsInR5cGUiOjMsImFkbWluSWQiOm51bGwsImJyYW5kSWQiOjUzMDAwMDAwNiwiY29tcGFueUlkIjo1MzAwMDAwMDIsIndlYnNpdGUiOm51bGwsInBlcm1pc3Npb25zIjpbIlZpZXcgVXNlciIsIlVwZGF0ZSBVc2VyIiwiVmlldyBDYXRlZ29yeSIsIlZpZXcgRGVmYXVsdCBDYXRlZ29yeSIsIkNyZWF0ZSBEZWZhdWx0IENhdGVnb3J5IiwiVXBkYXRlIERlZmF1bHQgQ2F0ZWdvcnkiLCJEZWxldGUgRGVmYXVsdCBDYXRlZ29yeSIsIlZpZXcgUnVsZSIsIlZpZXcgQXVkaWVuY2UiLCJWaWV3IENhbXBhaWduIiwiVmlldyBGbGlnaHQiLCJWaWV3IFRoaXJkIFBhcnR5IEFjY291bnQiLCJWaWV3IEF1ZGllbmNlIERpc2NvdmVyeSIsIlZpZXcgQ29tcGFueSIsIlZpZXcgQnJhbmQiLCJWaWV3IENhbXBhaWduIFJlcG9ydCIsIkNyZWF0ZSBDYW1wYWlnbiBSZXBvcnQiLCJVcGRhdGUgQ2FtcGFpZ24gUmVwb3J0IiwiRGVsZXRlIENhbXBhaWduIFJlcG9ydCIsIlZpZXcgRm9ybWF0IiwiVXBkYXRlIEJyYW5kIiwiQ3JlYXRlIEZvcm1hdCIsIlVwZGF0ZSBGb3JtYXQiLCJDcmVhdGUgQ2F0ZWdvcnkiLCJVcGRhdGUgQ2F0ZWdvcnkiLCJEZWxldGUgQ2F0ZWdvcnkiLCJDcmVhdGUgUnVsZSIsIlVwZGF0ZSBSdWxlIiwiRGVsZXRlIFJ1bGUiLCJDcmVhdGUgQXVkaWVuY2UiLCJVcGRhdGUgQXVkaWVuY2UiLCJEZWxldGUgQXVkaWVuY2UiLCJDcmVhdGUgQ2FtcGFpZ24iLCJVcGRhdGUgQ2FtcGFpZ24iLCJEZWxldGUgQ2FtcGFpZ24iLCJDcmVhdGUgRmxpZ2h0IiwiVXBkYXRlIEZsaWdodCIsIkRlbGV0ZSBGbGlnaHQiLCJDcmVhdGUgVGhpcmQgUGFydHkgQWNjb3VudCIsIlVwZGF0ZSBUaGlyZCBQYXJ0eSBBY2NvdW50IiwiRGVsZXRlIFRoaXJkIFBhcnR5IEFjY291bnQiLCJEZWxldGUgRm9ybWF0IiwiVmlldyBUYXJnZXRpbmdBdWRpZW5jZSIsIkNyZWF0ZSBUYXJnZXRpbmdBdWRpZW5jZSIsIlVwZGF0ZSBUYXJnZXRpbmdBdWRpZW5jZSIsIlVzZXIgSW52aXRhdGlvbiIsIkxpc3QgQWNjb3VudCBVc2VyIiwiVXBkYXRlIFVzZXIgQWNjb3VudCBJbmZvIiwiUmVtb3ZlIFVzZXIgRnJvbSBBY2NvdW50IiwiVmlldyBSZXBvcnQgU2NoZWR1bGUiLCJDcmVhdGUgUmVwb3J0IFNjaGVkdWxlIiwiVXBkYXRlIFJlcG9ydCBTY2hlZHVsZSIsIkRlbGV0ZSBSZXBvcnQgU2NoZWR1bGUiLCJWaWV3IEtleXdvcmQgR3JvdXAiLCJDcmVhdGUgS2V5d29yZCBHcm91cCIsIlVwZGF0ZSBLZXl3b3JkIEdyb3VwIiwiRGVsZXRlIEtleXdvcmQgR3JvdXAiLCJEZWxldGUgVGFyZ2V0aW5nQXVkaWVuY2UiLCJWaWV3IENoYW5uZWwiLCJDcmVhdGUgQ2hhbm5lbCIsIlVwZGF0ZSBDaGFubmVsIiwiRGVsZXRlIENoYW5uZWwiLCJWaWV3IFN1YkNoYW5uZWwiLCJDcmVhdGUgU3ViQ2hhbm5lbCIsIlVwZGF0ZSBTdWJDaGFubmVsIiwiRGVsZXRlIFN1YkNoYW5uZWwiLCJWaWV3IE9iamVjdGl2ZSIsIkNyZWF0ZSBPYmplY3RpdmUiLCJVcGRhdGUgT2JqZWN0aXZlIiwiRGVsZXRlIE9iamVjdGl2ZSIsIlZpZXcgQWRBY2NvdW50M3JkIiwiQ3JlYXRlIEFkQWNjb3VudDNyZCIsIlVwZGF0ZSBBZEFjY291bnQzcmQiLCJEZWxldGUgQWRBY2NvdW50M3JkIiwiVmlldyBMaW5rQWNjb3VudCIsIkNyZWF0ZSBMaW5rQWNjb3VudCIsIlVwZGF0ZSBMaW5rQWNjb3VudCIsIkRlbGV0ZSBMaW5rQWNjb3VudCIsIlZpZXcgQnJhbmQgUXVhcnRlcmx5IFJlcG9ydCIsIlZpZXcgUmV2ZW51ZVJlcG9ydCIsIlZpZXcgTWVkaWFQbGFuIiwiQ3JlYXRlIE1lZGlhUGxhbiIsIlVwZGF0ZSBNZWRpYVBsYW4iLCJEZWxldGUgTWVkaWFQbGFuIiwiVmlldyBUaGlyZFBhcnR5IENhbXBhaWduIiwiQ3JlYXRlIFRoaXJkUGFydHkgQ2FtcGFpZ24iLCJVcGRhdGUgVGhpcmRQYXJ0eSBDYW1wYWlnbiIsIkRlbGV0ZSBUaGlyZFBhcnR5IENhbXBhaWduIiwiVmlldyBDYW1wYWlnbiBLZXl3b3JkIEdyb3VwIiwiQ3JlYXRlIENhbXBhaWduIEtleXdvcmQgR3JvdXAiLCJVcGRhdGUgQ2FtcGFpZ24gS2V5d29yZCBHcm91cCIsIkRlbGV0ZSBDYW1wYWlnbiBLZXl3b3JkIEdyb3VwIl19LCJhY2NvdW50Ijp7ImlkIjo1MzAwMDAwMDYsIm5hbWUiOiJFbmNoYW50ZXVyIiwiZW1haWwiOiJlbmNoYW50ZXVyQHlvbWVkaWEudm4iLCJ0eXBlIjozLCJhZG1pbklkIjpudWxsLCJicmFuZElkIjo1MzAwMDAwMDYsImNvbXBhbnlJZCI6NTMwMDAwMDAyLCJ3ZWJzaXRlIjpudWxsLCJwZXJtaXNzaW9ucyI6WyJWaWV3IFVzZXIiLCJVcGRhdGUgVXNlciIsIlZpZXcgQ2F0ZWdvcnkiLCJWaWV3IERlZmF1bHQgQ2F0ZWdvcnkiLCJDcmVhdGUgRGVmYXVsdCBDYXRlZ29yeSIsIlVwZGF0ZSBEZWZhdWx0IENhdGVnb3J5IiwiRGVsZXRlIERlZmF1bHQgQ2F0ZWdvcnkiLCJWaWV3IFJ1bGUiLCJWaWV3IEF1ZGllbmNlIiwiVmlldyBDYW1wYWlnbiIsIlZpZXcgRmxpZ2h0IiwiVmlldyBUaGlyZCBQYXJ0eSBBY2NvdW50IiwiVmlldyBBdWRpZW5jZSBEaXNjb3ZlcnkiLCJWaWV3IENvbXBhbnkiLCJWaWV3IEJyYW5kIiwiVmlldyBDYW1wYWlnbiBSZXBvcnQiLCJDcmVhdGUgQ2FtcGFpZ24gUmVwb3J0IiwiVXBkYXRlIENhbXBhaWduIFJlcG9ydCIsIkRlbGV0ZSBDYW1wYWlnbiBSZXBvcnQiLCJWaWV3IEZvcm1hdCIsIlVwZGF0ZSBCcmFuZCIsIkNyZWF0ZSBGb3JtYXQiLCJVcGRhdGUgRm9ybWF0IiwiQ3JlYXRlIENhdGVnb3J5IiwiVXBkYXRlIENhdGVnb3J5IiwiRGVsZXRlIENhdGVnb3J5IiwiQ3JlYXRlIFJ1bGUiLCJVcGRhdGUgUnVsZSIsIkRlbGV0ZSBSdWxlIiwiQ3JlYXRlIEF1ZGllbmNlIiwiVXBkYXRlIEF1ZGllbmNlIiwiRGVsZXRlIEF1ZGllbmNlIiwiQ3JlYXRlIENhbXBhaWduIiwiVXBkYXRlIENhbXBhaWduIiwiRGVsZXRlIENhbXBhaWduIiwiQ3JlYXRlIEZsaWdodCIsIlVwZGF0ZSBGbGlnaHQiLCJEZWxldGUgRmxpZ2h0IiwiQ3JlYXRlIFRoaXJkIFBhcnR5IEFjY291bnQiLCJVcGRhdGUgVGhpcmQgUGFydHkgQWNjb3VudCIsIkRlbGV0ZSBUaGlyZCBQYXJ0eSBBY2NvdW50IiwiRGVsZXRlIEZvcm1hdCIsIlZpZXcgVGFyZ2V0aW5nQXVkaWVuY2UiLCJDcmVhdGUgVGFyZ2V0aW5nQXVkaWVuY2UiLCJVcGRhdGUgVGFyZ2V0aW5nQXVkaWVuY2UiLCJVc2VyIEludml0YXRpb24iLCJMaXN0IEFjY291bnQgVXNlciIsIlVwZGF0ZSBVc2VyIEFjY291bnQgSW5mbyIsIlJlbW92ZSBVc2VyIEZyb20gQWNjb3VudCIsIlZpZXcgUmVwb3J0IFNjaGVkdWxlIiwiQ3JlYXRlIFJlcG9ydCBTY2hlZHVsZSIsIlVwZGF0ZSBSZXBvcnQgU2NoZWR1bGUiLCJEZWxldGUgUmVwb3J0IFNjaGVkdWxlIiwiVmlldyBLZXl3b3JkIEdyb3VwIiwiQ3JlYXRlIEtleXdvcmQgR3JvdXAiLCJVcGRhdGUgS2V5d29yZCBHcm91cCIsIkRlbGV0ZSBLZXl3b3JkIEdyb3VwIiwiRGVsZXRlIFRhcmdldGluZ0F1ZGllbmNlIiwiVmlldyBDaGFubmVsIiwiQ3JlYXRlIENoYW5uZWwiLCJVcGRhdGUgQ2hhbm5lbCIsIkRlbGV0ZSBDaGFubmVsIiwiVmlldyBTdWJDaGFubmVsIiwiQ3JlYXRlIFN1YkNoYW5uZWwiLCJVcGRhdGUgU3ViQ2hhbm5lbCIsIkRlbGV0ZSBTdWJDaGFubmVsIiwiVmlldyBPYmplY3RpdmUiLCJDcmVhdGUgT2JqZWN0aXZlIiwiVXBkYXRlIE9iamVjdGl2ZSIsIkRlbGV0ZSBPYmplY3RpdmUiLCJWaWV3IEFkQWNjb3VudDNyZCIsIkNyZWF0ZSBBZEFjY291bnQzcmQiLCJVcGRhdGUgQWRBY2NvdW50M3JkIiwiRGVsZXRlIEFkQWNjb3VudDNyZCIsIlZpZXcgTGlua0FjY291bnQiLCJDcmVhdGUgTGlua0FjY291bnQiLCJVcGRhdGUgTGlua0FjY291bnQiLCJEZWxldGUgTGlua0FjY291bnQiLCJWaWV3IEJyYW5kIFF1YXJ0ZXJseSBSZXBvcnQiLCJWaWV3IFJldmVudWVSZXBvcnQiLCJWaWV3IE1lZGlhUGxhbiIsIkNyZWF0ZSBNZWRpYVBsYW4iLCJVcGRhdGUgTWVkaWFQbGFuIiwiRGVsZXRlIE1lZGlhUGxhbiIsIlZpZXcgVGhpcmRQYXJ0eSBDYW1wYWlnbiIsIkNyZWF0ZSBUaGlyZFBhcnR5IENhbXBhaWduIiwiVXBkYXRlIFRoaXJkUGFydHkgQ2FtcGFpZ24iLCJEZWxldGUgVGhpcmRQYXJ0eSBDYW1wYWlnbiIsIlZpZXcgQ2FtcGFpZ24gS2V5d29yZCBHcm91cCIsIkNyZWF0ZSBDYW1wYWlnbiBLZXl3b3JkIEdyb3VwIiwiVXBkYXRlIENhbXBhaWduIEtleXdvcmQgR3JvdXAiLCJEZWxldGUgQ2FtcGFpZ24gS2V5d29yZCBHcm91cCJdfSwiZXhwIjoxNjQ5MjEyNTA5LCJpYXQiOjE2NDkxMjYxMDl9.8Pn8aF-SnFmUlM8ZY4cwWQginX_cf5oOJuixMl0ag9U`
      }
    }
  }
})

const form = document.getElementById("form")
form.addEventListener('submit', joinRoom)

function joinRoom(event) {
  event.preventDefault();
  const id = document.getElementById("userId").value
  socket.emit('join-room', id)
}

socket.on('join-room-respond', msg => {
  console.log(msg + 'on port 3001')
  alert(msg)
})
socket.on('leave-room', msg => {
  console.log(msg)
})
socket.on('exception', err => {
  console.log(err)
  alert(err.status + ': ' + err.message)
})
socket.on('notification', msg => {
  var ul = document.getElementById("list");
  var li = document.createElement("li");
  var children = ul.children.length + 1

  li.setAttribute("class", "list-group-item")
  li.appendChild(document.createTextNode(msg));
  ul.appendChild(li)

  console.log('notification', msg)
})
socket.on("connect", function () {
  // socket.emit('join', '1')
  console.log("connecting");
});