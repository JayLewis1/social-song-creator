import { Resolver, Query, Mutation, Arg,Ctx, UseMiddleware, Int, ObjectType, Field,} from "type-graphql";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { MyContext }  from "../context/MyContext";
// Entities
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { Likes } from "../entity/Likes";
import { Comment } from "../entity/Comment";
import { Project } from "../entity/Project";

@ObjectType()
class PostsResponse {
  @Field(() => Post)
  post: Post;
  @Field(() => [Likes])
  likes: Likes[];
  @Field(() => [Comment])
  comments: Comment[];
  @Field(() => Int)
  postId: number;
  @Field(() => Project, { nullable: true })
  project: Project | null;
}

@ObjectType()
class ShareResponse {
  @Field(() => Boolean)
  success: boolean;
  @Field()
  response: string;
  @Field(() => Post)
  post: Post;
}


@Resolver()
export class PostResolver {
  // GET      All posts
  // RETURN   Array of post response 
  // USED     On Discover
  @Query(() => [PostsResponse])
  @UseMiddleware(isAuth)
  async allPosts() {
   const posts = await  Post.find();
   var postsResponse = new Array;
   for(var x = 0; x < posts.length; x++) {
    postsResponse.push({ 
      post : posts[x],
      likes : await Likes.find({where : { postId: posts[x].id }}),
      comments: await Comment.find({where : { postId: posts[x].id }}),
      project: await Project.findOne({where: { postId: {id: posts[x].id}}}),
      postId: posts[x].id
    })
   }
  return postsResponse
  }

  // GET      All posts from you mate
  // RETURN   Array of post response 
  // USED     On feed
  @Query(() => [PostsResponse])
  @UseMiddleware(isAuth)
  async myFeed(
    @Ctx() { payload } : MyContext
  ) {
   // Find logged in user
   const user = await User.findOne({ where : { id : payload!.userId  }}) 
   if(!user) {
     throw new Error("User is not logged in")
   }
   // Assign users mates to variable
   const userMates = user!.mates
   let matesPosts: any = [];
    // Find the logged in user's posts and push to array also
    matesPosts.push(await Post.find({ where: { creatorId: payload!.userId }}))
   // Loop through the userMates array
   for(let x = 0; x < userMates.length; x ++) {
     // Find all posts from mates, then push to feedPosts Array
    matesPosts.push(await Post.find({where : { creatorId : userMates[x] }}))
   }
   let feedPosts: any = [];
   // Loop through the mates then loop through the mate's posts
   for(let i = 0; i < matesPosts.length; i ++) {
    for(let j = 0; j < matesPosts[i].length; j++)  {
      // Push to feedPosts array
      feedPosts.push(matesPosts[i][j])
   }
  }
  // Sort the posts in date order
  let feedSortedByDate = feedPosts.slice().sort((a: any, b: any) => b.created - a.created)
  let postsResponse = new Array;
  for(var x = 0; x < feedSortedByDate.length; x++) {
    // Find the related likes, comments, project of the post and unshift to our postResponse array
    postsResponse.unshift({ 
      post : feedSortedByDate[x],
      likes : await Likes.find({where : { postId: feedSortedByDate[x].id }}),
      comments: await Comment.find({where : { postId: feedSortedByDate[x].id }}),
      project: await Project.findOne({where: { postId: {id: feedSortedByDate[x].id}}}),
      postId: feedSortedByDate[x].id
    })
   }
  return postsResponse
  }


  // GET      All posts from a user's id
  // RETURN   Array of post response 
  // USED     On profiles posts section
  @Query(() => [PostsResponse])
  @UseMiddleware(isAuth)
  async usersPosts(
    @Arg("userId", () => Int) userId : number,
  ){
    // Find all posts related to the id given in the arugment
    const posts = await  Post.find({where : {creatorId: userId}});
    var postsResponse = new Array;
    // Loop through posts and find the related likes, commments, project and push to our postsResponse array
    for(var x = 0; x < posts.length; x++) {
      postsResponse.push({ 
        post : posts[x],
        likes : await Likes.find({where : { postId: posts[x].id }}),
        comments: await Comment.find({where : { postId: posts[x].id }}),
        project: await Project.findOne({where: { postId: {id: posts[x].id}}}),
        postId: posts[x].id
      })
    }
   return postsResponse
  } 

  // GET      All posts from logged in user
  // RETURN   Array of post response 
  // USED     My Profile
  @Query(() => [PostsResponse])
  @UseMiddleware(isAuth)
  async myPosts(
    @Ctx() { payload } : MyContext
  ) {
    const id = payload!.userId;
    // Find all posts related to the id given through the context payload
    const posts = await  Post.find({where : {creatorId: id}});
    var postsResponse = new Array;
    // Loop through posts and find the related likes, commments, project and push to our postsResponse array
    for(var x = 0; x < posts.length; x++) {
     postsResponse.push({ 
       post : posts[x],
       likes : await Likes.find({where : { postId: posts[x].id }}),
       comments: await Comment.find({where : { postId: posts[x].id }}),
       project: await Project.findOne({where: { postId: {id: posts[x].id}}}),
       postId: posts[x].id
     })
    }
   return postsResponse
  } 


  // GET      User by the post id
  // RETURN   User
  // USED     
  @Query(() => User)
  @UseMiddleware(isAuth)
  async userByPostId(
    @Arg("postId", () => Int) postId: number
  ): Promise<User> {
    const post = await Post.findOne({where : {id: postId}});
    const user:any = await User.findOne({ where : {id: post!.creatorId} })
   return user;
  } 

  // GET      Comments related to post
  // RETURN   Array of comments
  // USED     Within the post component
  @Query(() => [Comment], { nullable: true })
  @UseMiddleware(isAuth)
  async getComments(
    @Arg("postId", () => Int) postId : number,
  ): Promise<Comment[] | null> {
    const comments: any = await  Comment.find({where : {postId}});
   return comments;
  } 

  // GET      Likes related to post
  // RETURN   Array of likes
  // USED     Within the post component
  @Query(() => [Likes])
  async fetchLikes(
    @Arg("postId", () => Int ) postId: number 
  ) {
    const allLikes: any = await Likes.find({ postId });
    return allLikes;
  }

  // MUTATION      Comment on post 
  // RETURN        Array of comments
  // USED          Within the post component
  @Mutation(() => [Comment], { nullable: true })
  @UseMiddleware(isAuth)
  async comment(
    @Arg("postId", () => Int) postId: number,
    @Arg("comment") comment: string,
    @Ctx() { payload } : MyContext
  ): Promise<Comment[] | null> {
    const id = payload!.userId
    const user = await User.findOne({ where: { id } })
    const userName = user?.firstName + " " + user?.lastName;

    await Comment.insert({
      postId,
      comment,
      userId: id,
      userName,
      avatar : user?.avatar
    })
  
    try {
      const comments = await Comment.find({ where : {postId}})
      return comments;
    } catch(err) {
      return err
    }
  }

  // MUTATION      Delete comment
  // RETURN        Array of comments
  // USED          Within the post component
  @Mutation(() => [Comment], { nullable: true })
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("commentId", () => Int) commentId : number,
    @Arg("postId", () => Int) postId : number,
  ): Promise<Comment[] | null> {
    const comment:any = await Comment.findOne({ where : { id: commentId, postId } })
    await Comment.remove(comment);
    try {
      const comments = await Comment.find({ where: { postId } })
      return comments
    } catch(err) {
      return err
    }
  }
 
  // MUTATION      Like post
  // RETURN        PostResponse
  // USED          Within the post component
  @Mutation(() => PostsResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async likePost(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { payload } : MyContext
  ): Promise<PostsResponse | null> {
    const id = payload!.userId
    // Check if user has already liked the post
    const like = await Likes.findOne({ postId, userId: id })
    // Find the comments and related post
    const comments = await Comment.find({ where : {postId}})
    const post: any = await Post.findOne({ where : { id: postId}})
    let postResponse;
    // If the user hasn't already liked the post
    if(!like) {
      // Insert like
      await Likes.insert({ 
        postId,
        userId: id
       })
       postResponse = {
        post,
        likes: await Likes.find({ postId }),
        comments,
        project: await Project.findOne({where: {postId: {id: postId}}}) || null,
        postId
      }
       return postResponse;
    } 
    else if(like) {
      // If user has already like the post then remove the like
      await Likes.remove(like)
      postResponse = {
        post,
        likes: await Likes.find({ postId }),
        comments,
        project : await Project.findOne({where: {postId: {id: postId}}}) || null,
        postId
      }
       return postResponse;
    }
    return null;
  }

  // MUTATION      Delete post
  // RETURN        Array of PostResponse
  // USED          Feed and user's profile
  @Mutation(() => [PostsResponse])
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("postId", () => Int) postId : number,
    @Ctx() { payload } : MyContext
   ) {
    const id = payload!.userId;
    // Find likes and comments related to the post and remove them
    const likes = await Likes.find({ where: { postId } })
    const comments = await Comment.find({ where: { postId } })
    await Likes.remove(likes)
    await Comment.remove(comments) 
    // Find the related project
    const project = await Project.findOne({where: { postId }});
    // If there is a project related to the post
    if(project) {
      // Get connection, find relation and set to null
      await getConnection()
      .createQueryBuilder()
      .relation(Project, "post")
      .of(project.id)
      .set(null)
    }
    try {
      // Remove post once all relations have been removed
      const post: any = await Post.findOne({ where : { id: postId, creatorId: id}})
      await Post.remove(post)
      // Find all posts by the logged in user and assign them to the postsResponse along with their relations
      const posts = await Post.find({where : {creatorId: id}});
      var postsResponse = [];
      for(var x = 0; x < posts.length; x++) {
      postsResponse.push({ 
        post : posts[x],
        likes : await Likes.find({where : { postId: posts[x].id }}),
        comments: await Comment.find({where : { postId: posts[x].id }}),
        postId: posts[x].id
      })
      }
     return postsResponse;
    } catch(err) {
      return err;
    }
  }

  // MUTATION      Share project
  // RETURN        Returns post
  // USED          Feed and user's profile
  @Mutation(() => ShareResponse)
  @UseMiddleware(isAuth)
  async shareProject(
    @Arg('projectId') projectId: string,
    @Ctx() { payload } : MyContext
  ) {
        // Find the logged in user
        const id = payload!.userId
        const user = await User.findOne({where : {id}})
        if(!user) {
          throw new Error("There is no user")
        }
        // Find the project by it's id
        const project = await Project.findOne({where : {id : projectId}})
        if(!project) {
          throw new Error("There is no project")
        }
        const post = await Post.findOne({where : {projectId : projectId}})
        if(post) {
         console.log(post)
         const shareResponse = {
          success : false,
          response : "This project has already been shared",
          post
        }
        return shareResponse;
        }
        
        // Insert the post with the related project
          const response = await Post.insert({
            creator: user,
            creatorName : user.firstName + " " + user.lastName,
            avatar : user.avatar,
            content : project.name,
            project: project
            });
            
        try {
          // Find post by the response id
          const post:any = await Post.findOne({ where: { id: response.raw[0].id }})
          // Update the newly related project's postId field so now theyre related on both entities 
          await getConnection()
          .createQueryBuilder()
          .update(Project)
          .set({ postId : post.id })
          .where('id = :id', {
            id : project.id
          })
          .returning("*")
          .execute();
          // Return post
          const shareResponse = {
            success : true,
            response : "Project Shared",
            post
          }
          return shareResponse;
        }catch(err) {
          return err;
        }
  }

  // MUTATION      Create post
  // RETURN        Returns post
  // USED          Feed and user's profile
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('content') content: string,
    @Ctx() { payload } : MyContext
  ):Promise<Post> {
        const id = payload!.userId
        const user = await User.findOne({where : {id}})
        if(!user) {
          throw new Error("There is no user")
        }
        // Insert the new post
       const response = await Post.insert({
        creator: user,
        creatorName : user.firstName + " " + user.lastName,
        avatar : user.avatar,
        content
        });
        try {
          // Find the post by response id and return it 
          const post:any = await Post.findOne({ where: { id: response.raw[0].id }})
          return post;
        }catch(err) {
          return err;
        }
  }
  // FOR TESTING :    DELETE ALL POSTS
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAllPosts(
  ) {
    const posts = await Post.find();
    const likes = await Likes.find()
    const comments = await Comment.find();
    console.log(likes);
    await Comment.remove(comments)
    await Likes.remove(likes);
    await Post.remove(posts);
    return true
  }
}