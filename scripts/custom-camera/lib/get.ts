import "frida-il2cpp-bridge"
import { GetField, GetProperty } from "../../lib/utils/unity/get-set"
import { isThirdPersonEnabled } from "./options/value"
import { GetAssemblyCSharpImage } from "../../lib/exports/get/assembly"
import { GetInstanceOfSingleton } from "../../lib/utils/game/instance"

export function GetMainCamFromMVModel(mvModel: Il2Cpp.Object): Il2Cpp.Object
{
    return GetField(GetField<Il2Cpp.Object>(GetProperty<Il2Cpp.Object>(mvModel, "MainCameraModel"), "MainCameraModel"), "MainCamera")
}

export function GetCharacterModelPartToAttach(characterModel: Il2Cpp.Object): Il2Cpp.Object
{
    return GetProperty(characterModel, isThirdPersonEnabled ? "PositionNote" : "HeadTransform")
}

export function GetMVModelInstance(): Il2Cpp.Object
{
    return GetInstanceOfSingleton(GetAssemblyCSharpImage().class("Sekai.Live.Model.MusicVideoModel"))
}

export function GetCharacterModelListFromMVModel(mvModel: Il2Cpp.Object): Il2Cpp.Array<Il2Cpp.Object>
{
    return GetProperty(GetProperty<Il2Cpp.Object>(mvModel, "MainCharacterModel"), "CharacterModelList")
}

export function GetCharacterNameFromCharacterModel(characterModel: Il2Cpp.Object): string
{
    const characterId = GetProperty<number>(characterModel, "CharacterDataId")
    const gameCharacter = GetAssemblyCSharpImage().class("Sekai.CharacterUtility").method<Il2Cpp.Object>("GetMasterGameCharacter").invoke(characterId)

    return `Character Name: (JP: ${GetProperty<Il2Cpp.String>(gameCharacter, "FullName")} | ENG: ${GetProperty<Il2Cpp.String>(gameCharacter, "FullNameEnglish")})`
}