import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../lib/exports/get/assembly"
import { SetField, GetField } from "../lib/utils/unity/get-set"

export function ChangeImpl_AutoRetire()
{
    console.log("Auto Retire installed")
}

Il2Cpp.perform(() => {
    const AssemblyCSharpImage = GetAssemblyCSharpImage()
    
    AssemblyCSharpImage.class("Sekai.Core.Live.SoloLiveController").method("OnExit").implementation = function()
    {
        console.log("Live finished. Setting result to Retire...")
        SetField(this, "result", GetField(AssemblyCSharpImage.class("Sekai.Core.Live.LiveResult"), "Retire"))

        this.method("OnExit").invoke()
    }
})