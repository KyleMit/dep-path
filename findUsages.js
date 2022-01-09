const fs = require("fs/promises")
const madge = require("madge")

main()

async function main() {
  try {
    let checklistFile = await fs.readFile("./checklist.ini", "utf-8")
    let checked = checklistFile.split("\n").filter((t) => t[0] !== ";")

    let out = await madge("./src")

    // list all files
    let allFiles = out.obj()

    // remove test files __test
    let dependenciesMet = Object.entries(allFiles)
      .filter((entry) => {
        // remove test files
        let key = entry[0]
        let inTest = key.includes("-test")
        return !inTest
      })
      .filter((entry) => {
        // remove files already checked
        let key = entry[0]
        let alreadyDone = checked.includes(key)
        return !alreadyDone
      })
      .filter((entry) => {
        let deps = entry[1]
        let allDepsMet = deps.every((d) => checked.includes(d))
        return allDepsMet
      })

    let output = dependenciesMet.map((ent) => ent[0]).join("\n")

    await fs.writeFile("./ondeck.txt", output, "utf-8")

    // list all objects whose dependencies are satisfied (either null or from config)
  } catch (error) {
    console.log(error)
  }
}
