import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../../lib/exports/get/assembly"
import { GetField, GetProperty, SetField, SetProperty } from "../../lib/utils/unity/get-set"
import { GetTransform, SetParent } from "../../lib/utils/unity/transform"
import { CreateVector3 } from "../../lib/utils/unity/vector"
import { GetCharacterModelPartToAttach } from "./get"
import { isThirdPersonEnabled, changeFOV, targetFOV } from "./options/value"

export function ChangeImpl_RemoveTracksFromTimeLineAsset()
{
    GetAssemblyCSharpImage().class("Sekai.Core.MVDataLoader").method<Il2Cpp.Object>("LoadTimelineAsset").implementation = function(timelineName: Il2Cpp.String, mvId: number)
    {
        const loadedTimelineAsset = this.method<Il2Cpp.Object>("LoadTimelineAsset").invoke(timelineName, mvId)
        const trackObjects = GetProperty(loadedTimelineAsset, "trackObjects")
        const trackObjectsArray = trackObjects.method<Il2Cpp.Array<Il2Cpp.Object>>("ToArray").invoke()

        switch(timelineName.toString())
        {
            case '"Camera"': // Remove MainCam and DoF tracks
                for(let i = trackObjectsArray.length - 1; i >= 0; i--)
                {
                    const trackObj = trackObjectsArray.get(i)

                    if(!trackObj.isNull())
                    {
                        const name = GetProperty<Il2Cpp.String>(trackObj, "name").toString().toLowerCase()

                        if(name === '"maincamera"' || name.includes("dof"))
                        {
                            trackObjects.method("RemoveAt").invoke(i)
                        } else if(name.includes("effect")) // Remove DoF tracks from effect group
                        {
                            const children = GetField(trackObj, "m_Children")
                            const childrenArray = children.method<Il2Cpp.Array<Il2Cpp.Object>>("ToArray").invoke()
                            for(let j = childrenArray.length - 1; j >= 0; j--)
                            {
                                if(GetProperty<Il2Cpp.String>(childrenArray.get(j), "name").toString().toLowerCase().includes("dof"))
                                {
                                    children.method("RemoveAt").invoke(j)
                                }
                            }
                        }
                    }
                }
                break

            case '"Character"': // Remove MeshOff tracks
                for(let i = trackObjectsArray.length - 1; i >= 0; i--)
                {
                    const trackObj = trackObjectsArray.get(i)
                    if(!trackObj.isNull() && GetProperty<Il2Cpp.String>(trackObj, "name").toString().includes("MeshOff"))
                    {
                        trackObjects.method("RemoveAt").invoke(i)
                    }
                }
                break
        }

        return loadedTimelineAsset
    }
}

export function ChangeImpl_DisableCameraDecoration()
{
    GetAssemblyCSharpImage().class("Sekai.Live.Background3DPlayer").method("Setup").implementation = function(isCreateNode: boolean, mvData: Il2Cpp.Object)
    {
        SetField(GetField<Il2Cpp.Object>(mvData, "cameraInfo"), "hasCameraDecoration", false)
        this.method("Setup").invoke(isCreateNode, mvData)
    }
}

export function AttachCameraToCharacterModel(camera: Il2Cpp.Object, characterModel: Il2Cpp.Object)
{
    const cameraTransform = GetTransform(camera)
    SetParent(cameraTransform, GetCharacterModelPartToAttach(characterModel), false)

    SetProperty(cameraTransform, "localPosition", (isThirdPersonEnabled ? CreateVector3(0.0, 0.6, 1.5) : CreateVector3(-0.05, 0.0, 0.0)).unbox())
    SetProperty(cameraTransform, "localEulerAngles", (isThirdPersonEnabled ? CreateVector3(180.0, 0.0, 180.0) : CreateVector3(0.0, 0.0, 90.0)).unbox())

    if(isThirdPersonEnabled)
    {
        return
    }

    SetProperty(camera, "nearClipPlane", 0.01)

    SetActiveOfCharModelPartsForFirstPerson(characterModel, false)
}

export function SetActiveOfCharModelPartsForFirstPerson(characterModel: Il2Cpp.Object, isActive: boolean)
{
    GetProperty(characterModel, "Face").method("SetActive").invoke(isActive)
    GetProperty(characterModel, "Hair").method("SetActive").invoke(isActive)

    // For accessories
    const characterTransform = GetTransform(characterModel)
    const accessoryGameObjName = GetField<Il2Cpp.String>(GetAssemblyCSharpImage().class("Sekai.Core.CharacterModel").nested("GameObjectNameDefine"), "Acc")
    const accessoryTransform = characterTransform.method<Il2Cpp.Object>("Find").invoke(accessoryGameObjName)
    if(!accessoryTransform.isNull())
    {
        GetProperty(accessoryTransform, "gameObject").method("SetActive").invoke(isActive)
    }
}

export function ChangeImpl_ChangeFOV()
{
    GetAssemblyCSharpImage().class("Sekai.Core.SekaiCameraAspect").method("CalculateVerticalFov").implementation = function(currentFov: number): number
    {
        return changeFOV ? targetFOV : this.method<number>("CalculateVerticalFov").invoke(currentFov)
    }
}

export function ChangeImpl_DisablePausingByTouchingScreen()
{
    GetAssemblyCSharpImage().class("Sekai.Core.Live.MusicVideoController").method("Pause").implementation = function()
    {

    }
}