import { 
  Arg, 
  Mutation, 
  Query, 
  Resolver, 
  Field, 
  ObjectType, 
  Ctx, 
  UseMiddleware,
  Int
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { MyContext }  from "../context/MyContext";
import { createRefreshToken, createAccessToken } from './../auth/auth';
import { isAuth } from "../middleware/isAuth";
import { sendRefreshToken } from "../auth/sendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";
// Entities
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { Tab } from "../entity/Tab";
import { Lyric } from "../entity/Lyric";
import { Project } from "../entity/Project";
import {Likes} from "../entity/Likes";
import { Comment } from "../entity/Comment";
import { Notification } from './../entity/Notification';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User, {nullable : true} )
  user: User | null;
  @Field(() => Boolean)
  error: boolean;
  @Field(() => String)
  errorType: string;
}

@ObjectType()
class RegisterResponse {
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  success : boolean
}

@ObjectType()
class SearchResult {
  @Field(() => [User])
  users: User;
  @Field(() => [Project])
  projects: Project;
}

@Resolver()
export class UserResolver {
  // FOR TESTING
  // GET      All registers users
  // RETURN   Array of users
  // USED     FOR TESTING
  @Query(() => [User])
  users() {
    return User.find();
  }

   // GET      All registers users
  // RETURN   Array of users
  // USED     FOR TESTING
  @Query(() => SearchResult)
  async searchApplication( 
    @Arg("input") input : string
  ) {

    const users = await User.find();
    const projects = await Project.find();
    
      // Create new array to store the search result
      const searchResult = {
        users: new Array,
        projects : new Array
      }
      // Looping through the users
      for(let i = 0; i < users.length; i++) {
         //  Check to see if the input matches any first or last name
         let f = users[i]!.firstName.includes(input,0);
         let l = users[i]!.lastName.includes(input,0);
         if (f === true || l === true) {
           // Push the user to search result if there is a match
           searchResult.users.push(users[i])
         } 
      }
        // Looping through the projects
        for(let i = 0; i < projects.length; i++) {
          //  Check to see if the input matches any first or last name
          let f = projects[i]!.name.includes(input,0);
          if (projects[i].isPublic && f === true) {
            // Push the user to search result if there is a match
            searchResult.projects.push(projects[i])
          } 
       }

    return searchResult;
  }

  // GET      User by id
  // RETURN   User
  // USED    
  @Query(() => User)
  @UseMiddleware(isAuth)
   async user(
      @Arg("userId", () => Int) userId: number
    ) {
     const user = await User.findOne({where: { id: userId}})
     if(!user) {
       throw new Error("No User by this ID");
     }
     return user;
    } 

  // GET      Logged in user
  // RETURN   User
  // USED     Throughout the application to see if user is authenticated
    @Query(() => User, { nullable: true })
    async me(
      @Ctx() context: MyContext
    ) {
      // Read the header and assign to authorization variable
      const authorization = context.req.headers['authorization'];
      // If no header then user is not authenticated : throw error
      if(!authorization) {
       return null;
      }
      try {
        // Find the token from the header : 
        // Split() will split "Bearer" from the token eg : "Bearer keafedfsdsa"
        const token = authorization.split(" ")[1];
        // verify that the token in the header is correct
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        // Find the user by userId in the token
        const user = await User.findOne(payload.userId)
        return user;
      } catch (err) {
        console.log(err)
        return null;
      }
    }
  // GET      Mates from their userId
  // RETURN   Array of Users
  // USED     On /mates
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getMates(
    @Arg("userId", () => Int) userId : number,
  ): Promise<User[] > {
    // Find the user
    const user: any = await User.findOne({ where : { id: userId } })
    var mates:any = [];
    // Loop through user's mates array : which is an array of userId's
    for(var x = 0; x < user.mates.length ; x++) {
      // Find the user that relates to that id and push to the new array
      mates.push(await User.findOne({ where : { id: user.mates[x]} }))
    }
    return mates;
  }

  // GET      Search Mates by Name
  // RETURN   Array of Users
  // USED     To search mates 
 @Query(() => [User])
 @UseMiddleware(isAuth)
 async searchMates(
   @Arg("name") name : string,
   @Ctx() { payload } : MyContext
 ) {
   // Find me
   const myId = payload?.userId;
   const me: any = await User.findOne({ where : { id: myId } }) 
   if(!me) {
     throw new Error("You need to have an account before adding friends")
   }

    const myMates = [...me.mates]

   // Create new array to hold the user data
   const userArr = [];
   // Loop through mates array, find the user and push to userArr
   for(let x = 0; x < myMates.length; x ++) {
      userArr.push(await User.findOne({ where : { id: myMates[x] } }))
   }  
    // Create new array to store the search result
    const searchResult = [];
    // Looping through the users
    for(let i = 0; i < userArr.length; i++) {
       //  Check to see if the input matches any first or last name
       let f = userArr[i]!.firstName.includes(name,0);
       let l = userArr[i]!.lastName.includes(name,0);
       if (f === true || l === true) {
         // Push the user to search result if there is a match
         searchResult.push(userArr[i])
       } 
    }
  // Returns users that match the search criteria and who aren't already contributors
   return searchResult;
  }

  // GET      Search Mates by Name and by project
  // RETURN   Array of Users
  // USED     To search mates to add as contributor
 @Query(() => [User])
 @UseMiddleware(isAuth)
 async searchMatesForContributors(
   @Arg("name") name : string,
   @Arg("projectId") projectId: string,
   @Ctx() { payload } : MyContext
 ) {
   // Find me
   const myId = payload?.userId;
   const me: any = await User.findOne({ where : { id: myId } }) 
   if(!me) {
     throw new Error("You need to have an account before adding friends")
   }
   // Find current project
   const project = await Project.findOne({ id : projectId })
   if(!project) {
     throw new Error("There is no project related to this id");
   }
    const myMates = [...me.mates]
    const contributors = [... project.contributors]
    // Checking if mate has contributed to the project
   // Loop through mates array and contributors
   for(let a = 0; a < myMates.length; a ++) {
    for(let j = 0; j < contributors.length; j++) {
      // If mate id is in contributors then splice from array
      if(myMates[a] === contributors[j])  {
       let index = myMates.indexOf(myMates[a])
        myMates.splice(index, 1)
      }
  }
} 
   // Create new array to hold the user data
   const userArr = [];
   // Loop through mates array, find the user and push to userArr
   for(let x = 0; x < myMates.length; x ++) {
      userArr.push(await User.findOne({ where : { id: myMates[x] } }))
   }  
    // Create new array to store the search result
    const searchResult = [];
    // Looping through the users that aren't already contributors
    for(let i = 0; i < userArr.length; i++) {
       //  Check to see if the input matches any first or last name
       let f = userArr[i]!.firstName.includes(name,0);
       let l = userArr[i]!.lastName.includes(name,0);
       if (f === true || l === true) {
         // Push the user to search result if there is a match
         searchResult.push(userArr[i])
       } 
    }
  // Returns users that match the search criteria and who aren't already contributors
   return searchResult;
  }

  // MUTATION      Update names and dob of user
  // RETURN        User
  // USED          On profile/me : for editing profile 
  @Mutation(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async updateNamesAndDob(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("dob") dob: string,
    @Ctx() { payload }: MyContext
  ): Promise<User | null> {
    // Find user using payload from context
    const id = payload!.userId
    const user = await User.findOne({ where: {id } })
    if(!user) {
     console.log("There is no user");
    }
    try {
      // Update the user entity with the arguments
      const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({firstName, lastName, dob})
      .where('id = :id', {
        id
      })
      .returning("*")
      .execute();
      return result.raw[0];
    } catch(err) {
      return err
    }
  }

  // MUTATION      Update user's bio
  // RETURN        User
  // USED          On profile/me : for editing profile 
  @Mutation(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBio(
    @Arg("bio") bio: string,
    @Ctx() { payload }: MyContext
  ): Promise<User | null> {
    // Find user using payload from context
    const id = payload!.userId
    const user = await User.findOne({ where: {id} })
    if(!user) {
     console.log("No User");
    }

    try {
      // Update the user entity with the arguments
      const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ bio })
      .where('id = :id', {
        id
      })
      .returning("*")
      .execute();
      
      return result.raw[0];
    } catch(err) {
      return err
    }
  }
  // MUTATION      Update user's instruments
  // RETURN        User
  // USED          On profile/me : for editing profile 
   @Mutation(() => User, { nullable: true })
   @UseMiddleware(isAuth)
   async updateInstruments(
     @Arg("instruments") instruments: string,
     @Ctx() { payload }: MyContext
   ): Promise<User | null> {
     // Find user using payload from context
     const id = payload!.userId;
     const user = await User.findOne({ where: {id } })
     if(!user) {
      console.log("There is no user");
     }
 
     try {
      // Update the user entity with the arguments
       const result = await getConnection()
       .createQueryBuilder()
       .update(User)
       .set({ instruments })
       .where('id = :id', {
         id
       })
       .returning("*")
       .execute();
       return result.raw[0];
     } catch(err) {
       return err
     }
   }
  // MUTATION      Remove mate
  // RETURN        Array of Users
  // USED          On /profile/:id
 @Mutation(() => [User])
 @UseMiddleware(isAuth)
 async removeMate(
   @Arg("mateId", () => Int) mateId : number,
   @Ctx() { payload } : MyContext
 ): Promise<User[]> {
   // Find logged in user and the selected mate
   const myId = payload?.userId;
   const me: any = await User.findOne({ where : { id: myId } }) 
   const mate : any = await User.findOne({ where : { id: mateId } })
   if(!me) {
     throw new Error("You need to have an account before adding friends")
   }
   if(!mate) {
    throw new Error("This user does not exist");
   }
   // REMOVING FRIEND FOR LOGGED IN USER
   // Taking the array of mates 
   // assining to new variable so we can modify
   var mates: any = [...me.mates]
   var index:number;
   // Loop through mates and check if they are already our mate
   for(var x = 0; x < mates.length; x++) {
     if(mates[x] === mateId) {
      index = mates.indexOf(mates[x]);
     }
   }
   // If index var is filled
   // Means we are mates and we can remove from array
   if(index! !== undefined) {
    mates.splice(index, 1);
   } else {
    throw new Error("You are not mates")
   }
   // Update my mates with new array
   await getConnection()
   .createQueryBuilder()
   .update(User)
   .set({ mates })
   .where('id = :id', {
     id : myId
   })
   .returning("*")
   .execute();

   // REMOVING FRIEND FOR OUR OTHER USER
   // Taking the array of mates 
   // assining to new variable so we can modify
   var mates2: any = [...mate.mates]
   var index2:number;
   // Loop through mates and check if they are already our mate
   for(var i = 0; i < mates2.length; i++) {
     if(mates2[i] === myId) {
      index2 = mates2.indexOf(mates2[i]);
     }
   }
   // If index var is filled
   // Means we are mates and we can remove from array
   if(index2! !== undefined) {
    mates2.splice(index2, 1);
   } else {
    throw new Error("You are not mates")
   }
   // Update other users mates with our new array
    await getConnection()
   .createQueryBuilder()
   .update(User)
   .set({ mates: mates2 })
   .where('id = :id', {
     id : mateId
   })
   .returning("*")
   .execute();
   try { 
    const user: any = await User.findOne({ where : { id: myId } }) 
    var mates:any = [];
    for(var x = 0; x < user.mates.length ; x++) {
      mates.push(await User.findOne({ where : { id: user.mates[x]} }))
    }
    return mates;
   } catch (err) {
      return err;
   }
 }

  // MUTATION      Add mate
  // RETURN        Array of Users
  // USED          On /profile/:id
 @Mutation(() => [User])
 @UseMiddleware(isAuth)
 async addMate(
   @Arg("mateId", () => Int) mateId : number,
   @Ctx() { payload } : MyContext
 ): Promise<User[]> {
   // Find logged in user and the selected mate
   const myId = payload?.userId;
   const me: any = await User.findOne({ where : { id: myId } }) 
   const mate : any = await User.findOne({ where : { id: mateId } })
   if(!me) {
     throw new Error("You need to have an account before adding friends")
   }

   if(!mate) {
    throw new Error("This user does not exist");
   }
   // ADDING FRIEND FOR LOGGED IN USER
   // Taking the array of mates 
   // assining to new variable so we can modify
   var mates: any = [...me.mates]
   var index:number;
   // Loop through mates and check if they are already our mate
   for(var x = 0; x < mates.length; x++) {
     if(mates[x] === mateId) {
      index = mates.indexOf(mates[x]);
     }
   }
   // If they're not our mate then pust to the array
   if(index! === undefined) {
    mates.push(mateId);
   } else {
    throw new Error("You are already mates")
   }
   // Update our mates with new array
   await getConnection()
   .createQueryBuilder()
   .update(User)
   .set({ mates })
   .where('id = :id', {
     id : myId
   })
   .returning("*")
   .execute();

   // ADDING FRIEND FOR OUR OTHER USER
   // Taking the array of mates 
   // assining to new variable so we can modify
   var mates2: any = [...mate.mates]
   var index2:number;
   // Loop through mates and check if they are already our mate
   for(var i = 0; i < mates2.length; i++) {
     if(mates2[i] === myId) {
      index2 = mates2.indexOf(mates2[i]);
     }
   }
   // If they're not our mate then pust to the array
   if(index2! === undefined) {
    mates2.push(myId);
   } else {
    throw new Error("You are already mates")
   }
   // Update other user's mates with new array
    await getConnection()
   .createQueryBuilder()
   .update(User)
   .set({ mates: mates2 })
   .where('id = :id', {
     id : mateId
   })
   .returning("*")
   .execute();
   try { 
   const user: any = await User.findOne({ where : { id: myId } }) 
    var mates:any = [];
    for(var x = 0; x < user.mates.length ; x++) {
      mates.push(await User.findOne({ where : { id: user.mates[x]} }))
    }
    return mates;
   } catch (err) {
      return err;
   }
 }

  // MUTATION      Delete user by Id
  // RETURN        Boolean
  // USED          On account settings
   @Mutation(() => Boolean)
   @UseMiddleware(isAuth)
   async deleteUser(
     @Ctx() { payload } : MyContext
   ): Promise<boolean> {
     await User.delete({ id : payload?.userId });
    return true;
   }

  // MUTATION      Revoke refresh token
  // RETURN        Boolean
  // USED          Incase user needs to change password or been hacked
  @Mutation(() => Boolean)
      async revokeRefreshTokensForUser(
        @Arg('userId', () => Int ) userId: number
      ) {
        await getConnection()
          .getRepository(User)
          .increment({ id: userId }, "tokenVersion", 1);
        return true;
   }

  // MUTATION      Logout user 
  // RETURN        Boolean
  // USED          On account settings
  @Mutation(() => Boolean)
  async logout(
    @Ctx() {res}: MyContext
  ) {
    sendRefreshToken(res, "");
    return true;
  }


  // MUTATION      Login user
  // RETURN        LoginResponse
  // USED          /login
  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email : string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    // Find user by the entered email and the user.email stored in the db
    const user = await User.findOne({ where : { email } });
    if(!user) {
      return {
        accessToken : "",
        user : null,
        error: true,
        errorType: "user"
      };
    }
    // If there is user compare password entered to the hashed user.password stored in db
    const valid = await compare(password, user!.password);
    //If passwords don't match throw error
    if(!valid) {
      // throw new Error("Incorrect password");
      return {
        accessToken : "",
        user : null,
        error: true,
        errorType: "password"
      };
    }
    // Login successful
    // Create cookie named dsi that stores the refreshtoken
    sendRefreshToken(res, createRefreshToken(user!));
    // Create accesstoken and return on succesful login
    return {
      accessToken : createAccessToken(user!),
      user : user!,
      error: false,
      errorType: ""
    };
  } 
  // MUTATION      Register user
  // RETURN        RegisterResponse
  // USED          /register
  @Mutation(() => RegisterResponse)
  async register(
    @Arg('email') email : string,
    @Arg('password') password: string,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('dob') dob: string,
  ):Promise<RegisterResponse> {
    const user = await User.findOne({ where : { email } });
    var response = {
      email: "",
      password: "",
      success : false
    };
    // If the email address has already been used then populate our response.email with error
    if(user) {
      response.email = "Email address already assigned to an existing user"
    }
    // If password under 6 character populate response.password with error
    if(password.length < 6) {
      response.password = "Password must contain more than 6 characters"
    }
    if(response.email !== "" || response.password !== "" ) {
      return response;
    }

    // parse the password into a bcrypt hash with the salt
    const hashedPassword = await hash(password, 12)
    // Assigning the user with an avatar
    // Randomly generate a number between 1 and 3 and assign those numbers to according avatar images
    var x = Math.floor((Math.random() * 3) + 1);
    var avatar;
    switch(x){
      case 1: 
        avatar = "default-blue";
        break;
      case 2: 
        avatar = "default-red";
        break;
      case 3: 
        avatar = "default-green";
        break;
    }
    try {
      // Insert all the arguments and data into the User table
      await User.insert({
        email,
        password : hashedPassword,
        firstName,
        lastName,
        dob,
        bio: "",
        instruments: "",
        mates: [],
        avatar: `/assets/icons/avatars/${avatar}.svg`,
      });
      
      response.success = true;
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  // FOR TESTING PURPOSES
  // Delete All Users
  // Mainly for testing
  @Mutation(() => Boolean)
    async purgeDatabase(): Promise<boolean> {
        const notification = await Notification.find()
        const comments = await Comment.find();
        const likes = await Likes.find()
        const posts = await Post.find();
        const tabs = await Tab.find();
        const lyrics = await Lyric.find();
        const projects = await Project.find();
        const users = await User.find()
        await Notification.remove(notification);
        await Comment.remove(comments);
        await Likes.remove(likes);
        await Post.remove(posts);
        await Tab.remove(tabs);
        await Lyric.remove(lyrics);
        await Project.remove(projects);
        await User.remove(users);
       return true;
  } 
}