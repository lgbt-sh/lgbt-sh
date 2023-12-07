const array = process.env.EVENT_ISSUE_BODY.split("### ")
const flare = require("cloudflare")
const {logSuccess, nonascii, DNS_ZONE_ID, logErrorAndExit, ipv4, ipv6, hostname} = require("./utils");

/**
 * CONSTANTS
 */

const cf = flare({
  token: process.env.CF_TOKEN
})


// Default domain type
let type = "invalid"


// dark magic
array.forEach((item, index) => {
    array[index] = item.split("\n\n")
})


if (
    !(
        array[0].length === 1 &&
        array[0][0] === "" &&
        array[1].length === 2 &&
        array[1][0] === "Subdomain Name" &&
        !array[1][1].includes(" ") &&
        !nonascii.test(array[1][1]) &&
        array[1][1] !== ".lgbt.sh" &&
        array[1][1].endsWith(".lgbt.sh")
    )
) {
    return console.log("not planned|The domain you entered is invalid!|" + array[1][1])
}



if (hostname.test(array[1][1])) type = "CNAME"
if (ipv4.test(array[1][1])) type = "A"
if (ipv6.test(array[1][1])) type = "AAAA"
if (type === "hostname" && !array[1][1].includes(".")) type = "invalid"
if (type === "invalid") {
    return logErrorAndExit('The record destination you entered is invalid!', array[1][1])
}

cf.dnsRecords.browse(DNS_ZONE_ID)
  .then((dnsRecords) => {
    const availabilityFilter = dnsRecords.result.filter((record) => {
        return record.name === array[1][1]
    })

    if (availabilityFilter[0]) {
        return logSuccess(`Here's the domain info:\\nRecord Type: ${availabilityFilter[0].type}\\nRecord Content: ${availabilityFilter[0].content}\\nDomain Owner: ${availabilityFilter[0].comment}\\nRegistered On: ${availabilityFilter[0].created_on}\\nLast Modified: ${availabilityFilter[0].modified_on}`, array[1][1])
    }
        return logSuccess(`Domain not found, available for registering.`, array[1][1])

})
