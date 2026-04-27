import "frida-il2cpp-bridge"
import { GetComponentInChildren } from "../unity/component"
import { SetProperty } from "../unity/get-set"
import { CreateButton, UpdateTextOfButton, CreateInputField, CreateText } from "../unity/tmpro"
import { GetTransform } from "../unity/transform"
import { CreateVector3 } from "../unity/vector"
import { GetUnityEngineUIButtonClass } from "../../exports/get/unity"
import { GetTMProInputFieldClass } from "../../exports/get/tmpro"

// Primitive types require this tedious method because changing them in a function does not change their original value
export function CreateOptionToggleButton(targetValue: boolean, valueChangeFunc: () => boolean, text: string, fontSize: number, position: Il2Cpp.Object, sizeDelta: Il2Cpp.Object, parentTransform: Il2Cpp.Object, customValueTextFunc: (value: boolean) => string = () => "", isInteractable: boolean = true): Il2Cpp.Object
{
    const button = CreateButton(GetValueStateText(text, targetValue, customValueTextFunc(targetValue)), fontSize, position, sizeDelta, parentTransform, (button: Il2Cpp.Object) => {
                targetValue = valueChangeFunc() // Sync the value of this function with the changed value
                UpdateTextOfButton(button, GetValueStateText(text, targetValue, customValueTextFunc(targetValue)))
            })
    SetProperty(GetComponentInChildren(button, GetUnityEngineUIButtonClass()), "interactable", isInteractable)

    return button
}

export function CreateOptionInputField(targetValue: string | number, valueChangeFunc: (value: string | number) => void, text: string, inputFieldFontSize: number, textFontSize: number, position: Il2Cpp.Object, sizeDelta: Il2Cpp.Object, parentTransform: Il2Cpp.Object, isInteractable: boolean = true): Il2Cpp.Object
{
    const inputField = CreateInputField(String(targetValue), inputFieldFontSize, position, sizeDelta, typeof targetValue === "number" ? 2 : 0, parentTransform, (inputField: Il2Cpp.Object, value: string) => {
                valueChangeFunc(typeof targetValue === "number" ? parseInt(value) : value)
            })
    CreateText(text, textFontSize, CreateVector3(0, 40, 0), sizeDelta, GetTransform(inputField), "black")

    SetProperty(GetComponentInChildren(inputField, GetTMProInputFieldClass()), "interactable", isInteractable)

    return inputField
}

function GetValueStateText(name: string, value: boolean, customValueText: string): string
{
    return `${name}: ${customValueText === "" ? (value ? "Enabled": "Disabled") : customValueText}`
}