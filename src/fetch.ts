import fetch from "node-fetch"

export const get = async (url: string) => {
    const response = await fetch(url, {
        method: 'GET'
    })

    await response.json()
}
