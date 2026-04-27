import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../../../lib/exports/get/assembly"
import { DisplayLayerType, DialogSize, DialogType } from "../../../lib/exports/enum"
import { Show1ButtonDialog_1, COMMON_1BUTTON_DIALOG_CLASS_NAME } from "../../../lib/utils/game/dialog"
import { CreateOptionToggleButton, CreateOptionInputField } from "../../../lib/utils/option-utils/create"
import { GetComponentInChildren } from "../../../lib/utils/unity/component"
import { SetProperty } from "../../../lib/utils/unity/get-set"
import { CreateButton } from "../../../lib/utils/unity/tmpro"
import { GetTransform } from "../../../lib/utils/unity/transform"
import { CreateVector3, CreateVector2 } from "../../../lib/utils/unity/vector"
import { changeFOV, isThirdPersonEnabled, SetChangeFOVEnable, SetTargetFOVValue, SetThirdPersonEnable, targetFOV } from "./value"
import { GetTMProInputFieldClass } from "../../../lib/exports/get/tmpro"
import { WORDINGS } from "../../../lib/exports/wordings"

export const CameraType = {
    CharacterCamera: 0,
    FreeCamera: 1
} as const

let isButtonCreated = false
export function ChangeImpl_CreateOpenOptionDialogButton(cameraType: number, isVirtualLive: boolean = false)
{
    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    AssemblyCSharpImage.class("Sekai.ScreenLayerMusicVideoCellPhone").method("OnInitComponent").implementation = function()
    {
        this.method("OnInitComponent").invoke()

        if(isButtonCreated)
            return

        CreateButton("Options", 38, CreateVector3(400, 400, 0), CreateVector2(300, 100), GetTransform(this as Il2Cpp.Object), (button: Il2Cpp.Object) => {
            const dialog = Show1ButtonDialog_1(COMMON_1BUTTON_DIALOG_CLASS_NAME, DialogType.Common1ButtonDialog, WORDINGS.EMPTY, WORDINGS.CLOSE, NULL, DisplayLayerType.Layer_Dialog, DialogSize.Large)
            const dialogTransform = GetTransform(dialog)

            const sharedSizeDelta = CreateVector2(400, 100)

            CreateOptionToggleButton(isThirdPersonEnabled, () => {
                SetThirdPersonEnable(!isThirdPersonEnabled)
                return isThirdPersonEnabled
            }, "Mode", 28, CreateVector3(-250, 250, 0), sharedSizeDelta, dialogTransform, (value: boolean): string => value ? "Third Person" : "First Person", cameraType === CameraType.CharacterCamera)

            const targetFOVInputField = CreateOptionInputField(targetFOV, (value: number) => {SetTargetFOVValue(value)}, "Target FOV:", 48, 34, CreateVector3(-250, 30, 0), sharedSizeDelta, dialogTransform, changeFOV)
            CreateOptionToggleButton(changeFOV, () => {
                SetChangeFOVEnable(!changeFOV)
                SetProperty(GetComponentInChildren(targetFOVInputField, GetTMProInputFieldClass()), "interactable", changeFOV)
                return changeFOV
            }, "Change FOV", 28, CreateVector3(250, 250, 0), sharedSizeDelta, dialogTransform, () => "", !isVirtualLive)
        })
        
        isButtonCreated = true
    }

    AssemblyCSharpImage.class("Sekai.ScreenLayerMusicVideoCellPhone").method(".ctor").implementation = function()
    {
        this.method(".ctor").invoke()

        isButtonCreated = false
    }
}