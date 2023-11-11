/** 
 *  REGEX VALUES
 * */
const ipv4 =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/gm
const ipv6 =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/gm
const hostname =
    /^\s*(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,63}\s*$/gm


// Encapsulated methods for testing the REGEX, improves readability.
function isValidCNAME(value) {
    return hostname.test(value);
}

function isValidIPv4(value) {
    return ipv4.test(value);
}

function isValidIPv6(value) {
    return ipv6.test(value);
}

function getValidRecordType(array) {
    // Check for valid record types
    switch (true) {
        // Check for CNAME
        case isValidCNAME(array[2][1]):
            return "CNAME";

        // Check for IPv4
        case isValidIPv4(array[2][1]):
            return "A";

        // Check for IPv6
        case isValidIPv6(array[2][1]):
            return "AAAA";

        default:
            return "invalid";
    }
}

function logErrorAndExit(message, subdomain) {
    console.log(`not planned|${message}|${subdomain}`);
}

function logSuccess(subdomain) {
    console.log(`completed|Your subdomain has been successfully edited!|${subdomain}`);
}
