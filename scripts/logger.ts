import "frida-il2cpp-bridge"
import { GetCoreModuleImage } from "./lib/exports/get/unity"
import { GetAssemblyCSharpImage } from "./lib/exports/get/assembly"

Il2Cpp.perform(() => {
    Il2Cpp.trace(true).classes(GetCoreModuleImage().class("UnityEngine.Debug")).filterMethods(method => method.name.startsWith("Log")).and().attach()
    Il2Cpp.trace(true).classes(GetAssemblyCSharpImage().class("Sekai.ApplicationLogger")).filterMethods(method => method.name === "WriteLog").and().attach()
})