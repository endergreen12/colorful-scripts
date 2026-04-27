import "frida-il2cpp-bridge"

export function GetTMProImage(): Il2Cpp.Image
{
    return Il2Cpp.domain.assembly("Unity.TextMeshPro").image
}

export function GetTMProUGUIClass(): Il2Cpp.Class
{
    return GetTMProImage().class("TMPro.TextMeshProUGUI")
}

export function GetTMProTextClass(): Il2Cpp.Class
{
    return GetTMProImage().class("TMPro.TMP_Text")
}

export function GetTMProDefControlsClass(): Il2Cpp.Class
{
    return GetTMProImage().class("TMPro.TMP_DefaultControls")
}

export function GetTMProInputFieldClass(): Il2Cpp.Class
{
    return GetTMProImage().class("TMPro.TMP_InputField")
}