import toast from "react-hot-toast";
import { auth, useUser } from "./firebaseAuth";
import useSWR from "swr";
import { mutate } from "swr";
import { DateTimeFormatToView } from "./components/DataTable";
import dayjs from "dayjs";
import { DateTimeFormFormat, DateTimeFormatFromServer } from "../common/DateTime";

const makeDefaultHeaders = async () => {
    const user = auth.currentUser;

    const headers = new Headers({
        "Content-Type": "application/json",
    });
    if (user) {
        const token = await user.getIdToken();
        headers.append("Authorization", "Bearer " + token);
    }

    return headers;
};

const guardResponseOk = (res: Response) => {
    if (res.ok) {
        return Promise.resolve(res);
    } else {
        return res.text().then((text) => Promise.reject(text));
    }
};

export type Endpoint = `/${string}`;

export const sendToEndpoint =
    (method: string) => (endpoint: Endpoint) => async (payload?: object) => {
        console.log(payload);
        const headers = await makeDefaultHeaders();

        const responsePromise = fetch(endpoint, {
            headers,
            body: JSON.stringify(payload),
            method: method,
        })
            .then(guardResponseOk)
            .then((res) => res.text());

        toast.promise(responsePromise, {
            loading: "Dodawanie...",
            success: (d) => d,
            error: (e) => e,
        });

        const response = await responsePromise;
        mutate((key) => typeof key === "string" && endpoint.startsWith(key));
        console.log(method, "to", endpoint, "got response", response);
        return response;
    };

export const postToEndpoint = sendToEndpoint("POST");
export const putToEndpoint = sendToEndpoint("PUT");
export const patchEndpoint = sendToEndpoint("PATCH");

export const deleteFromEndpoint = (endpoint: Endpoint) => async () => {
    const headers = await makeDefaultHeaders();
    const responsePromise = fetch(endpoint, {
        headers,
        method: "DELETE",
    })
        .then(guardResponseOk)
        .then((res) => res.text());

    toast.promise(responsePromise, {
        loading: "Usuwanie...",
        error: (e) => e,
        success: (d) => d,
    });

    const response = await responsePromise;
    mutate((key) => typeof key === "string" && endpoint.startsWith(key));
    return response;
};

export const fetchJSON = async (endpoint: RequestInfo) => {
    const user = auth.currentUser;
    const headers = new Headers();
    if (user) {
        const token = await user.getIdToken();
        headers.append("Authorization", "Bearer " + token);
    }

    const data = await fetch(endpoint, { headers })
        .then(guardResponseOk)
        .then((res) => res.json());
    console.log("fetched from", endpoint, data);
    return data;
};

export const useGetEndpoint = <Data>(endpoint: Endpoint | null) => {
    const [user] = useUser();
    return useSWR<Data, Error, string | null>(user ? endpoint : null, fetchJSON);
};

export const showDateTime = (date: string | null | undefined) =>
    dayjs(date, DateTimeFormatFromServer).format(DateTimeFormatToView);

export const formDateTime = (date: string | null | undefined) =>
    dayjs(date, DateTimeFormatFromServer).format(DateTimeFormFormat);
