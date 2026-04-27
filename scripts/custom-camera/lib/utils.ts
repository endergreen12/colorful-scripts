import "frida-il2cpp-bridge"
import { GetCharacterNameFromCharacterModel } from "./get"

export function CharModelList_LogIndexAndCharName(characterModelList: Il2Cpp.Array<Il2Cpp.Object>)
{
    console.log("\nCharacter models of this MV:")
    for(let i = 0; i < characterModelList.length; i++)
    {
        console.log(`Index: ${i} | ${GetCharacterNameFromCharacterModel(characterModelList.get(i))}`)
    }
}