import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";


const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction ? process.env.GRAFBASE_API_URL || '' : " http://127.0.0.1:4000/graphql";
const apiKey = isProduction ? process.env.GRAFBASE_API_KEY || '' : "1234";
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000";
console.log(`${serverUrl}/api/auth/token`)

const client = new GraphQLClient(apiUrl);
const makeGraphQlRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables);
    } catch (error) {
        throw error;
    }
}
export const getUser = (email: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQlRequest(getUserQuery, { email });
}
export const createUser = (name: string, email: string, avatarUrl: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQlRequest(createUserMutation, { input: { name, email, avatarUrl } });
}
export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`);
        return response.json();
    } catch (error) {
        throw error;
    }
};
const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ path: imagePath })
        });
        return response.json();
    } catch (error) {
        throw error;
    }
}
export const createNewProject = async (form: ProjectForm, createorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image);
    if (imageUrl.url) {
        console.log(imageUrl.url)
        client.setHeader("Authorization", `Bearer ${token}`)
        return makeGraphQlRequest(createProjectMutation, {
            input: {
                ...form, image: imageUrl.url, createdBy: {
                    link: createorId
                }
            }
        });
    }
}
export const fetchAllProjects = async (category?: string, endcursor?: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQlRequest(projectsQuery, { category, endcursor });
}
export const getProjectDetails = (id: string) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQlRequest(getProjectByIdQuery, { id });
}
export const getUserProjects = (id: string, last?: number) => {
    client.setHeader('x-api-key', apiKey);
    return makeGraphQlRequest(getProjectsOfUserQuery, { id, last });
}
export const deleteProject = (id: string, token: string) => {
    client.setHeader("Authorization", `Bearer ${token}`)
    return makeGraphQlRequest(deleteProjectMutation, { id });
};
export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
    function isBase64DataURL(value: string) {
        // Regular expression pattern to match Base64 data URLs
        var regex = /^data:([a-z]+\/[a-z]+);base64,([A-Za-z0-9+/=])+$/;
        return regex.test(value);
    }
    let updatedForm = { ...form };
    const isUploadingNewImage = isBase64DataURL(form.image);
    if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image);
        if (imageUrl.url) {
            updatedForm = { ...form, image: imageUrl.url }
        }
    }
    client.setHeader("Authorization", `Bearer ${token}`)
    return makeGraphQlRequest(updateProjectMutation, { id: projectId, input: updatedForm });
};