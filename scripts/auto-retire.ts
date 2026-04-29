import "frida-il2cpp-bridge"
import { getAssemblyImage } from "../lib/utils"

Il2Cpp.perform(() => {
    const assemblyImage = getAssemblyImage()
    
    assemblyImage.class("Sekai.Core.Live.SoloLiveController").method("OnExit").implementation = function()
    {
        console.log("Live finished. Setting result to Retire...")
        this.field<Il2Cpp.ValueType>("result").value = assemblyImage.class("Sekai.Core.Live.LiveResult").field<Il2Cpp.ValueType>("Retire").value

        this.method("OnExit").invoke()
    }
})