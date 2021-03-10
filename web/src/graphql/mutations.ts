import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    user {
      id
      email
      avatar
      firstName
      lastName
      dob
      bio
      instruments
      mates
      created
    }
    error
    errorType
  }
}`

export const REGISTER_USER = gql`
mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!, $dob: String!) {
  register(email: $email, password: $password, firstName: $firstName,lastName: $lastName, dob: $dob) {
    email
    password
    success
  }
}`

export const LOGOUT_USER = gql`
mutation Logout {
  logout
}`
// UPDATING PROFILE
export const UPDATE_NAMES_AND_DOB = gql`
mutation UpdateNamesAndDob($firstName: String!, $lastName: String!, $dob: String! ){
  updateNamesAndDob(firstName: $firstName, lastName: $lastName, dob:$dob ){
    id
    firstName
    lastName
    dob
    bio
    instruments
  }
}`
export const UPDATE_BIO = gql`
mutation UpdateBio($bio: String!){
  updateBio( bio: $bio){
    id
    firstName
    lastName
    dob
    bio
    instruments
  }
}`
export const UPDATE_INSTRUMENTS = gql`
mutation UpdateInstruments($instruments:String!){
  updateInstruments(instruments: $instruments){
    id
    firstName
    lastName
    dob
    bio
    instruments
  }
}`
// POSTS
export const CREATE_POST = gql`
mutation CreatePost($content: String!) {
  createPost(content: $content) {
    id 
    content 
    creatorId
    shares
    created
  }
}` 
export const DELETE_POST =  gql`
mutation DeletePost($postId: Int!) {
  deletePost(postId: $postId) {
    post {
      id
      content
      creatorName 
      shares
      created
    }
    comments {
      id
      postId
      userId
      userName
      comment
      created
    }
    likes {
      id
    postId
    userId
    }
  } 
}`
export const SHARE_PROJECT = gql`
mutation ShareProject($projectId: String!) {
  shareProject(projectId : $projectId) {
    success
    response
    post {
    	id
      content
      creatorId
      creatorName
      avatar
      projectId
      project {
        id
      }
      shares
      created
    }
  }
}`
// COMMENTS
export const COMMENT_ON_POST  = gql`
mutation Comment($postId: Int!, $comment: String!) {
  comment(postId:$postId, comment: $comment ) {
      id
      postId
      userId
      userName
      comment
      created
  }
}`
export const DELETE_COMMENT = gql `
mutation DeleteComment($postId: Int!, $commentId: Int!) {
  deleteComment(postId: $postId, commentId: $commentId) {
      id
      postId
      userId
      userName
      comment
      created
  }
}`
// LIKES
export const LIKE_POST = gql`
mutation LikePost($postId: Int!) {
  likePost(postId:$postId ) {
    post {
      id
      content
      creatorName 
      shares
      created
    }
    comments {
      id
      postId
      userId
      userName
      comment
      created
    }
    likes {
      id
    postId
    userId
    }
  }
}`
// PROJECTS
export const CREATE_PROJECT = gql`
mutation CreateProject($name: String!, $isPublic: Boolean!){
  createProject(name:$name, isPublic:$isPublic) {
    error
    payload
  }
}`
export const DELETE_PROJECT = gql`
mutation DeleteProject($id: String!){
  deleteProject(id:$id) {
    id
		name
    isPublic
		creatorId
  }
}`
// LYRICS
export const CREATE_LYRIC =  gql`
mutation CreateLyric($lyric: String!, $option: String!, $projectId: String!) {
  createLyric(lyric: $lyric, option:  $option, projectId:$projectId) {
    id
		lyric
    option 
    projectId
  }
}`
export const DELETE_LYRIC = gql`
mutation DeleteLyric($projectId: String!, $lyricId: Float!){
  deleteLyric(projectId:$projectId, lyricId: $lyricId) {
    id
		lyric
    option 
    projectId
  }
}`
// TABS
export const CREATE_TAB =  gql`
mutation CreateTab($projectId: String!, $tab: [String!]!, $description: String!){
  createTab(projectId:$projectId, description: $description, tab: $tab) {
    id
    tab
    description
    projectId
  }
}`
export const DELETE_TAB = gql`
mutation DeleteTab($projectId: String!, $tabId: Int!){
  deleteTab(projectId:$projectId, tabId:$tabId ){
    id
   	tab
  }
}`
// TRACKS
export const CREATE_TRACK =  gql`
mutation CreateTrack($name: String!, $projectId: String!) {
  createTrack(name:$name, projectId:$projectId) {
    id
    name
    projectId
  } 
}`
export const DELETE_TRACK = gql`
mutation DeleteTrack($trackId: String!, $projectId: String!){
  deleteTrack(trackId: $trackId, projectId: $projectId) {
    id
    name
    projectId
  }
}`
export const ASSIGN_MAIN_TRACK_TO_PROJECT = gql`
mutation AssignTrackToProject($projectId: String!, $trackId : String!) {
  assignTrackToProject(projectId: $projectId, trackId : $trackId) {
    id
		name
		isPublic
		creatorId
    contributors
    mainTrack
    created
  }
}`

// CONTRIBUTORS ON PROJECT
export const ADD_CONTRIBUTOR = gql`
mutation AddContributor($projectId: String!, $userId: Int!){
  addContributor(projectId: $projectId, userId: $userId ) {
    id
    email
    firstName
    lastName
    dob
    bio
    instruments
    avatar
  }
}`
export const REMOVE_CONTRIBUTOR = gql`
mutation RemoveContributor($userId: Int!, $projectId: String!){
  removeContributor(userId : $userId, projectId: $projectId) {
    id
    email
    firstName
    lastName
    dob
    bio
    instruments
    avatar
  } 
}`
// MATES
export const ADD_MATE = gql`
mutation AddMate($mateId: Int!) {
  addMate(mateId:$mateId) {
    id
    email
    firstName
    lastName
    dob
	  mates
    created
  }
}`
export const REMOVE_MATE = gql`
mutation RemoveMate($mateId: Int!) {
  removeMate(mateId:$mateId) {
    id
    email
    firstName
    lastName
    avatar
    dob
    bio
    instruments
	  mates
    created
  }
}` 
// NOTIFICATIONS
export const SEND_NOTIFICATION = gql`
mutation SendNotfication($recipient: Int!, $message: String!, $type: String! ){ 
	sendNotfication(recipient:$recipient , message:$message, type:$type) {
    reqBlocked
    status
    type
  }
}`
export const DELETE_NOTIFICATION = gql`
mutation DeleteNotification($id: Int!){
  deleteNotification(id:$id ) {
    message 
    id
    recipient
    senderId
    senderName
    avatar
    read
    type
    created 
  }
}`