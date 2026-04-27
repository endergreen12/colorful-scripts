import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../../lib/exports/get/assembly"
import { GetCharacterModelListFromMVModel, GetCharacterNameFromCharacterModel, GetMainCamFromMVModel, GetMVModelInstance } from "../lib/get"
import { CameraType, ChangeImpl_CreateOpenOptionDialogButton } from "../lib/options/dialog"
import { SetTargetCharIndex, targetCharIndex } from "../lib/options/value"
import { AttachCameraToCharacterModel, ChangeImpl_ChangeFOV, ChangeImpl_DisableCameraDecoration, ChangeImpl_RemoveTracksFromTimeLineAsset } from "../lib/process"
import { ChangeImpl_ChangeTargetCharBySwiping } from "../lib/control/character/music-video"
import { CharModelList_LogIndexAndCharName } from "../lib/utils"

Il2Cpp.perform(() => {
    ChangeImpl_RemoveTracksFromTimeLineAsset()
    ChangeImpl_DisableCameraDecoration()
    ChangeImpl_ChangeFOV()
    ChangeImpl_CreateOpenOptionDialogButton(CameraType.CharacterCamera)
    ChangeImpl_ChangeTargetCharBySwiping()

    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    AssemblyCSharpImage.class("Sekai.Core.Live.MusicVideoController").method("Start").implementation = function()
    {
        this.method("Start").invoke()

        const mvModelInstance = GetMVModelInstance()
        const characterModelList = GetCharacterModelListFromMVModel(mvModelInstance)

        CharModelList_LogIndexAndCharName(characterModelList)
    
        if(targetCharIndex > characterModelList.length - 1)
        {
            console.log("The target index exceeds the range of characterList, setting to 0")
            SetTargetCharIndex(0)
        }

        const targetCharacterModel = characterModelList.get(targetCharIndex)

        console.log(`Current target index: ${targetCharIndex} | ${GetCharacterNameFromCharacterModel(targetCharacterModel)}`)

        AttachCameraToCharacterModel(GetMainCamFromMVModel(mvModelInstance), targetCharacterModel)
    }
})