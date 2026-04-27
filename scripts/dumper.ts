import "frida-il2cpp-bridge"
import path from "path";
import { GetAssemblyCSharpImage } from "./lib/exports/get/assembly";
import { ShowSubWindowDialog } from "./lib/utils/game/dialog";
import { GetMasterDataManagerInstance } from "./lib/utils/game/instance";
import { GetField } from "./lib/utils/unity/get-set";
import { CreateButton } from "./lib/utils/unity/tmpro";
import { GetTransform } from "./lib/utils/unity/transform";
import { CreateVector3, CreateVector2 } from "./lib/utils/unity/vector";

const DUMP_DIR_PATH = path.join(Il2Cpp.application.dataPath, "dumped")

Il2Cpp.perform(() => {
    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    AssemblyCSharpImage.class("Sekai.OptionDialog").method("Setup").implementation = function(tabIndex, canAssetSetting, canBlockListSetting)
    {
        this.method("Setup").invoke(tabIndex, canAssetSetting, canBlockListSetting)

        CreateButton("Start dump", 38, CreateVector3(800, -300, 0), CreateVector2(300, 100), GetTransform(this as Il2Cpp.Object), (button: Il2Cpp.Object) => {
            const masterDataManager = GetMasterDataManagerInstance()

            console.log()
            console.log("Creating a folder...")
            Il2Cpp.corlib.class("System.IO.Directory").method("CreateDirectory").invoke(Il2Cpp.string(DUMP_DIR_PATH))

            console.log("Starting dump of MasterData...")
            const targetDataNameArray: string[] = ["MasterMusicAllMap", "MasterEventStories", "MasterSpecialStoryMap", "MasterUnitStoryEpisodeAll"]
            targetDataNameArray.forEach((targetDataName) => dumpMasterData(targetDataName, `${targetDataName}.json`, masterDataManager))

            console.log("Starting dump of wording...")
            serializeAndWriteToFile(GetField(AssemblyCSharpImage.class("Sekai.WordingManager"), "dictionary"), "WordingDictionary.json")

            ShowSubWindowDialog("Dump completed!")
        })
    }
})

function dumpMasterData(targetDataName: string, dumpFileName: string, masterDataManager: Il2Cpp.Object)
{
    console.log(`Dumping ${targetDataName}...`)

    const targetData = masterDataManager.method<Il2Cpp.Object>(`Get${targetDataName}`).invoke()
    serializeAndWriteToFile(targetData, dumpFileName)
}

function serializeAndWriteToFile(targetData: Il2Cpp.Object, dumpFileName: string)
{
    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    console.log("Serializing dumped data to JSON...")
    const jsonSerializedData = AssemblyCSharpImage.class("CP.JsonSerializer").method<Il2Cpp.String>("ToJsonWithUnicodeDecode").invoke(targetData)
    const formattedJson = AssemblyCSharpImage.class("CP.TextUtility").method<Il2Cpp.String>("JsonFormat").invoke(jsonSerializedData)

    console.log("Writing dumped data to a file...")
    Il2Cpp.corlib.class("System.IO.File").method("WriteAllText", 2).invoke(Il2Cpp.string(path.join(DUMP_DIR_PATH, dumpFileName)), formattedJson)

    console.log("Write completed")
    console.log()
}