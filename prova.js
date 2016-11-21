var sanitize = require("sanitize-filename");

// Some string that may be unsafe or invalid as a filename
var filename = "porcodio?lamadonna.txt";

// Sanitize the string to be safe for use as a filename.
// filename = sanitize(filename);
// -> "~.sshauthorized_keys"

console.log(filename);
