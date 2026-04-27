import "frida-il2cpp-bridge"

// Property
export function GetProperty<T extends Il2Cpp.Method.ReturnType = Il2Cpp.Object>(obj: Il2Cpp.Object | Il2Cpp.ValueType | Il2Cpp.Class, propertyName: string): T
{
    return obj.method<T>(`get_${propertyName}`).invoke()
}

export function SetProperty(obj: Il2Cpp.Object | Il2Cpp.ValueType | Il2Cpp.Class, propertyName: string, value: Il2Cpp.Parameter.Type)
{
    obj.method(`set_${propertyName}`).invoke(value)
}

// Field
export function GetField<T extends Il2Cpp.Field.Type = Il2Cpp.Object>(obj: Il2Cpp.Object | Il2Cpp.ValueType | Il2Cpp.Class, fieldName: string): T
{
    return obj.field<T>(fieldName).value
}

export function SetField(obj: Il2Cpp.Object | Il2Cpp.ValueType | Il2Cpp.Class, fieldName: string, value: Il2Cpp.Field.Type)
{
    obj.field(fieldName).value = value
}