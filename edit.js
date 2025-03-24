const array = process.env.EVENT_ISSUE_BODY.split("### ")
const flare = require("cloudflare")
const { logSuccess, getValidRecordType,logErrorAndExit, DNS_ZONE_ID, nonascii } = require('./utils');

/**
 * CONSTANTS
 */
const TTL = 60;
const subdomain = array[1][1]
const cf = flare({
  token: process.env.CF_TOKEN
})

// dark magic starts here, don't ask.
array.forEach((item, index) => {
  array[index] = item.split("\n\n")
})

const original = array[3][1]
array[3][1] = original.split("\n")[0]
array[3].push(original.split("\n")[1])
// End of the dark magic.

if (
  !(
    array.length === 4 &&
    array[0].length === 1 &&
    array[0][0] === "" &&
    array[1][0] === "Subdomain Name" &&
    array[1].length === 3 &&
    array[2][0] === "DNS Record" &&
    array[2].length === 3 &&
    array[3].length === 3 &&
    array[3][0] === "Agreement" &&
    array[3][1] === "- [x] I have ensured that this subdomain is mine" &&
    array[3][2] === undefined &&
    !subdomain.includes(" ") &&
    !array[2][1].includes(" ") &&
    !nonascii.test(subdomain) &&
    !nonascii.test(array[2][1]) &&
    array[1][1] !== ".lgbt.sh" &&
    array[1][1].endsWith(".lgbt.sh")
  )
) {
  return logErrorAndExit("Format invalid! It's usually because you didn't check the agreements, or the domain/record you entered is invalid!", subdomain)
}



cf.dnsRecords.browse(DNS_ZONE_ID)
  .then((dnsRecords) => {
    const dnsAvailable = dnsRecords.result.filter((foundDNS) => { return (foundDNS.name === subdomain && foundDNS.comment === process.env.EVENT_USER_LOGIN) })

    if (!dnsAvailable[0])
      logErrorAndExit(`This subdomain is not yours or the subdomain is not found!`, subdomain)

    const recordType = getValidRecordType(array);

    return cf.dnsRecords.edit(DNS_ZONE_ID, dnsAvailable[0].id, {
      content: array[2][1],
      name: subdomain,
      proxied: false,
      type: recordType,
      ttl: TTL,
      comment: process.env.EVENT_USER_LOGIN,
    });
  }).then((cloudFlareResponse) => {
    if (!cloudFlareResponse.success) {
      return logErrorAndExit(`CloudFlare Error: ${cloudFlareResponse.errors[0].message}`, subdomain);
    }

    logSuccess(subdomain);
  }).catch((error) => console.error("An error occurred:", error));
