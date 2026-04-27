import "frida-il2cpp-bridge"
import { GetProperty } from "./get-set"

export function GetTransform(obj: Il2Cpp.Object): Il2Cpp.Object
{
    return GetProperty(obj, "transform")
}

export function SetParent(targetTransform: Il2Cpp.Object, parentTransform: (Il2Cpp.Object | NativePointer), worldPositionStays: boolean)
{
    targetTransform.method("SetParent", 2).invoke(parentTransform, worldPositionStays)
}