import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../lib/exports/get/assembly"
import { GetUnityActionClass } from "../lib/exports/get/unity"
import { Show2ButtonDialog_1, COMMON_2BUTTON_DIALOG_CLASS_NAME, ShowSubWindowDialog } from "../lib/utils/game/dialog"
import { GetMasterDataManagerInstance } from "../lib/utils/game/instance"
import { CreateOptionInputField } from "../lib/utils/option-utils/create"
import { CreateButton } from "../lib/utils/unity/tmpro"
import { GetTransform } from "../lib/utils/unity/transform"
import { CreateVector3, CreateVector2 } from "../lib/utils/unity/vector"
import { DialogType } from "../lib/exports/enum"
import { WORDINGS } from "../lib/exports/wordings"

Il2Cpp.perform(() => {
    let isButtonCreated = false

    let episodeId: number = 8 // 一周年カウントダウンムービー01

    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    AssemblyCSharpImage.class("Sekai.ScreenLayerStoryCategorySelect").method("OnInitComponent").implementation = function()
    {
        this.method("OnInitComponent").invoke()

        if(isButtonCreated)
        {
            return
        }

        CreateButton("Play Special Scenario", 38, CreateVector3(-300, 450, 0), CreateVector2(400, 100), GetTransform(this as Il2Cpp.Object), (button: Il2Cpp.Object) => {
            const dialog = Show2ButtonDialog_1(COMMON_2BUTTON_DIALOG_CLASS_NAME, DialogType.Common2ButtonDialog, WORDINGS.EMPTY, WORDINGS.OK, WORDINGS.CANCEL, Il2Cpp.delegate(GetUnityActionClass(), () => {
                const masterDataManager = GetMasterDataManagerInstance()
                const specialStoryEpisode = masterDataManager.method<Il2Cpp.Object>("GetMasterSpecialStoryEpisode").invoke(episodeId)

                if(specialStoryEpisode.isNull())
                {
                    ShowSubWindowDialog("The specified episode could not be found.")
                    return
                }

                AssemblyCSharpImage.class("Sekai.ScenarioUtility").method("PlaySpecialStoryEpisode").invoke(specialStoryEpisode)
            }), NULL)

            const dialogTransform = GetTransform(dialog)

            CreateOptionInputField(episodeId, (value: number) => episodeId = value, "Episode ID:", 48, 34, CreateVector3(0, 15, 0), CreateVector2(400, 100), dialogTransform)
        })

        isButtonCreated = true
    }

    AssemblyCSharpImage.class("Sekai.ScreenLayerStoryCategorySelect").method(".ctor").implementation = function()
    {
        this.method(".ctor").invoke()

        isButtonCreated = false
    }
})