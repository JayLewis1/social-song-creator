import { gql } from "@apollo/client";

// USER
export const MY_ACCOUNT = gql`
{
  me {
    id
    email
    firstName
    lastName
    dob
    bio
    instruments
    mates
    created
    avatar
 } 
}`
export const USER_BY_ID = gql`
 query UserById($userId: Int!){
  user(userId: $userId) {
    id
    email
    firstName
    lastName
    bio
    instruments
    dob
    mates
    created
    avatar
  }
}`
// POSTS
export const FEED_POSTS =gql`
{
  myFeed {
    post {
    id 
    content 
    creatorId
    creatorName
    avatar
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
      avatar
    }
  likes {
    id
    postId
    userId
    }
    project {
        id
        name
        isPublic
        creatorId
        creatorName
        contributors
        mainTrack
        postId
    }
  postId
  }
}`

export const ALL_POSTS = gql`
{
  allPosts {
    post {
    id 
    content 
    creatorId
    creatorName
    avatar
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
      avatar
    }
  likes {
    id
    postId
    userId
    }
    project {
        id
        name
        isPublic
        creatorId
        creatorName
        contributors
        mainTrack
        postId
    }
  postId
  }
}`
export const MY_POSTS = gql`
  {
  myPosts {
    post {
    id 
    content 
    creatorId
    creatorName
    shares
    created
    avatar
  }
  comments {
      id
      postId
      userId
      userName
      comment
      created
      avatar
    }
  likes {
    id
    postId
    userId
    }
    project {
        id
        name
        isPublic
        creatorId
        creatorName
        contributors
        mainTrack
        postId
    }
  postId
  }
}`
export const USERS_POSTS = gql`
query($userId: Int! ){
  usersPosts(userId: $userId) {
  post {
  id 
  content 
  creatorId
  creatorName
  shares
  created
  avatar
}
comments {
    id
    postId
    userId
    userName
    comment
    created
    avatar
  }
likes {
  id
  postId
  userId
  }
  project {
      id
      name
      isPublic
      creatorId
      creatorName
      contributors
      mainTrack
      postId
      created
  }
postId
}
}`
export const USER_BY_POST_ID = gql`
query($postId: Int!) {
  userByPostId(postId :$postId) {
    id
  }
}`
// COMMENTS
export const GET_COMMENTS = gql`
query($postId: Int!) {
  getComments(postId: $postId) {
      id
      postId
      userId
      userName
      comment
      created
      avatar
  }
}`
// LIKES
export const GET_LIKES = gql`
query FetchLikes($postId: Int!){
  fetchLikes(postId: $postId) {
    id
    userId
  }
}`
// PROJECTS
export const MY_PROJECTS = gql`
{
  myProjects {
        id
        name
        isPublic
        creatorId
        creatorName
        created
        mainTrack
        postId
  }
}`

export const CURRENT_PROJECT = gql`
 query CurrentProject($projectId: String!){
   currentProject(projectId: $projectId) {
    id
		name
		isPublic
		creatorId
    creatorName
    contributors
    mainTrack
    created
    postId
  }
}`
export const USERS_PROJECTS = gql`
query UsersProjects($userId: Int!){
  usersProjects(userId:$userId) {
    id
		name
		isPublic
		creatorId
    creatorName
    contributors
    created
  }
}`
export const SEARCH_PROJECTS = gql`
query SearchProjects($projectName: String!) {
  searchProjects(projectName: $projectName) {
    id
		name
		isPublic
		creatorId
    creatorName
    contributors
    mainTrack
    created
  }
}`
// LYRICS
export const GET_LYRICS = gql`
query Lyrics($projectId: String!){
  lyrics(projectId: $projectId){
    id
		lyric
    option 
    projectId
  }
}`
// TABS
export const GET_TABS = gql`
query Tabs($projectId: String!){
  tabs(projectId:$projectId) {
    description
    id
    projectId
    tab
  }
}`
// TRACKS
export const GET_TRACKS = gql`
query Tracks($projectId: String!){
  tracks(projectId:$projectId ) {
    id
    name
    projectId
  }
}`
// CONTRIBUTORS
export const GET_CONTRIBUTORS = gql`
query Contributors($projectId: String!){
  contributors(projectId: $projectId){
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
// NOTIFICATIONS
export const GET_NOTIFICATIONS = gql`
{
  notifications {
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
export const VALIDATE_NOTIFICATION = gql`
query ValidateNotification($recipient: Int!, $type: String!){
  validateNotification(recipient : $recipient, type: $type) 
}`

// MATES
export const GET_MY_MATES = gql`
query GetMates($userId: Int!){
  getMates(userId: $userId) {
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
export const SEARCH_MATES = gql`
query SearchMates($name: String!){
  searchMates(name: $name) {
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
export const SEARCH_MATES_FOR_CONTRIBUTORS = gql`
query SearchMatesForContributors($name: String!, $projectId: String!){
  searchMatesForContributors(name: $name, projectId: $projectId) {
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
export const SEARCH_APPLICATION = gql`
query SearchApplication($input: String!){
  searchApplication(input: $input) {
    users {
      id
      email
      firstName
      lastName
      dob
      bio
      instruments
      avatar
      mates
      created
    }
  projects {
    id
    name
    isPublic
    creatorId
    creatorName
    contributors
    postId
    created
  }
  }
}`