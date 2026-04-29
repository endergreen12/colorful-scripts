import "frida-il2cpp-bridge"
import { getAssemblyImage } from "../lib/utils"

Il2Cpp.perform(() => {
    let episodeId: number = 8 // 一周年カウントダウンムービー01

    const assemblyImage = getAssemblyImage()
    assemblyImage.class("Sekai.ScenarioUtility").method("PlaySpecialStoryEpisode").invoke(
        assemblyImage.class("Sekai.MasterDataManager").method<Il2Cpp.Object>("get_Instance").invoke()
        .method<Il2Cpp.Object>("GetMasterSpecialStoryEpisode").invoke(episodeId)
    )
})