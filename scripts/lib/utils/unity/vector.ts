import "frida-il2cpp-bridge"
import { GetCoreModuleImage } from "../../exports/get/unity"
import { GetField } from "./get-set"

export function CreateVector3(x: number, y: number, z: number): Il2Cpp.Object
{
    const vector3 = GetCoreModuleImage().class("UnityEngine.Vector3").alloc()
    vector3.method(".ctor").invoke(x, y, z)
    return vector3
}

export function CreateVector2(x: number, y: number): Il2Cpp.Object
{
    const vector2 = GetCoreModuleImage().class("UnityEngine.Vector2").alloc()
    vector2.method(".ctor").invoke(x, y)
    return vector2
}

// Vector3
export function AddTwoVector3(value1: Il2Cpp.Object, value2: Il2Cpp.Object): Il2Cpp.Object
{
    return CreateVector3(
        GetField<number>(value1, "x") + GetField<number>(value2, "x"),
        GetField<number>(value1, "y") + GetField<number>(value2, "y"),
        GetField<number>(value1, "z") + GetField<number>(value2, "z")
    )
}

export function MultiplyVector3(value: Il2Cpp.Object, ratio: number)
{
    return CreateVector3(
        GetField<number>(value, "x") * ratio,
        GetField<number>(value, "y") * ratio,
        GetField<number>(value, "z") * ratio
    )
}