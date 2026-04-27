import "frida-il2cpp-bridge"
import { DisplayLayerType, DialogSize, DialogType } from "../lib/exports/enum"
import { GetAssemblyCSharpImage } from "../lib/exports/get/assembly"
import { GetSystemActionClass } from "../lib/exports/get/corlib"
import { GetUnityActionClass } from "../lib/exports/get/unity"
import { Show2ButtonDialog_1, COMMON_2BUTTON_DIALOG_CLASS_NAME } from "../lib/utils/game/dialog"
import { CreateOptionInputField } from "../lib/utils/option-utils/create"
import { CreateButton } from "../lib/utils/unity/tmpro"
import { GetTransform } from "../lib/utils/unity/transform"
import { CreateVector3, CreateVector2 } from "../lib/utils/unity/vector"
import { WORDINGS } from "../lib/exports/wordings"

Il2Cpp.perform(() => {
    let isButtonCreated = false

    let assetbundleName = "event_canvas_2022" // poor Ena
    let scenarioId = "event_53_02"
    let episodeId = 1000424

    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    AssemblyCSharpImage.class("Sekai.ScreenLayerStoryCategorySelect").method("OnInitComponent").implementation = function()
    {
        this.method("OnInitComponent").invoke()

        if(isButtonCreated)
        {
            return
        }

        CreateButton("Play Scenario", 38, CreateVector3(-300, 450, 0), CreateVector2(400, 100), GetTransform(this as Il2Cpp.Object), (button: Il2Cpp.Object) => {
            const dialog = Show2ButtonDialog_1(COMMON_2BUTTON_DIALOG_CLASS_NAME, DialogType.Common2ButtonMediumDialog, WORDINGS.EMPTY, WORDINGS.OK, WORDINGS.CANCEL, Il2Cpp.delegate(GetUnityActionClass(), () => {
                const assetBundleNamesClass = AssemblyCSharpImage.class("Sekai.AssetBundleNames")

                const scenarioAssetBundleName = assetBundleNamesClass.method<Il2Cpp.String>("GetEventStoryScenarioName").invoke(Il2Cpp.string(assetbundleName))
                const voiceAssetBundleName = assetBundleNamesClass.method<Il2Cpp.String>("GetEventStoryVoiceBundleName").invoke(Il2Cpp.string(assetbundleName))

                const onFinished = Il2Cpp.delegate(GetSystemActionClass(), () => console.log("Scenario finished"))

                AssemblyCSharpImage.class("Sekai.ScenarioUtility").method("PlayScenario")
                    .invoke(scenarioAssetBundleName, voiceAssetBundleName, Il2Cpp.string(scenarioId), onFinished, NULL, NULL, episodeId, 0, NULL)
            }), NULL, DisplayLayerType.Layer_Dialog, DialogSize.Medium)

            const dialogTransform = GetTransform(dialog)

            const sharedSizeDelta = CreateVector2(400, 100)
            
            CreateOptionInputField(assetbundleName, (value: string) => assetbundleName = value, "Asset Bundle Name:", 48, 28, CreateVector3(-250, 150, 0), sharedSizeDelta, dialogTransform)
            CreateOptionInputField(scenarioId, (value: string) => scenarioId = value, "Scenario ID:", 48, 28, CreateVector3(250, 150, 0), sharedSizeDelta, dialogTransform)
            CreateOptionInputField(episodeId, (value: number) => episodeId = value, "Episode ID:", 48, 28, CreateVector3(-250, -70, 0), sharedSizeDelta, dialogTransform)
        })

        isButtonCreated = true
    }

    AssemblyCSharpImage.class("Sekai.ScreenLayerStoryCategorySelect").method(".ctor").implementation = function()
    {
        this.method(".ctor").invoke()

        isButtonCreated = false
    }
})