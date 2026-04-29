import "frida-il2cpp-bridge"
import { getAssemblyImage } from "../lib/utils"

Il2Cpp.perform(() => {
    let assetbundleName = "event_canvas_2022" // poor Ena
    let scenarioId = "event_53_02"
    let episodeId = 1000424

    const assemblyImage = getAssemblyImage()

    const assetBundleNamesClass = assemblyImage.class("Sekai.AssetBundleNames")
    const scenarioAssetBundleName = assetBundleNamesClass.method<Il2Cpp.String>("GetEventStoryScenarioName").invoke(Il2Cpp.string(assetbundleName))
    const voiceAssetBundleName = assetBundleNamesClass.method<Il2Cpp.String>("GetEventStoryVoiceBundleName").invoke(Il2Cpp.string(assetbundleName))

    // i really dont know why this doesnt work
    assemblyImage.class("Sekai.ScenarioUtility").method("PlayScenario")
        .invoke(scenarioAssetBundleName, voiceAssetBundleName, Il2Cpp.string(scenarioId), NULL, NULL, NULL, episodeId, 0, NULL)
})