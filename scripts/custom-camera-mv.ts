import "frida-il2cpp-bridge"
import { setActiveOfCharPartsForCamera, attachCamToChar, removeTracksFromMVTimelineForCamera, getAssemblyImage, disableMVCameraDecoration, overrideFov } from "../lib/utils"

let fov = -1
let isThirdPersonEnabled = true

Il2Cpp.perform(() => {
    const assemblyImage = getAssemblyImage()
    let mainCamera: Il2Cpp.Object
    let characterModelArray: Il2Cpp.Array<Il2Cpp.Object>

    // Preparation
    removeTracksFromMVTimelineForCamera()
    disableMVCameraDecoration()
    overrideFov(fov)

    assemblyImage.class("Sekai.Live.Background3DView").method("OnLoad").implementation = function()
    {
        this.method("OnLoad").invoke()

        const mainBgPlayer = this.field<Il2Cpp.Object>("_mainBgPlayer").value
        mainCamera = mainBgPlayer.field<Il2Cpp.Object>("_cameraNode").value.field<Il2Cpp.Object>("mainCamera").value
        characterModelArray = mainBgPlayer.field<Il2Cpp.Object>("_characterNode").value.field<Il2Cpp.Array<Il2Cpp.Object>>("_characterModels").value

        console.log(`Current target index: ${targetCharIndex}`)

        const targetCharModel = characterModelArray.get(targetCharIndex)
        if(!isThirdPersonEnabled)
        {
            setActiveOfCharPartsForCamera(targetCharModel, false)
        }
        attachCamToChar(mainCamera, targetCharModel, isThirdPersonEnabled)
    }

    // Implementation of swipe to switch target character
    let isTargetChanged = false
    let liveStateAtTouchBegan = "" // Used to prevent the music video from being immediately paused when it is resumed
    let liveStateStr = ""
    let touch: Il2Cpp.ValueType
    let deltaX = 0
    let targetCharIndex = 0
    const swipeSensitivity = 30
    
    assemblyImage.class("Sekai.Core.Live.MusicVideoController").method("Pause").implementation = function(){} // Disable pausing by touching screen
    
    const UnityEngineInputClass = Il2Cpp.domain.assembly("UnityEngine.InputLegacyModule").image.class("UnityEngine.Input")

    assemblyImage.class("Sekai.Core.Live.MusicVideoController").method("OnUpdate").implementation = function()
    {
        this.method("OnUpdate").invoke()

        if(mainCamera === null || mainCamera.isNull() || characterModelArray === null || characterModelArray.isNull()) return

        liveStateStr = this.field<Il2Cpp.ValueType>("state").value.toString()

        if(liveStateStr == "Exit") return

        if(UnityEngineInputClass.method<number>("get_touchCount").invoke() > 0)
        {
            touch = UnityEngineInputClass.method<Il2Cpp.ValueType>("GetTouch").invoke(0)
            deltaX = touch.method<Il2Cpp.ValueType>("get_deltaPosition").invoke().field<number>("x").value

            switch(touch.method<Il2Cpp.ValueType>("get_phase").invoke().toString())
            {
                case "Began":
                    liveStateAtTouchBegan = liveStateStr
                    return

                case "Ended":
                    if(!isTargetChanged && liveStateAtTouchBegan != "Pause")
                    {
                        this.method("OnPause").invoke()
                    } else {
                        isTargetChanged = false
                    }
                    return
            }

            if(!isTargetChanged && Math.abs(deltaX) >= swipeSensitivity)
            {
                isTargetChanged = true

                // Reactivate the elements of character deactivated before
                if(!isThirdPersonEnabled)
                {
                    setActiveOfCharPartsForCamera(characterModelArray.get(targetCharIndex), true)
                }
            
                if(deltaX >= swipeSensitivity) // Right Swipe
                {
                    targetCharIndex = targetCharIndex - 1 < 0 ? characterModelArray.length - 1 : targetCharIndex - 1
                } else if(deltaX <= -swipeSensitivity) // Left Swipe
                {
                    targetCharIndex = targetCharIndex + 1 > characterModelArray.length - 1 ? 0 : targetCharIndex + 1
                }
            
                const newTargetCharModel = characterModelArray.get(targetCharIndex)

                console.log(`Set target index to ${targetCharIndex}`)
                
                if(!isThirdPersonEnabled)
                {
                    setActiveOfCharPartsForCamera(newTargetCharModel, false)
                }
                attachCamToChar(mainCamera, newTargetCharModel, isThirdPersonEnabled)
            }
        }
    }
})