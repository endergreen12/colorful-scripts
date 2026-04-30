import "frida-il2cpp-bridge"
import path from "path";
import { getAssemblyImage } from "../lib/utils";

Il2Cpp.perform(() => {
    const DUMP_DIR_PATH = path.join(Il2Cpp.application.dataPath, "dumped")
    const assemblyImage = getAssemblyImage()
    const masterDataManager = assemblyImage.class("Sekai.MasterDataManager").method<Il2Cpp.Object>("get_Instance").invoke()

    console.log()
    console.log("Creating folder...")
    Il2Cpp.corlib.class("System.IO.Directory").method("CreateDirectory").invoke(Il2Cpp.string(DUMP_DIR_PATH))

    console.log("Starting dump of MasterData...")
    const targetDataNameArray: string[] = ["MasterMusicAllMap", "MasterEventStories", "MasterSpecialStoryMap", "MasterUnitStoryEpisodeAll"]
    targetDataNameArray.forEach((targetDataName) => {
        console.log(`Dumping ${targetDataName}...`)
        serializeAndWriteToFile(assemblyImage, masterDataManager.method<Il2Cpp.Object>(`Get${targetDataName}`).invoke(), path.join(DUMP_DIR_PATH, `${targetDataName}.json`))
    })

    console.log("Starting dump of wording...")
    serializeAndWriteToFile(assemblyImage, 
        assemblyImage.class("Sekai.WordingManager").field<Il2Cpp.Object>("dictionary").value, path.join(DUMP_DIR_PATH, "WordingDictionary.json"))

    console.log("Dump completed!")
})

function serializeAndWriteToFile(assemblyImage: Il2Cpp.Image, targetData: Il2Cpp.Object, dumpFilePath: string)
{
    console.log("Serializing dumped data to JSON...")
    const jsonSerializedData = assemblyImage.class("CP.JsonSerializer").method<Il2Cpp.String>("ToJsonWithUnicodeDecode").invoke(targetData)
    const formattedJson = assemblyImage.class("CP.TextUtility").method<Il2Cpp.String>("JsonFormat").invoke(jsonSerializedData)

    console.log("Writing dumped data to file...")
    Il2Cpp.corlib.class("System.IO.File").method("WriteAllText", 2).invoke(Il2Cpp.string(dumpFilePath), formattedJson)

    console.log("Write completed")
    console.log()
}