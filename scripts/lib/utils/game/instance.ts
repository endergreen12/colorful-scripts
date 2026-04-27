import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../../exports/get/assembly"
import { GetProperty } from "../unity/get-set"

export function GetInstanceOfSingleton(klass: Il2Cpp.Class): Il2Cpp.Object
{
    return GetProperty(klass, "Instance")
}

export function GetMasterDataManagerInstance(): Il2Cpp.Object
{
    return GetInstanceOfSingleton(GetAssemblyCSharpImage().class("Sekai.MasterDataManager"))
}

export function GetScreenManagerInstance(): Il2Cpp.Object
{
    return GetInstanceOfSingleton(GetAssemblyCSharpImage().class("Sekai.ScreenManager"))
}