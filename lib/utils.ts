import "frida-il2cpp-bridge"

export function getAssemblyImage(): Il2Cpp.Image
{
    return Il2Cpp.domain.assembly("Assembly-CSharp").image
}

export function getCoreModuleImage(): Il2Cpp.Image
{
    return Il2Cpp.domain.assembly("UnityEngine.CoreModule").image
}

export function createVector3(x: number, y: number, z: number): Il2Cpp.ValueType
{
    const vector3 = getCoreModuleImage().class("UnityEngine.Vector3").alloc().unbox()
    vector3.method(".ctor").invoke(x, y, z)
    return vector3
}

export function addTwoVector3(value1: Il2Cpp.ValueType, value2: Il2Cpp.ValueType): Il2Cpp.ValueType
{
    return createVector3(
        value1.field<number>("x").value + value2.field<number>("x").value,
        value1.field<number>("y").value + value2.field<number>("y").value,
        value1.field<number>("z").value + value2.field<number>("z").value
    )
}

export function multiplyVector3(value: Il2Cpp.ValueType, ratio: number): Il2Cpp.ValueType
{
    return createVector3(
        value.field<number>("x").value * ratio,
        value.field<number>("y").value * ratio,
        value.field<number>("z").value * ratio
    )
}

export function setActiveOfCharPartsForCamera(characterModel: Il2Cpp.Object, isActive: boolean)
{
    characterModel.method<Il2Cpp.Object>("get_Face").invoke().method("SetActive").invoke(isActive)
    characterModel.method<Il2Cpp.Object>("get_Hair").invoke().method("SetActive").invoke(isActive)

    // For accessories
    const accessoryTransform = characterModel.method<Il2Cpp.Object>("get_transform").invoke().method<Il2Cpp.Object>("Find").invoke(Il2Cpp.string("Acc"))
    if(!accessoryTransform.isNull())
    {
        accessoryTransform.method<Il2Cpp.Object>("get_gameObject").invoke().method("SetActive").invoke(isActive)
    }
}

export function attachCamToChar(camera: Il2Cpp.Object, characterModel: Il2Cpp.Object, isThirdPersonEnabled: boolean)
{
    const cameraTransform = camera.method<Il2Cpp.Object>("get_transform").invoke()
    let charPartToAttach = ""

    if(isThirdPersonEnabled)
    {
        cameraTransform.method("set_localPosition").invoke(createVector3(0, 0.6, 1.5))
        cameraTransform.method("set_localEulerAngles").invoke(createVector3(180, 0, 180))
        charPartToAttach = "PositionNote"
    } else {
        camera.method("set_nearClipPlane").invoke(0.01)
        cameraTransform.method("set_localPosition").invoke(createVector3(-0.02, 0, 0))
        cameraTransform.method("set_localEulerAngles").invoke(createVector3(0, 0, 90))
        charPartToAttach = "HeadTransform"
    }

    cameraTransform.method("SetParent", 2).invoke(characterModel.method<Il2Cpp.Object>(`get_${charPartToAttach}`).invoke(), false)
}

export function removeTracksFromMVTimelineForCamera()
{
    const assemblyImage = getAssemblyImage()
    const scriptableObjPredicateClass = Il2Cpp.corlib.class("System.Predicate`1").inflate(getCoreModuleImage().class("UnityEngine.ScriptableObject"))

    assemblyImage.class("Sekai.Core.MVDataLoader").method<Il2Cpp.Object>("LoadTimelineAsset").implementation = function(timelineName: Il2Cpp.String, mvId: number)
    {
        const loadedTimelineAsset = this.method<Il2Cpp.Object>("LoadTimelineAsset").invoke(timelineName, mvId)

        const tracks = loadedTimelineAsset.field<Il2Cpp.Object>("m_Tracks").value
        switch(timelineName.toString())
        {
            case '"Camera"':
                tracks.method<number>("RemoveAll").invoke(
                    Il2Cpp.delegate(
                        scriptableObjPredicateClass,
                        (obj: Il2Cpp.Object) => obj.method<Il2Cpp.String>("get_name").invoke().toString() === '"MainCamera"')
                    )

                Il2Cpp.gc.choose(assemblyImage.class("Sekai.Core.Live.SekaiDofTrack")).forEach((value: Il2Cpp.Object) => {
                    value.field<Il2Cpp.Object>("m_Clips").value.method("Clear").invoke()
                })

            case '"Character"':
                Il2Cpp.gc.choose(assemblyImage.class("Sekai.Core.Live.CharacterMeshOffTrack")).forEach((value: Il2Cpp.Object) => {
                    value.field<Il2Cpp.Object>("m_Clips").value.method("Clear").invoke()
                })
        }

        return loadedTimelineAsset
    }
}

export function disableMVCameraDecoration()
{
    getAssemblyImage().class("Sekai.Live.MusicVideoPlayerFactory").method<Il2Cpp.Object>("CreateBackground3DPlayer").implementation = function(mvData: Il2Cpp.Object, root: Il2Cpp.Object)
    {
        mvData.field<Il2Cpp.ValueType>("cameraInfo").value.field<boolean>("hasCameraDecoration").value = false
        return this.method<Il2Cpp.Object>("CreateBackground3DPlayer").invoke(mvData, root)
    }
}

let fov: number = -1
export function overrideFov(targetFov: number) // if fov is under 0, it won't override
{
    fov = targetFov

    getAssemblyImage().class("Sekai.Core.SekaiCameraAspect").method<number>("CalculateVerticalFov").implementation = function(currentFov: number)
    {
        return fov < 0 ? currentFov : fov
    }
}