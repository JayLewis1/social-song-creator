import { Arg, Resolver, Mutation, Query, UseMiddleware, Ctx, Int, ObjectType, Field  } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext }  from "../context/MyContext";
import { getConnection } from "typeorm"
// Entities
import { User } from "../entity/User";
import { Project } from "../entity/Project";
import { Lyric } from "../entity/Lyric";
import { Tab } from "../entity/Tab";
import { Track } from "../entity/Track";

@ObjectType()
class ProjectResponse {
  @Field(() => Boolean)
  error: Boolean;

  @Field(() => String)
  payload: string;
}
@Resolver()
export class ProjectResolver {
  // GET      All projects from logged in user
  // RETURN   Array of projects
  // USED     On /profile/me : my profile
  @UseMiddleware(isAuth)
  @Query(() => [Project])
  async myProjects(
    @Ctx() { payload } : MyContext,
  ) {
    return await Project.find({ creatorId: payload!.userId })
  }

  // GET      All projects from a user's ID
  // RETURN   Array of public projects
  // USED     On /profile/:id : User's profile
  @Query(() => [Project])
  async usersProjects(
    @Arg("userId", () => Int) userId : number
  ) {
    // Find all of user's projects
    const allProjects = await Project.find({ where: { creatorId: userId } })
    // Create an array variable which will hold all public projects
    var publicProjects: any = [];
    for(var x = 0; x < allProjects.length; x ++) {
      if(allProjects[x].isPublic === true) {
        // If project is set as public then push to array
        publicProjects.push(allProjects[x]);
      }
    }
    // Return all projects which are public
    return publicProjects;
  }
  // GET      Project by it's id
  // RETURN   Project
  // USED     On /workspace/:projectId : The project's workspace
  @Query(() => Project)
  @UseMiddleware(isAuth)
  async currentProject(
    @Arg('projectId') projectId: string,
  ) {
    const currentProject = await Project.findOne({ where : {id : projectId}})
    if(!currentProject) {
      throw new Error("There is no project")
    }
    try {
      return currentProject;
    } catch(err) {
      console.log(err);
      return err;
    }
  }
  // GET      Search projects
  // RETURN   Array of projects
  // USED     On /projects
  @UseMiddleware(isAuth)
  @Query(() => [Project])
  async searchProjects(
    @Arg("projectName") projectName: string,
    @Ctx() { payload }: MyContext
  ) {
    // Find all projects by user
    const projects = await Project.find({ creatorId: payload!.userId })

    let searchResult = [];
    if(projectName !== "") {
     // Loop through the projects
     for(let i = 0; i < projects.length; i++) {
      //  Check to see if the input matches any project names
      let f = projects[i]!.name.includes(projectName,0);
      if (f === true) {
        // Push the user to search result if there is a match
        searchResult.push(projects[i])
      } 
     }
    }

    return searchResult;
  }
  // GET      Contributors by the projectId
  // RETURN   Array of Contributors
  // USED     On /workspace/:projectId : The project's workspace
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async contributors(
    @Arg("projectId") projectId : string
  ) {
    const project:any = await Project.findOne({ id: projectId })
    if(!project) {
      throw new Error("There is no project.")
    }
    try {
      // Creat a new array variable
      var contributors: Array<User> = [];
      // Loop through contributors 
      
      for(var x: any = 0; x < project!.contributors.length; x++) {
        // Using the id from the project.contributors
        // Find the user and push to the new array
        var user:any = await User.findOne({ id: project!.contributors[x] })
        contributors.push(user)
      }       
      return contributors;
    } catch(err) {
      return err
    }
  }
  // GET      Lyrics by the projectId
  // RETURN   Array of Lyrics
  // USED     On /workspace/:projectId : The project's workspace
  @Query(() => [Lyric])
  @UseMiddleware(isAuth)
  async lyrics(
    @Arg("projectId") projectId : string
  ) {
    return Lyric.find({ projectId });
  }

  // GET      Tabs by projectId id
  // RETURN   Array of Tabs
  // USED     On /workspace/:projectId : The project's workspace
 @Query(() => [Tab])
 @UseMiddleware(isAuth)
 async tabs(
   @Arg("projectId") projectId : string
 ) {
   return Tab.find({ projectId });
 }

  // GET      Tabs by projectId id
  // RETURN   Array of Tabs
  // USED     On /workspace/:projectId : The project's workspace
  @Query(() => [Track])
  @UseMiddleware(isAuth)
  async tracks(
    @Arg("projectId") projectId : string
  ) {
    return Track.find({ projectId });
  }
 
  // MUTATION      CREATE Lyric
  // RETURN        The Lyric
  // USED          On /workspace/:projectId : The project's workspace
 @Mutation(() => Lyric)
  @UseMiddleware(isAuth)
  async createLyric(
    @Arg('lyric') lyric: string,
    @Arg('option') option: string,
    @Arg('projectId') projectId: string,
    @Ctx() { payload } : MyContext,
  ) {
    const userId = payload?.userId;
    // Find the current project
    const project = await Project.findOne({ where : { id: projectId } })
    if(!project) {
      throw new Error("There is no project");
    }
    // Check if the user is the project creator
   // To see if they are authorised to edit the project
   if(userId === project.creatorId) {
      // Insert data into the Lyric table
      const response = await Lyric.insert({
        lyric,
        option,
        projectId
      });
      try {
      // Get the new lyric by the response id and then return it
      const newlyric = await Lyric.findOne({ id: response.raw[0].id})
      return newlyric;
      } catch (err) {
      console.log(err);
      return err;
    }
  }else {
    // If the user is not the project creator
    // Loop through the project contributors
    for(var x = 0; x < project.contributors.length; x ++) {
      // If the logged in user's id matches one of the contributors 
      // Allow them to insert the Lyric
      if(userId === project.contributors[x]){
         // Insert data into the Lyric table
      const response = await Lyric.insert({
        lyric,
        option,
        projectId
      });
      try {
      // Get the new lyric by the response id and then return it
      const newlyric = await Lyric.findOne({ id: response.raw[0].id})
      return newlyric;
      } catch (err) {
        console.log(err);
        return err;
        }
      } else {
     // Return error as user is not authenticated to edit the project
     throw new Error("User is not authenticated to edit this project")
      }
    }
  }
}

  // MUTATION      CREATE Tab
  // RETURN        Array of tabs within that project
  // USED          On /workspace/:projectId : The project's workspace
 @Mutation(() => Tab)
 @UseMiddleware(isAuth)
 async createTab(
   @Arg('tab', () => [String]) tab: string[], 
   @Arg('description') description: string,
   @Arg('projectId') projectId: string,
   @Ctx() { payload } : MyContext,
) {
   const userId = payload?.userId
   // Find the current project
   const project = await Project.findOne({ where : { id: projectId }})
   if(!project) {
     throw new Error("There is no project");
   }
   // Check if the user is the project creator
   // To see if they are authorised to edit the project
   if(userId === project.creatorId) {
     // Insert the tab into the table
      const response = await Tab.insert({
        tab,
        description,
        project: project
      });
      try {
        // Return all the tabs that are related to the project 
        // const allTabs = await Tab.find({projectId : project.id})
        const newTab = await Tab.findOne({id: response.raw[0].id})
        return newTab
      }catch(err) {
        return err;
      }
    }else {
      // If the user is not the project creator
      // Loop through the project contributors
      for(var x = 0; x < project.contributors.length; x ++) {
        // If the logged in user's id matches one of the contributors 
        // Allow them to insert the tab
        if(userId === project.contributors[x]){
          await Tab.insert({
            tab,
            description,
            project: project
          });
          try {
           // Return all the tabs that are related to the project 
            const allTabs = await Tab.find({projectId : project.id})
            return allTabs
          }catch(err) {
            return err;
          }
        } else {
          // Return error as user is not authenticated to edit the project
          throw new Error("User is not authenticated to edit this project")
        }
       }
    }
 }
 
  // MUTATION      CREATE Tracks
  // RETURN        Array of tracks within that project
  // USED          On /workspace/:projectId : The project's workspace
 @Mutation(() => Track)
  @UseMiddleware(isAuth)
  async createTrack(
    @Arg('name') name: string,
    @Arg('projectId') projectId: string,
    @Ctx() { payload } : MyContext,
  ) {
    const userId = payload?.userId
    // Find the current project
    const project = await Project.findOne({ where : { id: projectId }})
    if(!project) {
      throw new Error("There is no project");
    }

    // Check if the user is the project creator
    // To see if they are authorised to edit the project
    if(userId === project.creatorId) {
      // Insert the track into the table
     const response = await Track.insert({
        name,
        project: project
      });
      try {
        console.log(response.raw[0].id);
        const newTrack = await Track.findOne({ where : { id : response.raw[0].id }})
        return newTrack;
      }catch(err) {
        return err;
      }
     } else {
       // If the user is not the project creator
       // Loop through the project contributors
       for(var x = 0; x < project.contributors.length; x ++) {
         // If the logged in user's id matches one of the contributors 
         // Allow them to insert the track
         if(userId === project.contributors[x]){

          const response = await Track.insert({
            name,
            project: project
          });
          try {
            const newTrack = await Track.findOne({ where : { id : response.raw[0].id }})
            return newTrack;
          }catch(err) {
            return err;
          }
        }
      }
     }
    //  return true;
  }

  // MUTATION      DELETE Lyric
  // RETURN        Array of Lyrics within that project
  // USED          On /workspace/:projectId : The project's workspace
  @Mutation(() => [Lyric])
  @UseMiddleware(isAuth)
  async deleteLyric(
      @Arg("projectId") projectId: string,
      @Arg("lyricId") lyricId: number,
      @Ctx() { payload } : MyContext,
    ) {
      const userId = payload?.userId
      // Find the current project
      const project = await Project.findOne({ where : { id: projectId }})
      if(!project) {
        throw new Error("There is no project");
      }

      // Check if the user is the project creator
      // To see if they are authorised to edit the project
      if(userId === project.creatorId) {
      // Find lyric by its id and the related projectId
      const lyric = await Lyric.find({projectId, id : lyricId});
      await Lyric.remove(lyric);
      // Return all lyrics related to the
      return Lyric.find({projectId});
      } else {
        // If the user is not the project creator
       // Loop through the project contributors
       for(var x = 0; x < project.contributors.length; x ++) {
        // If the logged in user's id matches one of the contributors 
        // Allow them to insert the track
        if(userId === project.contributors[x]){
          // Find lyric by its id and the related projectId
          const lyric = await Lyric.find({projectId, id : lyricId});
          await Lyric.remove(lyric);
          // Return all lyrics related to the
          return Lyric.find({projectId});
        } else {
          // Return error as user is not authenticated to edit the project
          throw new Error("User is not authenticated to edit this project.")
        }
      }
      return Lyric.find({projectId});
    }
  }
  // MUTATION      DELETE Tab
  // RETURN        Array of Tabs within that project
  // USED          On /workspace/:projectId : The project's workspace
  @Mutation(() => [Tab])
  @UseMiddleware(isAuth)
  async deleteTab(
      @Arg("projectId") projectId: string,
      @Arg("tabId", () => Int) tabId: number,
      @Ctx() { payload } : MyContext,
    ) {
      const userId = payload?.userId
      // Find the current project
      const project = await Project.findOne({ where : { id: projectId }})
      if(!project) {
        throw new Error("There is no project");
      }
      // Check if the user is the project creator
      // To see if they are authorised to edit the project
      if(userId === project.creatorId) {
      // Find Tab by its id and the related projectId
      const tab = await Tab.find({projectId, id : tabId});
      await Tab.remove(tab);
      // Return all lyrics related to the
      return Tab.find({projectId});
      } else {
        // If the user is not the project creator
       // Loop through the project contributors
       for(var x = 0; x < project.contributors.length; x ++) {
        // If the logged in user's id matches one of the contributors 
        // Allow them to insert the track
        if(userId === project.contributors[x]){
          // Find lyric by its id and the related projectId
          const tab = await Tab.find({projectId, id : tabId});
          await Tab.remove(tab);
          // Return all lyrics related to the
          return Tab.find({projectId});
        } else {
          // Return error as user is not authenticated to edit the project
          throw new Error("User is not authenticated to edit this project.")
        }
      }
      return Tab.find({projectId});
    }
  }

 // MUTATION      ADD Contributor to the project : ONLY CREATOR CAN PERFORM ACTION
 // RETURN        The Project
 // USED          On /projects : On the project component and also workspace
 @Mutation(() => [User])
 @UseMiddleware(isAuth)
 async addContributor(
   @Arg('userId', () => Int) userId: number,
   @Arg('projectId') projectId: string,
   @Ctx() { payload } : MyContext
 ) {
   const myId = payload!.userId
   const project = await Project.findOne({ where : { id: projectId, creatorId: myId} })
   if(!project) {
     throw new Error("There is no project");
   }
   // Assign variable with the project contributors
   var contributors = project.contributors;
   // Loop through the contributors 
   for(var x = 0; x < contributors.length; x++) {
     // If the userId matches to one in the contributors
     // Then return error
     if(userId === contributors[x]) {
      throw new Error("User is already a contributor"); 
     }
   }
   // If user isnt in the array already push them to array
   contributors.push(userId);
   // Update the Contributors field in project with the new array
   await getConnection()
   .createQueryBuilder()
   .update(Project)
   .set({ contributors })
   .where('id = :id', {
     id : projectId,
   })
   .returning("*")
   .execute();

   try { 
     // Find the selected project
     const updatedProject = await Project.findOne({ where : { id: projectId, creatorId: myId} })
     // Array that will hold the users 
     let arrayOfUsers = [];
     // Loop through the contributors array for that project
     for(let x = 0; x < updatedProject!.contributors.length; x ++) {
       // Find the related user to their id and push to new array
      arrayOfUsers.push(await User.findOne({where : { id : updatedProject!.contributors[x]}}))
     }
     // Return an array of users
     return arrayOfUsers;
   }catch(err) {
     return err
   }
 }
 // MUTATION      REMOVE Contributor to the project : ONLY CREATOR CAN PERFORM ACTION
 // RETURN        The Project
 // USED          On /projects : On the project component and also workspace
 @Mutation(() => User)
 @UseMiddleware(isAuth)
 async removeContributor(
   @Arg('userId', () => Int) userId: number,
   @Arg('projectId') projectId: string,
   @Ctx() { payload } : MyContext
 ) {
   const myId = payload!.userId
   const project = await Project.findOne({ where : { id: projectId, creatorId: myId} })
   if(!project) {
     throw new Error("There is no project");
   }
   // Assign variable with the project contributors
   var contributors = project.contributors;
   var index: number = -1;
   // Loop through the contributors 
   for(var x = 0; x < contributors.length; x++) {
     // If the userId matches to one in the contributors
     if(userId === contributors[x]) {
       // Find index of that contributor
      index = contributors.indexOf(contributors[x]);
     }
   }
   // If index has a value then splice the item out of array from the index given
   if(index !== -1) {
    contributors.splice(index!, 1);
   } else {
     throw new Error("User is already not a contributor")
   }
   // Update the Contributors field in project with the new array
   await getConnection()
   .createQueryBuilder()
   .update(Project)
   .set({ contributors })
   .where('id = :id', {
     id : projectId,
   })
   .returning("*")
   .execute();

   try {
    // Get the removed and return them
    const removedUser = await User.findOne({where: { id : userId }});
    return removedUser;
   }catch(err) {
     return err
   }
 }

  // MUTATION      DELETE Project by it's id
  // RETURN        Array od the User's projects 
  // USED          /projects
  @Mutation(() => [Project])
  @UseMiddleware(isAuth)
    async deleteProject(
      @Arg("id") id: string,
      @Ctx() { payload } : MyContext
  ) {
      const userId = payload!.userId;
      const project = await Project.findOne({creatorId:userId, id });
      if(!project) {
        throw new Error("There is no existing project or you are unauthorized to delete the project");
      }
      // Find the lyrics, tabs and tracks related to the project
      const lyrics = await Lyric.find({projectId : project!.id});
      const tabs = await Tab.find({projectId : project!.id});
      // const tracks = await Track.find({projectId : project!.id});
      // Remove all the lyrics, tabs and tracks along the project too
      await Tab.remove(tabs)
      await Lyric.remove(lyrics);
      await Project.remove(project);
      // Find the user's projects and return them
      const projects = Project.find({creatorId:payload!.userId });
      return projects;
  }
  // MUTATION      CREATE Project
  // RETURN        The Project id
  // USED          On createProject component
  @Mutation(() => ProjectResponse)
  @UseMiddleware(isAuth)
  async createProject(
    @Arg('name') name: string,
    @Arg('isPublic') isPublic: boolean,
    @Ctx() { payload } : MyContext,
  ) {
    const id = payload!.userId;
    const user = await User.findOne({where : { id }})
    // Check if the is already a project with this name under the user
    const project = await Project.findOne({ where : { creatorId: id, name } })
    if(project) {
      return {
        error: true,
        payload: "You already have a project with this name",
       };
    }
    try {
      // Insert the new project into the table 
      const response = await Project.insert({
        creator: user,
        name,
        isPublic,
        tab: [],
        contributors : [user!.id]
      });
      return {
       error: false,
       payload:response.raw[0].id
      };
    } catch (err) {
      return err;
    }
  }
  
  //////// FOR TESTING /////////

  // Delete all for testing
  @Mutation(() => Boolean)
  async deleteAll() {
    const project = await Project.find();
    const lyric =  await Lyric.find()  
    const tabs =  await Tab.find()
    await Tab.remove(tabs);
    await Lyric.remove(lyric);
    await Project.remove(project);
    return true;
  }

  // GET      All Projects in db : FOR TESTING
  // RETURN   Array of Projects
  // USED     FOR TESTING
  @Query(() => [Project])
  async projects() {
    return Project.find()
  }
  // Get All Lyrics  : JUST FOR TESTING
  // Query returning Lyric array
  @Query(() => [Lyric])
  async allLyrics() {
    return Lyric.find()
  }

}