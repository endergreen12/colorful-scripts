import "frida-il2cpp-bridge"
import { getAssemblyImage } from "../lib/utils"

Il2Cpp.perform(() => {
    let musicId = 578 // ハローセカイ (Hello, SEKAI)
    let difficulty = "master"
    let vocalId = 1572 // バーチャル・シンガーver (Virtual Singer ver.)
    const deckId = 1
    let collaboModeState = 0
    let isAuto: boolean = false

    const assemblyImage = getAssemblyImage()

    // Set Sekai.Core.EntryPoint.PlayMode
    assemblyImage.class("Sekai.Core.EntryPoint").method("set_PlayMode").invoke(3) // 3 = SoloLive
    
    // Set up liveBootData
    const liveBootData = assemblyImage.class("Sekai.FreeLiveBootData").alloc()
    liveBootData.method(".ctor", 7).invoke(musicId, Il2Cpp.string(difficulty), vocalId, deckId, 0, collaboModeState, false) // Call the constructor of Sekai.LiveBootDataBase
    liveBootData.method(".ctor", 9).invoke(musicId, Il2Cpp.string(difficulty), vocalId, deckId, Il2Cpp.array(Il2Cpp.corlib.class("System.Int32"), 0), collaboModeState, true, 0, 0) // Call the constructor of Sekai.FreeLiveBootData
    liveBootData.method("SetLiveMode").invoke(3) // 3 = Low
    liveBootData.method("set_IsAuto").invoke(isAuto)

    assemblyImage.class("Sekai.UserDataManager").method<Il2Cpp.Object>("get_Instance").invoke().method("set_FreeLiveBootData").invoke(liveBootData)

    // Start live
    assemblyImage.class("Sekai.ScreenManager").method<Il2Cpp.Object>("get_Instance").invoke().method("AddScreen", 1).invoke(63) // 63 = LiveLoading
})