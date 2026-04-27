import "frida-il2cpp-bridge"
import { DisplayLayerType, DialogSize, DialogType } from "../../exports/enum"
import { GetScreenManagerInstance } from "./instance"
import { GetAssemblyCSharpImage } from "../../exports/get/assembly"

export const COMMON_1BUTTON_DIALOG_CLASS_NAME = "Sekai.Common1ButtonDialog"
export function Show1ButtonDialog_1(className: string, dialogType: number, messageBodyKey: string, okButtonLabelKey: string, onClickOK: Il2Cpp.Object | NativePointer, layerType: number = DisplayLayerType.Layer_Dialog, dialogSize: number = DialogSize.Manual, allowCloseExternal: boolean = true): Il2Cpp.Object
{
    return GetScreenManagerInstance()
        .method<Il2Cpp.Object>("Show1ButtonDialog", 7).inflate(GetAssemblyCSharpImage().class(className))
        .invoke(dialogType, Il2Cpp.string(messageBodyKey), Il2Cpp.string(okButtonLabelKey), onClickOK, layerType, dialogSize, allowCloseExternal)
}

export function ShowSubWindowDialog(messageBody: string = null, onClose: Il2Cpp.Object | NativePointer = NULL, allowCloseExternal: boolean = true, dialogType: number = DialogType.SubWindowDialog, layerType: number = DisplayLayerType.Layer_Dialog): Il2Cpp.Object
{
    return GetScreenManagerInstance()
        .method<Il2Cpp.Object>("ShowSubWindowDialog").inflate(GetAssemblyCSharpImage().class("Sekai.SubWindowDialog"))
        .invoke(Il2Cpp.string(messageBody), onClose, allowCloseExternal, dialogType, layerType)
}

export const COMMON_2BUTTON_DIALOG_CLASS_NAME = "Sekai.Common2ButtonDialog"
export function Show2ButtonDialog_1(className: string, dialogType: number, messageBodyKey: string, okButtonLabelKey: string, cancelButtonLabelKey: string, onClickOK: Il2Cpp.Object | NativePointer, onClickCancel: Il2Cpp.Object | NativePointer, layerType: number = DisplayLayerType.Layer_Dialog, dialogSize: number = DialogSize.Manual, allowCloseExternal: boolean = true): Il2Cpp.Object
{
    return GetScreenManagerInstance()
        .method<Il2Cpp.Object>("Show2ButtonDialog", 9).inflate(GetAssemblyCSharpImage().class(className))
        .invoke(dialogType, Il2Cpp.string(messageBodyKey), Il2Cpp.string(okButtonLabelKey), Il2Cpp.string(cancelButtonLabelKey), onClickOK, onClickCancel, layerType, dialogSize, allowCloseExternal)
}