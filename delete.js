const array = process.env.EVENT_ISSUE_BODY.split("### ")
const nonascii = /[^\u0000-\u007F]+/
array.forEach((item, index) => {
  array[index] = item.split("\n\n")
})
const original = array[3][1]
array[3][1] = original.split("\n")[0]
array[3].push(original.split("\n")[1])
//return console.log(array)
if (
  !(
    array.length == 4 &&
    array[0].length == 1 &&
    array[0][0] == "" &&
    array[1][0] == "Subdomain Name" &&
    array[1].length == 3 &&
    array[2].length == 3 &&
    array[2][0] == "Agreement" &&
    array[2][1] == "- [x] I have ensured that this subdomain is mine" &&
    array[2][2] == "" &&
    array[3].length == 3 &&
    array[3][0] == "Type your domain name + DELETE to confirm" &&
    array[3][1] == `${array[1][1]} DELETE` &&
    array[3][2] == undefined &&
    !array[1][1].includes(" ") &&
    !nonascii.test(array[1][1]) &&
    array[1][1] != ".lgbt.sh" &&
    array[1][1].endsWith(".lgbt.sh")
  )
) {
  return console.log(
    "not planned|Format invalid! It's usually because you didn't check the agreements, or the domain/record you entered is invalid!|"+array[1][1]
  )
}
var flare = require("cloudflare")
var cf = flare({
  token: process.env.CF_TOKEN,
})
cf.dnsRecords.browse("6f122d28e700b9f3ec930007e1ccb1b1").then((records) => {
  const availabilityFilter = records.result.filter((record) => {
    return (
      record.name == array[1][1] &&
      record.comment == process.env.EVENT_USER_LOGIN
    )
  })
  if (availabilityFilter[0]) {
    cf.dnsRecords
      .del("6f122d28e700b9f3ec930007e1ccb1b1", availabilityFilter[0].id)
      .then((response) => {
        if (!response.success) {
          return console.log(
            `not planned|CloudFlare Error:${response.errors[0].message}|${array[1][1]}`
          )
        }
        return console.log(
          "completed|Your subdomain has been successfully deleted!|"+array[1][1]
        )
      })
  } else {
    return console.log(
      "not planned|This subdomain is not yours or the subdomain is not found!|"+array[1][1]
    )
  }
})
