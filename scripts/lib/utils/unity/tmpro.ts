import "frida-il2cpp-bridge"
import { GetSystemStringClass } from "../../exports/get/corlib"
import { GetTMProDefControlsClass, GetTMProUGUIClass, GetTMProInputFieldClass, GetTMProTextClass } from "../../exports/get/tmpro"
import { GetUnityEngineUIButtonClass, GetUnityActionClass, GetCoreModuleImage } from "../../exports/get/unity"
import { GetComponentInChildren } from "./component"
import { SetProperty, GetProperty } from "./get-set"
import { GetTransform, SetParent } from "./transform"

export function CreateButton(text: string, fontSize: number, localPosition: Il2Cpp.Object, sizeDelta: Il2Cpp.Object, parentTransform: Il2Cpp.Object, onClick: (button: Il2Cpp.Object) => void): Il2Cpp.Object
{
    const TMProDefControlsClass = GetTMProDefControlsClass()

    // Create a button
    const resources = TMProDefControlsClass.nested("Resources").new()
    const button = TMProDefControlsClass.method<Il2Cpp.Object>("CreateButton").invoke(resources.unbox())

    SetupRectTransform(GetTransform(button), parentTransform, localPosition, sizeDelta)

    // Set text and fontSize of the button
    UpdateTextOfButton(button, text)
    SetProperty(GetComponentInChildren(button, GetTMProUGUIClass()), "fontSize", fontSize)

    // Set onClick callback
    GetProperty(GetComponentInChildren(button, GetUnityEngineUIButtonClass()), "onClick")
        .method("AddListener").invoke(Il2Cpp.delegate(GetUnityActionClass(), () => onClick(button)))

    return button
}

export function CreateInputField(text: string, fontSize: number, localPosition: Il2Cpp.Object, sizeDelta: Il2Cpp.Object, contentType: number, parentTransform: Il2Cpp.Object, onSubmit: (inputField: Il2Cpp.Object, value: string) => void): Il2Cpp.Object
{
    const TMProDefControlsClass = GetTMProDefControlsClass()

    // Create new inputField
    const resources = TMProDefControlsClass.nested("Resources").new()
    const inputField = TMProDefControlsClass.method<Il2Cpp.Object>("CreateInputField").invoke(resources.unbox())

    SetupRectTransform(GetTransform(inputField), parentTransform, localPosition, sizeDelta)

    const inputFieldComponent = GetComponentInChildren(inputField, GetTMProInputFieldClass())

    // Set contentType
    SetProperty(inputFieldComponent, "contentType", contentType)

    // Set text
    SetProperty(inputFieldComponent, "text", Il2Cpp.string(text))

    const textComponent = GetProperty(inputFieldComponent, "textComponent")

    // Set font size
    SetProperty(textComponent, "fontSize", fontSize)

    // Set onSubmit callback
    const unityActionStringClass = GetCoreModuleImage().class("UnityEngine.Events.UnityAction`1").inflate(GetSystemStringClass())
    const call = Il2Cpp.delegate(unityActionStringClass, (value: Il2Cpp.String) => onSubmit(inputField, value.toString().substring(1, value.length + 1))) // Use substring to remove double quotations, and im not sure why it goes well with "length + 1" but anyway
    GetProperty(inputFieldComponent, "onSubmit").method("AddListener").invoke(call)

    return inputField
}

export function CreateText(textStr: string, fontSize: number, localPosition: Il2Cpp.Object, sizeDelta: Il2Cpp.Object, parentTransform: Il2Cpp.Object, color: string = ""): Il2Cpp.Object
{
    const TMProDefControlsClass = GetTMProDefControlsClass()

    // Create new text
    const resources = TMProDefControlsClass.nested("Resources").new()
    const text = TMProDefControlsClass.method<Il2Cpp.Object>("CreateText").invoke(resources.unbox())

    SetupRectTransform(GetTransform(text), parentTransform, localPosition, sizeDelta)

    // Set text and fontSize of the button
    const textComponent = GetComponentInChildren(text, GetTMProTextClass())
    SetProperty(textComponent, "text", Il2Cpp.string(textStr))
    SetProperty(textComponent, "fontSize", fontSize)

    if(color != "")
    {
        SetProperty(textComponent, "color", GetProperty(GetCoreModuleImage().class("UnityEngine.Color"), color))
    }

    return text
}

export function UpdateTextOfButton(obj: Il2Cpp.Object, text: string)
{
    SetProperty(GetComponentInChildren(obj, GetTMProUGUIClass()), "text", Il2Cpp.string(text))
}

function SetupRectTransform(rectTransform: Il2Cpp.Object, parentTransform: Il2Cpp.Object, localPos: Il2Cpp.Object, sizeDelta: Il2Cpp.Object)
{
    SetParent(rectTransform, parentTransform, false)
    SetProperty(rectTransform, "localPosition", localPos.unbox())
    SetProperty(rectTransform, "sizeDelta", sizeDelta.unbox())
}