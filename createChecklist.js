const fs = require("fs/promises")
const madge = require("madge")

main()

async function main() {
  try {
    let out = await madge("./src")

    // list all files
    let allFiles = out.obj()

    // remove test files __test
    let fileNames = Object.keys(allFiles)
      .filter((n) => !n.includes("-test"))
      .sort()
    let output = ";" + fileNames.join("\n;")
    await fs.writeFile("./checklist.ini", output, "utf-8")

    // list all objects whose dependencies are satisfied (either null or from config)
  } catch (error) {
    console.log(error)
  }
}
