import "frida-il2cpp-bridge"
import { AttachCameraToCharacterModel, ChangeImpl_DisablePausingByTouchingScreen, SetActiveOfCharModelPartsForFirstPerson } from "../../process"
import { GetAssemblyCSharpImage } from "../../../../lib/exports/get/assembly"
import { GetUnityEngineInputClass } from "../../../../lib/exports/get/unity"
import { GetCharacterModelListFromMVModel, GetCharacterNameFromCharacterModel, GetMainCamFromMVModel, GetMVModelInstance } from "../../get"
import { GetField, GetProperty } from "../../../../lib/utils/unity/get-set"
import { SetTargetCharIndex, targetCharIndex } from "../../options/value"

let hasTargetBeenChanged = false
let liveStateAtTouchBegan = "" // Used to prevent the music video from being immediately paused when it is resumed
const swipeSensitivity = 30
export function ChangeImpl_ChangeTargetCharBySwiping()
{
    ChangeImpl_DisablePausingByTouchingScreen()

    const UnityEngineInputClass = GetUnityEngineInputClass()

    GetAssemblyCSharpImage().class("Sekai.Core.Live.MusicVideoController").method("OnUpdate").implementation = function()
    {
        this.method("OnUpdate").invoke()

        const liveStateStr = GetField(this, "state").toString()
        if(liveStateStr == "Exit")
        {
            return
        }

        if(GetProperty<number>(UnityEngineInputClass, "touchCount") > 0)
        {
            const touch = UnityEngineInputClass.method<Il2Cpp.Object>("GetTouch").invoke(0)
            const deltaX = GetField<number>(GetProperty<Il2Cpp.Object>(touch, "deltaPosition"), "x")

            switch(GetProperty(touch, "phase").toString())
            {
                case "Began":
                    liveStateAtTouchBegan = liveStateStr
                    return

                case "Ended":
                    if(!hasTargetBeenChanged && liveStateAtTouchBegan != "Pause")
                    {
                        this.method("OnPause").invoke()
                    } else {
                        hasTargetBeenChanged = false
                    }
                    return
            }

            if(!hasTargetBeenChanged && Math.abs(deltaX) >= swipeSensitivity)
            {
                hasTargetBeenChanged = true

                const mvModelInstance = GetMVModelInstance()
                const characterModelList = GetCharacterModelListFromMVModel(mvModelInstance)

                // Reactivate the elements of character deactivated before
                SetActiveOfCharModelPartsForFirstPerson(characterModelList.get(targetCharIndex), true)
            
                if(deltaX >= swipeSensitivity) // Right Swipe
                {
                    SetTargetCharIndex(targetCharIndex - 1 < 0 ? characterModelList.length - 1 : targetCharIndex - 1)
                } else if(deltaX <= -swipeSensitivity) // Left Swipe
                {
                    SetTargetCharIndex(targetCharIndex + 1 > characterModelList.length - 1 ? 0 : targetCharIndex + 1)
                }
            
                const newTargetCharacterModel = characterModelList.get(targetCharIndex)

                console.log(`Set target index to ${targetCharIndex} | ${GetCharacterNameFromCharacterModel(newTargetCharacterModel)}`)
                
                AttachCameraToCharacterModel(GetMainCamFromMVModel(mvModelInstance), newTargetCharacterModel)
            }
        }
    }
}