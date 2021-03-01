import { RootState } from './reducers';
import {Middleware} from "redux";

export const appMiddleware : Middleware< 
{},
RootState> = store => next => action => {

}

