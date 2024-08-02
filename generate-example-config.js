const fs = require("fs");

// Function to clear values from the object.
function ClearValues(obj) {
    if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
            return obj.map((item) => ClearValues(item));
        } else {
            let clearedObj = {};

            for (let key in obj) {
                clearedObj[key] = ClearValues(obj[key]);
            }

            return clearedObj;
        }
    } else {
        return "";
    }
}

// Read the original config.json file
fs.readFile("config.json", "utf8", (Error, Data) => {
    if (Error) {
        console.error("Error reading config.json:", Error);
        return;
    }

    let ConfigData; //This stores the new configuration data.

    try {
        ConfigData = JSON.parse(Data);
    } catch (Error) {
        console.error("Error parsing JSON:", Error);
        return;
    }

    // Clear the values from the config.json file.
    const ClearedConfigData = ClearValues(ConfigData);

    // Write the cleared config data to example.config.json.
    fs.writeFile("example-config.json", JSON.stringify(ClearedConfigData, null, 4), (Error) => {
        if (Error) {
            console.error("Error writing example.config.json:", Error);
            return;
        }
        console.log("[AUTOMATED] example-config.json has been created with cleared values.");
    });
});
