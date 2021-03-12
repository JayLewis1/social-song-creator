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
import { MyContext }  from "../context/MyContext";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
// Entities
import { User } from "../entity/User";
import { Notification } from './../entity/Notification';

@ObjectType()
class NotificationResponse {
  @Field()
  reqBlocked: boolean;
  @Field()
  status: string;
  @Field()
  type: string;
}

@Resolver()
export class NotificationResolver {
    // GET      All Notification from logged in user
    // RETURN   Array of notifications
    // USED     Within the header
    @Query(() => [Notification])
    @UseMiddleware(isAuth)
    async notifications(
      @Ctx() { payload } : MyContext
    ) {
      return await Notification.find({recipient: payload!.userId})   
    }
    // GET      Check if there is already a notification
    // RETURN   Array of notifications
    // USED     Within the header
    @Query(() => Boolean)
    @UseMiddleware(isAuth)
    async validateNotification(
      @Arg("recipient", () => Int) recipient : number,
      @Arg("type") type: string,
      @Ctx() { payload } : MyContext
    ) {
      const notification = await Notification.findOne({ where : { senderId : payload!.userId, recipient, type }})

      if(notification) {
        return true
      }
      return false
    }
  
  
    // MUTATION       DELETE notification
    // RETURN         Array of notifications
    // USED           Within the header
   @Mutation(() => [Notification])
   @UseMiddleware(isAuth)
   async deleteNotification(
    @Arg("id", () => Int) id : number,
    @Ctx() { payload } : MyContext
   ) {
     // Find notification by it's id and making sure the recipient is the logged in user
    const notification: any = await Notification.findOne({ where: { id, recipient: payload!.userId}})
    // Remove the selecte notifications
    await Notification.remove(notification);
     try{
      return await Notification.find({ where: { recipient: payload!.userId}})
     }catch(err) {
      return err;
     }
   }
  
    // MUTATION       SEND notification
    // RETURN         Notification response
    // USED           Within the header
   @Mutation(() => NotificationResponse)
   @UseMiddleware(isAuth)
   async sendNotfication(
    @Arg("recipient", () => Int) recipient : number,
    @Arg("message") message : string,
    @Arg("type") type : string,
    @Ctx() { payload } : MyContext
   ) { 
    // Find the logged in user and assign to sender variable
    const myId = payload!.userId
    const sender: any = await User.findOne({ where : { id: myId } })  
    // Check if the same notifcation has already been sent by checking : loggedin id, recipientId and type
    // This stops notifcation spam
    const alreadySent = await Notification.findOne({ where : { senderId : myId, recipient, type }})
    if(alreadySent && type === alreadySent.type) {
      // Return that requets has been sent and send back that the req is blocked sp we can handle correctly on frontend
      return {
        reqBlocked: true,
        status : "Request has already been sent",
        type: type
      }
    }

    // Check if the recipient has already sent you a request
    // This is used for mate requests stopping unwanted notfications and cleaner requests
    const userHasAlreadySentReq = await Notification.findOne({ where : { senderId : recipient, recipient: myId, type }})
    // If a request has already been sent from recipient then accept the request instead of making a new one
    if(userHasAlreadySentReq) {
      const me: any = await User.findOne({ where : { id: myId } }) 
      const mate : any = await User.findOne({ where : { id: recipient } })
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
     if(mates[x] === recipient) {
      index = mates.indexOf(mates[x]);
     }
   }
   // If they're not our mate then pust to the array
   if(index! === undefined) {
    mates.push(recipient);
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
     id : recipient
   })
   .returning("*")
   .execute();
      try { 
        // When request has been accepted delete the notifcation that was sent to you
        const deleteThisNotfication = await Notification.findOne({ where : { id : userHasAlreadySentReq.id }})
        await  Notification.remove(deleteThisNotfication!);
        return {
          reqBlocked: false,
          status : "Accepted Mate Request",
          type: type
        }
      } catch (err) {
          return err;
      }
    }
     // If passed the validation and all okay then insert notification 
     // This will show in recipeints notifcations when their page has been reloaded
     await Notification.insert({
      recipient,
      senderId : myId,
      senderName: sender.firstName,
      avatar: sender.avatar,
      message,
      type
     })
    
     try{
      // Return our notification response so we can handle correctly on frontend
      return {
        reqBlocked: false,
        status : "Request sent",
        type: type
      }
     }catch(err) {
      return err;
     }
   }
  }