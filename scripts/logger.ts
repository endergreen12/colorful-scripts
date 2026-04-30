import "frida-il2cpp-bridge"
import { getAssemblyImage, getCoreModuleImage } from "../lib/utils"

Il2Cpp.perform(() => {
    Il2Cpp.trace(true)
        .classes(getCoreModuleImage().class("UnityEngine.Debug"))
        .filterMethods(method => method.name.startsWith("Log"))
        .and()
        .attach()
    
    Il2Cpp.trace(true)
        .classes(getAssemblyImage().class("Sekai.ApplicationLogger"))
        .filterMethods(method => method.name === "WriteLog")
        .and()
        .attach()
})