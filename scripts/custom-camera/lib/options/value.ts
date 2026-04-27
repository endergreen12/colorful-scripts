import "frida-il2cpp-bridge"

export let isThirdPersonEnabled = false
export let changeFOV = false
export let targetFOV = 70
export let targetCharIndex = 0

export function SetThirdPersonEnable(enable: boolean)
{
    isThirdPersonEnabled = enable
}

export function SetChangeFOVEnable(enable: boolean)
{
    changeFOV = enable
}

export function SetTargetFOVValue(value: number)
{
    targetFOV = value
}

export function SetTargetCharIndex(index: number)
{
    targetCharIndex = index
}