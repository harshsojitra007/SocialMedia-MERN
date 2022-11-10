import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// define a service user a base URL
const AppApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/"
    }),
    endpoints: (builder) => ({

        signUpUser: builder.mutation({
            query: (user) => ({
                url: "/users/unverified",
                method: "POST",
                body: user
            }),
        }),

        verifyUser: builder.mutation({
            query: () => ({
                url: "/users/verify/:jwtToken",
                method: "POST",
            }),
        }),

        loginUser: builder.mutation({
            query: (user) => ({
                url: '/users/login',
                method: "POST",
                body: user
            }),
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/users/update/profile",
                method: "post",
                body: data,
            }),
        }),
        
        postNewPicture: builder.mutation({
            query: (data) => ({
                url: "/p/new/post",
                method: "POST",
                body: data,
            }),
        }),

        likeThePost: builder.mutation({
            query: (data) => ({
                url: "/p/like",
                method: "post",
                body: data,
            }),
        }),

        fetchPostDetails: builder.mutation({
            query: (data) => ({
                url: "/p/details",
                method: "post",
                body: data,
            }),
        }),

        commentOnPost: builder.mutation({
            query: (data) => ({
                url: "/p/new/comment",
                method: "post",
                body: data,
            }),
        }),

        deletePost: builder.mutation({
            query: (data) => ({
                url: "/p/delete",
                method: "post",
                body: data,
            }),
        }),

        userCurrentState: builder.mutation({
            query: (data) => ({
                url: "/f/current/state",
                method: "post",
                body: data,
            }),
        }),

        fetchUsernames: builder.mutation({
            query: (data) => ({
                url: "/f/usernames",
                method: "post",
                body: data,
            }),
        }),

        fetchAllUserNames: builder.mutation({
            query: (data) => ({
                url: "/f/connection",
                method: "post",
                body: data,
            }),
        }),

        fetchRelevantPosts: builder.mutation({
            query: (data) => ({
                url: "/f/posts",
                method: "post",
                body: data,
            }),
        }),

        fetchUsersPosts: builder.mutation({
            query: (data) => ({
                url: "/f/user/posts",
                method: "post",
                body: data,
            }),
        }),

        fetchFriends: builder.mutation({
            query: (data) => ({
                url: "/f/friends",
                method: "post",
                body: data,
            }),
        }),

        fetchMessages: builder.mutation({
            query: (data) => ({
                url: "/f/messages",
                method: "post",
                body: data,
            }),
        }),

        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/request/message",
                method: "post",
                body: data,
            }),
        }),

        getRequestLogs: builder.mutation({
            query: (data) => ({
                url: "/request/sent",
                method: "post",
                body: data,
            }),
        }),
        
        fetchPendingRequest: builder.mutation({
            query: (data) => ({
                url: "/request/pending",
                method: "post",
                body: data,
            }),
        }),

        joinRoom: builder.mutation({
            query: (data) => ({
                url: "/request/join/room",
                method: "post",
                body: data,
            }),
        }),

        friendShipStatus: builder.mutation({
            query: (data) => ({
                url: "/friend/status",
                method: "post",
                body: data,
            }),
        }),

        addFriend: builder.mutation({
            query: (data) => ({
                url: "/friend/add",
                method: "post",
                body: data,
            }),
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/friend/accept",
                method: "post",
                body: data,
            }),
        }),

        deleteFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/friend/delete",
                method: "post",
                body: data,
            }),
        }),

        cancelFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/friend/cancel",
                method: "post",
                body: data,
            }),
        }),

        removeFriend: builder.mutation({
            query: (data) => ({
                url: "/friend/remove",
                method: "post",
                body: data,
            }),
        }),

        getMutualCount: builder.mutation({
            query: (data) => ({
                url: "/friend/mutual/count",
                method: "post",
                body: data,
            }),
        }),
    
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload
            }),
        }),

    }),
});

export const { useSignUpUserMutation, useLoginUserMutation, useUserCurrentStateMutation, useUpdateProfileMutation, usePostNewPictureMutation, useLikeThePostMutation, useCommentOnPostMutation, useDeletePostMutation, useFetchUsernamesMutation, useFetchAllUserNamesMutation, useFetchFriendsMutation, useFetchMessagesMutation, useFetchRelevantPostsMutation, useFetchUsersPostsMutation, useFetchPostDetailsMutation, useSendMessageMutation, useJoinRoomMutation, useGetRequestLogsMutation, useFetchPendingRequestMutation, useFriendShipStatusMutation, useAddFriendMutation,  useAcceptFriendRequestMutation, useDeleteFriendRequestMutation, useCancelFriendRequestMutation, useRemoveFriendMutation, useGetMutualCountMutation, useLogoutUserMutation } = AppApi;

export default AppApi;