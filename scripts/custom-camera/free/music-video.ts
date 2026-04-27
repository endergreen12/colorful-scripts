import "frida-il2cpp-bridge"
import { ChangeImpl_ChangeFOV, ChangeImpl_DisableCameraDecoration, ChangeImpl_RemoveTracksFromTimeLineAsset } from "../lib/process"
import { CameraType, ChangeImpl_CreateOpenOptionDialogButton } from "../lib/options/dialog"
import { ChangeImpl_FreeCameraLogic } from "../lib/control/free/music-video"
import { GetTransform } from "../../lib/utils/unity/transform"
import { GetMainCamFromMVModel, GetMVModelInstance } from "../lib/get"
import { SetProperty } from "../../lib/utils/unity/get-set"
import { CreateVector3 } from "../../lib/utils/unity/vector"
import { GetAssemblyCSharpImage } from "../../lib/exports/get/assembly"

Il2Cpp.perform(() => {
    ChangeImpl_RemoveTracksFromTimeLineAsset()
    ChangeImpl_DisableCameraDecoration()
    ChangeImpl_ChangeFOV()
    ChangeImpl_CreateOpenOptionDialogButton(CameraType.FreeCamera)
    ChangeImpl_FreeCameraLogic()

    GetAssemblyCSharpImage().class("Sekai.Core.Live.MusicVideoController").method("Start").implementation = function()
    {
        this.method("Start").invoke()

        const mainCamTransform = GetTransform(GetMainCamFromMVModel(GetMVModelInstance()))
        SetProperty(mainCamTransform, "position", CreateVector3(0.0, 1.5, 7.0).unbox())
        SetProperty(mainCamTransform, "eulerAngles", CreateVector3(0.0, 180.0, 0.0).unbox())
    }
})