import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addNotifications: ({state, payload}) => {},
        resetNotifications: ({state, payload}) => {},
    },
    extraReducers: (builder) => {
        // save user after signup
        // builder.addMatcher(appApi.endpoints.verifyUser.matchFulfilled, (state, {payload}) => payload);
        
        // save user after login
        // builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, {payload}) => payload);
        
        // logout & destroy the session for user
        // builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    }
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;