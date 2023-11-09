var flare = require("cloudflare")
var cf = flare({
  token: process.env.CF_TOKEN,
})
cf.dnsRecords.browse("54c7b733aa82d85bcf1e7cf752096f54").then((records) => {
  const availabilityFilter = records.result.filter((record) => {
    return record.comment == process.env.EVENT_USER_LOGIN
  })
  if (availabilityFilter[0]) {
    const mappedRecords = availabilityFilter.map((record) => {
      return record.name
    })
    return console.log(
      `completed|Your subdomains:\\n${mappedRecords.join("\\n")}`
    )
  } else {
    return console.log(
      "completed|You don't have any subdomains!"
    )
  }
})
