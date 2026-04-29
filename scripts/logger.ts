import "frida-il2cpp-bridge"

Il2Cpp.perform(() => {
    Il2Cpp.trace(true)
        .classes(Il2Cpp.domain.assembly("UnityEngine.CoreModule").image
        .class("UnityEngine.Debug"))
        .filterMethods(method => method.name.startsWith("Log"))
        .and()
        .attach()
    
    Il2Cpp.trace(true)
        .classes(Il2Cpp.domain.assembly("Assembly-CSharp").image
        .class("Sekai.ApplicationLogger"))
        .filterMethods(method => method.name === "WriteLog")
        .and()
        .attach()
})