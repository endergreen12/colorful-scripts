import "frida-il2cpp-bridge"
import { addTwoVector3, createVector3, disableMVCameraDecoration, getAssemblyImage, getCoreModuleImage, multiplyVector3, overrideFov, removeTracksFromMVTimelineForCamera } from "../lib/utils"

let fov: number = 70

Il2Cpp.perform(() => {
    const assemblyImage = getAssemblyImage()

    let mainCamTransform: Il2Cpp.Object

    // Preparation
    removeTracksFromMVTimelineForCamera()
    disableMVCameraDecoration()
    overrideFov(fov)

    assemblyImage.class("Sekai.Live.Background3DView").method("OnLoad").implementation = function()
    {
        this.method("OnLoad").invoke()

        mainCamTransform = this.field<Il2Cpp.Object>("_mainBgPlayer").value
                                .field<Il2Cpp.Object>("_cameraNode").value
                                .field<Il2Cpp.Object>("mainCamera").value
                                .method<Il2Cpp.Object>("get_transform").invoke()
        mainCamTransform.method("set_position").invoke(createVector3(0.0, 1.5, 7.0))
        mainCamTransform.method("set_eulerAngles").invoke(createVector3(0.0, 180.0, 0.0))
    }

    // Free camera logic
    assemblyImage.class("Sekai.Core.Live.MusicVideoController").method("Pause").implementation = function(){} // Disable pausing by touching screen

    const UnityEngineInputClass = Il2Cpp.domain.assembly("UnityEngine.InputLegacyModule").image.class("UnityEngine.Input")
    const moveSpeed = 0.03
    const angleSpeed = 0.5
    const screenWidth = getCoreModuleImage().class("UnityEngine.Screen").method<number>("get_width").invoke()
    let storedLeftTouchPos: Il2Cpp.ValueType = null
    let storedRightTouchPos: Il2Cpp.ValueType = null
    let touches: Il2Cpp.Array<Il2Cpp.ValueType>
    let touch: Il2Cpp.ValueType
    let touchPos: Il2Cpp.ValueType
    let touchPhaseStr: string
    let deltaTime: number

    assemblyImage.class("Sekai.Core.Live.MusicVideoController").method("OnUpdate").implementation = function()
    {
        this.method("OnUpdate").invoke()

        if(this.field<Il2Cpp.ValueType>("state").value.toString() == "Exit") return

        if(UnityEngineInputClass.method<number>("get_touchCount").invoke() > 0)
        {
            touches = UnityEngineInputClass.method<Il2Cpp.Array<Il2Cpp.ValueType>>("get_touches").invoke()
            
            for(let i = 0; i < touches.length; i++)
            {
                touch = touches.get(i)
                touchPos = touch.method<Il2Cpp.ValueType>("get_position").invoke()
                touchPhaseStr = touch.method<Il2Cpp.String>("get_phase").invoke().toString()

                deltaTime = getCoreModuleImage().class("UnityEngine.Time").method<number>("get_deltaTime").invoke()

                if(touchPos.field<number>("x").value <= screenWidth / 2) // Left
                {
                    if(touchPhaseStr === "Began")
                    {
                        storedLeftTouchPos = touchPos
                        return
                    }

                    if(storedLeftTouchPos === null || storedLeftTouchPos.isNull())
                    {
                        return
                    }

                    mainCamTransform.method("set_position").invoke(
                        addTwoVector3(
                            addTwoVector3(
                                mainCamTransform.method<Il2Cpp.ValueType>("get_position").invoke(),
                                multiplyVector3(
                                    mainCamTransform.method<Il2Cpp.ValueType>("get_right").invoke(),
                                    (touchPos.field<number>("x").value - storedLeftTouchPos.field<number>("x").value) * moveSpeed * deltaTime
                                )
                            ), multiplyVector3(
                                mainCamTransform.method<Il2Cpp.ValueType>("get_forward").invoke(),
                                (touchPos.field<number>("y").value - storedLeftTouchPos.field<number>("y").value) * moveSpeed * deltaTime
                            )
                        )
                    )
                } else { // Right
                    if(touchPhaseStr === "Began")
                    {
                        storedRightTouchPos = touchPos
                        return
                    }

                    if(storedRightTouchPos === null || storedRightTouchPos.isNull())
                    {
                        return
                    }

                    mainCamTransform.method("set_eulerAngles").invoke(
                        addTwoVector3(
                            mainCamTransform.method<Il2Cpp.ValueType>("get_eulerAngles").invoke(),
                            createVector3(
                                (touchPos.field<number>("y").value - storedRightTouchPos.field<number>("y").value) * -1 * angleSpeed * deltaTime,
                                (touchPos.field<number>("x").value - storedRightTouchPos.field<number>("x").value) * angleSpeed * deltaTime,
                                0
                            )
                        )
                    )
                }
            }
        }
    }
})