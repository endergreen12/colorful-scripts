import "frida-il2cpp-bridge"

export function GetSystemStringClass(): Il2Cpp.Class
{
    return Il2Cpp.corlib.class("System.String")
}

export function GetSystemActionClass(): Il2Cpp.Class
{
    return Il2Cpp.corlib.class("System.Action")
}