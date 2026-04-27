import "frida-il2cpp-bridge"

export function GetAssemblyCSharpImage(): Il2Cpp.Image
{
    return Il2Cpp.domain.assembly("Assembly-CSharp").image
}