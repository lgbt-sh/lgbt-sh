const flare = require("cloudflare")
const cf = flare({
    token: process.env.CF_TOKEN,
})
const { logSuccess } = require('./utils.js');



cf.dnsRecords.browse(DNS_ZONE_ID).then((records) => {

    const availabilityFilter = records.result.filter((record) => {
        return record.comment === process.env.EVENT_USER_LOGIN
    })

    if (availabilityFilter[0]) {
        const mappedRecords = availabilityFilter.map((record) => {
            return record.name
        })

        return logSuccess(`Your Subdomains:\\n${mappedRecords.join("\\n")}`)

    }

    return logSuccess('No Subdomains.')
})
