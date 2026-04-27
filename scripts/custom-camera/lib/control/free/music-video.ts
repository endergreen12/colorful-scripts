import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../../../../lib/exports/get/assembly"
import { GetCoreModuleImage, GetUnityEngineInputClass } from "../../../../lib/exports/get/unity"
import { GetField, GetProperty, SetProperty } from "../../../../lib/utils/unity/get-set"
import { AddTwoVector3, MultiplyVector3, CreateVector3 } from "../../../../lib/utils/unity/vector"
import { GetTransform } from "../../../../lib/utils/unity/transform"
import { GetMainCamFromMVModel, GetMVModelInstance } from "../../get"
import { ChangeImpl_DisablePausingByTouchingScreen } from "../../process"

const speed = 0.05
const angleSpeed = 0.5
let storedLeftTouchPos: Il2Cpp.Object = null
let storedRightTouchPos: Il2Cpp.Object = null
export function ChangeImpl_FreeCameraLogic()
{
    ChangeImpl_DisablePausingByTouchingScreen()

    GetAssemblyCSharpImage().class("Sekai.Core.Live.MusicVideoController").method("OnUpdate").implementation = function()
    {
        this.method("OnUpdate").invoke()

        if(GetField(this, "state").toString() == "Exit")
        {
            return
        }

        const UnityEngineInputClass = GetUnityEngineInputClass()

        if(GetProperty<number>(UnityEngineInputClass, "touchCount") > 0)
        {
            const touches = GetProperty<Il2Cpp.Array<Il2Cpp.Object>>(UnityEngineInputClass, "touches")
            
            for(let i = 0; i < touches.length; i++)
            {
                const touch = touches.get(i)
                const touchPos = GetProperty(touch, "position")
                const touchPhaseStr = GetProperty(touch, "phase").toString()

                const mainCamTransform = GetTransform(GetMainCamFromMVModel(GetMVModelInstance()))
                const deltaTime = GetProperty<number>(GetCoreModuleImage().class("UnityEngine.Time"), "deltaTime")

                if(GetField<number>(touchPos, "x") <= GetProperty<number>(GetCoreModuleImage().class("UnityEngine.Screen"), "width") / 2) // Left
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

                    const mainCamPos = GetProperty(mainCamTransform, "position")
                    const rightIncrease = MultiplyVector3(
                        GetProperty(mainCamTransform, "right"),
                        (GetField<number>(touchPos, "x") - GetField<number>(storedLeftTouchPos, "x")) * speed * deltaTime
                    )
                    const forwardIncrease = MultiplyVector3(
                        GetProperty(mainCamTransform, "forward"),
                        (GetField<number>(touchPos, "y") - GetField<number>(storedLeftTouchPos, "y")) * speed * deltaTime
                    )

                    let newMainCamPos = AddTwoVector3(mainCamPos, rightIncrease)
                    newMainCamPos = AddTwoVector3(newMainCamPos, forwardIncrease)
                    SetProperty(mainCamTransform, "position", newMainCamPos.unbox())
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

                    const mainCamEulerAngles = GetProperty(mainCamTransform, "eulerAngles")
                    const YIncrease = (GetField<number>(touchPos, "y") - GetField<number>(storedRightTouchPos, "y")) * -1 * angleSpeed * deltaTime
                    const XIncrease = (GetField<number>(touchPos, "x") - GetField<number>(storedRightTouchPos, "x")) * angleSpeed * deltaTime
                    const newMainCamEulerAngles = AddTwoVector3(mainCamEulerAngles, CreateVector3(YIncrease, XIncrease, 0))
                    SetProperty(mainCamTransform, "eulerAngles", newMainCamEulerAngles.unbox())
                }
            }
        }
    }
}