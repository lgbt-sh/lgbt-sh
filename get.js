const array = process.env.EVENT_ISSUE_BODY.split("### ")
const flare = require("cloudflare")
const {logSuccess, nonascii, DNS_ZONE_ID, logErrorAndExit, ipv4, ipv6, hostname} = require("./utils");

/**
 * CONSTANTS
 */
const subdomain = array[1][1]

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
        !subdomain.includes(" ") &&
        !nonascii.test(subdomain) &&
        subdomain !== ".wip.lgbt.sh" &&
        subdomain.endsWith(".wip.lgbt.sh")
    )
) {
    return console.log("not planned|The domain you entered is invalid!|" + subdomain)
}



if (hostname.test(subdomain)) type = "CNAME"
if (ipv4.test(subdomain)) type = "A"
if (ipv6.test(subdomain)) type = "AAAA"
if (type === "hostname" && !subdomain.includes(".")) type = "invalid"
if (type === "invalid") {
    return logErrorAndExit('The record destination you entered is invalid!', subdomain)
}

cf.dnsRecords.browse(DNS_ZONE_ID)
  .then((dnsRecords) => {
    const availabilityFilter = dnsRecords.result.filter((record) => {
        return record.name === subdomain
    })

    if (availabilityFilter[0]) {
        return logSuccess(`Here's the domain info:\\nRecord Type: ${availabilityFilter[0].type}\\nRecord Content: ${availabilityFilter[0].content}\\nDomain Owner: ${availabilityFilter[0].comment}\\nRegistered On: ${availabilityFilter[0].created_on}\\nLast Modified: ${availabilityFilter[0].modified_on}`, subdomain)
    }
        return logSuccess(`Domain not found, available for registering.`, subdomain)

})
