import "frida-il2cpp-bridge"

export function GetCoreModuleImage(): Il2Cpp.Image
{
    return Il2Cpp.domain.assembly("UnityEngine.CoreModule").image
}

export function GetUnityActionClass(): Il2Cpp.Class
{
    return GetCoreModuleImage().class("UnityEngine.Events.UnityAction")
}

export function GetUnityEngineUIButtonClass(): Il2Cpp.Class
{
    return Il2Cpp.domain.assembly("UnityEngine.UI").image.class("UnityEngine.UI.Button")
}

export function GetUnityEngineInputClass(): Il2Cpp.Class
{
    return Il2Cpp.domain.assembly("UnityEngine.InputLegacyModule").image.class("UnityEngine.Input")
}