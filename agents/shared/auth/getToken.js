import axios from "axios";
export async function getToken(scope) {
    const basicAuth = Buffer.from(
        `${process.env.DESCOPE_CLIENT_ID}:${process.env.DESCOPE_CLIENT_SECRET}`
    ).toString("base64");
    const resp = await axios.post(
        process.env.DESCOPE_TOKEN_URL,
        new URLSearchParams({
            grant_type: "client_credentials",
            audience: process.env.DESCOPE_AUDIENCE,
            scope
        }),
        { headers: { "Authorization": `Basic ${basicAuth}`, "Content-Type":"application/x-www-form-urlencoded"} }
    );
    return resp.data.access_token;
}
