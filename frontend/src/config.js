const env = process.env.NODE_ENV;

const BASE_URL = "http://localhost:8080/api/";

const development = {
    LOGIN_URL: BASE_URL + "auth/login",
    SIGNIN_URL : BASE_URL + "auth/sign-in",
    LOGOUT_URL : BASE_URL + "auth/logout",
    FETCH_USER_URL:  BASE_URL + "auth/fetch_user",

    CREATE_EVENT_URL: BASE_URL + "create_event",
    DELETE_EVENT_URL: BASE_URL + "delete_event",
    GET_EVENTS_URL: BASE_URL + "get_events",

    ADD_PARTICIPANT_URL: BASE_URL + "add_participant",
    REMOVE_PARTICIPANT_URL: BASE_URL + "remove_participant",

    ADD_CONTACT_URL:  BASE_URL + "add_contact",
    DELETE_CONTACT_URL: BASE_URL + "delete_contact",
    GET_CONTACTS_URL : BASE_URL + "get_contacts"
};

module.exports = development;
